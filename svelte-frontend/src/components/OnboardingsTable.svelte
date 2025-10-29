<script lang="ts">
  import { onboardings } from '../data/onboardings';
  import type { Onboarding } from '../data/onboardings';
  
  let searchQuery = '';
  let localOnboardings = [...onboardings];
  let showEndOnboarding: string | null = null;
  
  $: filteredOnboardings = localOnboardings.filter(onboarding => 
    onboarding.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    onboarding.csContact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    onboarding.salesContact.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  function getStatusColor(status: Onboarding['status']): string {
    switch (status) {
      case 'discovery':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'implementation':
        return 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300';
      case 'testing':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
      case 'live':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'on-hold':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
    }
  }
  
  function updateStatus(id: string, newStatus: string) {
    localOnboardings = localOnboardings.map(onboarding => 
      onboarding.id === id ? { ...onboarding, status: newStatus as Onboarding['status'] } : onboarding
    );
    console.log(`Updated status for onboarding ${id} to ${newStatus}`);
  }
  
  function endOnboarding(id: string) {
    const onboarding = localOnboardings.find(o => o.id === id);
    if (onboarding) {
      localOnboardings = localOnboardings.filter(o => o.id !== id);
      console.log(`Ended onboarding for ${onboarding.company}`);
      showEndOnboarding = null;
    }
  }
</script>

<div class="space-y-4">
  <!-- Search Bar -->
  <div class="relative">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search onboardings..."
      class="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
  
  <!-- Table -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
    <table class="w-full">
      <thead class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Company
          </th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Status
          </th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            CS Contact
          </th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Sales Contact
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        {#each filteredOnboardings as onboarding (onboarding.id)}
          <tr class="group hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <img 
                  src="https://img.logo.dev/{onboarding.domain}?token=pk_N2gy3fJKQ0aldg9QTg7cHA" 
                  alt="{onboarding.company} logo" 
                  class="w-10 h-10 rounded-lg object-contain bg-white p-1 border border-gray-200"
                  on:error={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(onboarding.company)}&background=random&size=128`;
                  }}
                />
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{onboarding.company}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{onboarding.domain}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <select
                value={onboarding.status}
                on:change={(e) => {
                  const target = e.currentTarget;
                  updateStatus(onboarding.id, target.value);
                }}
                class="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="discovery">Discovery</option>
                <option value="implementation">Implementation</option>
                <option value="testing">Testing</option>
                <option value="live">Live</option>
                <option value="on-hold">On Hold</option>
              </select>
            </td>
            <td class="px-6 py-4 text-gray-900 dark:text-white">
              {onboarding.csContact}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-900 dark:text-white">{onboarding.salesContact}</span>
                <button
                  on:click|stopPropagation={() => showEndOnboarding = onboarding.id}
                  class="px-3 py-1 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  End Onboarding
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- End Onboarding Confirmation Modal -->
{#if showEndOnboarding}
  {@const onboardingToEnd = localOnboardings.find(o => o.id === showEndOnboarding)}
  {#if onboardingToEnd}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" on:click={() => showEndOnboarding = null}>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4" on:click|stopPropagation>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">End Onboarding</h3>
        
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Are you sure you want to end the onboarding for <strong>{onboardingToEnd.company}</strong>?
        </p>
        
        <div class="flex gap-3 mt-6">
          <button
            on:click={() => showEndOnboarding = null}
            class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            on:click={() => endOnboarding(onboardingToEnd.id)}
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            End Onboarding
          </button>
        </div>
      </div>
    </div>
  {/if}
{/if}

