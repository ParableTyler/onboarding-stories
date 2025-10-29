<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { NotifyUser } from '../types';
  import type { TenantUser } from '../data/tenants';
  
  export let isOpen = false;
  export let availableUsers: TenantUser[] = [];
  export let currentIntegrators: NotifyUser[] = [];
  
  const dispatch = createEventDispatcher<{
    close: void;
    save: NotifyUser[];
  }>();
  
  // Local state for managing selected integrators
  let selectedIntegrators: NotifyUser[] = [...currentIntegrators];
  let searchQuery = '';
  let selectedUser: TenantUser | null = null;
  let selectedRole: 'accountable' | 'informed' = 'accountable';
  
  // Filter out already added users
  $: filteredUsers = availableUsers.filter(user => 
    !selectedIntegrators.some(integrator => integrator.email === user.email) &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  function addIntegrator() {
    if (selectedUser) {
      selectedIntegrators = [...selectedIntegrators, {
        name: selectedUser.name,
        email: selectedUser.email,
        jobTitle: selectedUser.jobTitle,
        role: selectedRole
      }];
      selectedUser = null;
      searchQuery = '';
    }
  }
  
  function removeIntegrator(email: string) {
    selectedIntegrators = selectedIntegrators.filter(i => i.email !== email);
  }
  
  function handleSave() {
    dispatch('save', selectedIntegrators);
    close();
  }
  
  function close() {
    dispatch('close');
  }
  
  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Escape' && close()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <!-- Dialog -->
    <div 
      class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="document"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Add Integrator(s)
          </h2>
          <button
            on:click={close}
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close dialog"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Select users who will be responsible for or informed about connecting this integration.
        </p>
      </div>
      
      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        <!-- Add User Section -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Add User
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- User Selection -->
            <div>
              <label for="user-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select User
              </label>
              <div class="relative">
                <input
                  id="user-select"
                  type="text"
                  bind:value={searchQuery}
                  placeholder="Search by name, email, or title..."
                  class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {#if searchQuery && filteredUsers.length > 0}
                  <div class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {#each filteredUsers as user}
                      <button
                        type="button"
                        on:click={() => {
                          selectedUser = user;
                          searchQuery = user.name;
                        }}
                        class="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {user.email} • {user.jobTitle}
                        </div>
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
            
            <!-- Role Selection -->
            <div>
              <label for="role-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                id="role-select"
                bind:value={selectedRole}
                class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="accountable">Responsible</option>
                <option value="informed">Informed</option>
              </select>
            </div>
          </div>
          
          <button
            on:click={addIntegrator}
            disabled={!selectedUser}
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Add User
          </button>
        </div>
        
        <!-- Selected Integrators List -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Selected Integrators ({selectedIntegrators.length})
          </h3>
          
          {#if selectedIntegrators.length === 0}
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
              No integrators added yet. Add users above.
            </div>
          {:else}
            <div class="space-y-2">
              {#each selectedIntegrators as integrator}
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3 flex-1">
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br {integrator.role === 'accountable' ? 'from-purple-500 to-purple-600' : 'from-blue-500 to-blue-600'} flex items-center justify-center text-white font-semibold">
                        {integrator.name.charAt(0)}
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {integrator.name}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {integrator.email} • {integrator.jobTitle}
                      </div>
                    </div>
                    <div class="flex-shrink-0">
                      <span class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full {integrator.role === 'accountable' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'}">
                        {integrator.role === 'accountable' ? 'Responsible' : 'Informed'}
                      </span>
                    </div>
                  </div>
                  <button
                    on:click={() => removeIntegrator(integrator.email)}
                    class="ml-3 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                    aria-label="Remove {integrator.name}"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
        <button
          on:click={close}
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          on:click={handleSave}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
{/if}

