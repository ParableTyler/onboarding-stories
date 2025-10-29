<script lang="ts">
  import CompanyAnnouncementDialog from './CompanyAnnouncementDialog.svelte';
  
  export let tenantName: string = 'Acme Corp';
  export let tenantDomain: string = 'acme.com';
  export let sponsors: Array<{ name: string; jobTitle: string }> = [];
  export let hasPrioritizedConnections: boolean = false;
  export let headOfAI: { name: string; jobTitle: string } | null = null;
  export let directorOfIT: { name: string; jobTitle: string } | null = null;
  
  let isDialogOpen = false;
  let teamBuyInComplete = false;
  
  function openDialog() {
    isDialogOpen = true;
  }
  
  function handleSent() {
    teamBuyInComplete = true;
  }
  
  function handleLogoError(e: Event) {
    const img = e.currentTarget as HTMLImageElement;
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tenantName)}&background=random&size=128`;
  }
</script>

<div class="mb-8">
  <div class="relative w-[calc(100vw-12rem)] left-[calc(-50vw+50%+6rem)] px-8">
    <div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-purple-200 dark:border-purple-800">
      <div class="flex items-center gap-4">
        <img 
          src="https://img.logo.dev/{tenantDomain}?token=pk_N2gy3fJKQ0aldg9QTg7cHA" 
          alt="{tenantName} logo" 
          class="w-12 h-12 rounded-lg object-contain bg-white p-1.5 border border-gray-200 flex-shrink-0"
          on:error={handleLogoError}
        />
        <div class="flex-1">
            <div class="font-semibold text-gray-900 dark:text-white">
            {tenantName}'s Progress to Parable
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Nike leadership has greenlit Parable. Only one step left.
          </div>
        </div>
      </div>
    </div>
    
    <!-- Timeline Container - Full Width -->
    <div class="px-6 py-8">
      <div class="relative">
        <!-- Timeline Line -->
        <div class="absolute top-6 left-[10%] right-[10%] h-1 bg-gradient-to-r from-green-200 via-green-200 to-red-200 dark:from-green-800 dark:via-green-800 dark:to-red-800"></div>
        
        <!-- Timeline Steps Grid -->
        <div class="grid grid-cols-5 gap-4 relative">
          
      <!-- Step 1: Legal Review -->
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 relative z-10 ring-4 ring-white dark:ring-gray-800">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-200 dark:border-green-800 overflow-hidden w-full">
              <div class="p-4">
                <div class="flex flex-col gap-2 mb-2">
                  <h3 class="text-base font-bold text-gray-900 dark:text-white">
                  Legal Review
                </h3>
                  <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 self-start">
                  COMPLETE
                </span>
              </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Your legal team has reviewed Parable's data processing agreements, SOC 2 Type II compliance, GDPR adherence, and contractual terms. All privacy, security, and regulatory requirements have been validated.
              </p>
                <div class="flex items-start gap-1.5 text-xs font-medium text-green-700 dark:text-green-300">
                  <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                  <span>All compliance requirements validated—deployment authorized</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Security Review -->
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 relative z-10 ring-4 ring-white dark:ring-gray-800">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-200 dark:border-green-800 overflow-hidden w-full">
              <div class="p-4">
                <div class="flex flex-col gap-2 mb-2">
                  <h3 class="text-base font-bold text-gray-900 dark:text-white">
                  Security Review
                </h3>
                  <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 self-start">
                  COMPLETE
                </span>
              </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Your security team has audited Parable's encryption standards, access controls, penetration testing reports, and incident response procedures. The platform meets enterprise security requirements and has been cleared for deployment.
              </p>
                <div class="flex items-start gap-1.5 text-xs font-medium text-green-700 dark:text-green-300">
                  <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                  <span>Infrastructure vetted—ready for enterprise integration</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Contract Signed -->
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 relative z-10 ring-4 ring-white dark:ring-gray-800">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-200 dark:border-green-800 overflow-hidden w-full">
              <div class="p-4">
                <div class="flex flex-col gap-2 mb-2">
                  <h3 class="text-base font-bold text-gray-900 dark:text-white">
                  Contract Signed
                </h3>
                  <span class="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 self-start">
                  COMPLETE
                </span>
              </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Executive leadership has committed resources and signed the contract. Financial commitment made—budget approved and resources allocated. This strategic investment in reducing organizational friction and bureaucracy has been greenlit at the highest level.
              </p>
              {#if sponsors.length > 0}
                  <div class="flex flex-wrap gap-1.5">
                  {#each sponsors as sponsor}
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                      </svg>
                      {sponsor.name}, {sponsor.jobTitle}
                    </span>
                  {/each}
                </div>
              {/if}
          </div>
        </div>
      </div>

      <!-- Step 4: Company Announcement -->
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full {teamBuyInComplete ? 'bg-green-500' : 'bg-amber-500'} flex items-center justify-center flex-shrink-0 relative z-10 ring-4 ring-white dark:ring-gray-800">
                {#if teamBuyInComplete}
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                {:else}
                  <span class="text-white font-bold text-xl">!</span>
                {/if}
              </div>
              <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg border-2 {teamBuyInComplete ? 'border-green-200 dark:border-green-800' : 'border-amber-200 dark:border-amber-800'} overflow-hidden w-full {!teamBuyInComplete ? 'shadow-lg ring-2 ring-amber-400/50 dark:ring-amber-600/50' : ''}">
          <div class="p-4">
                  <div class="flex flex-col gap-2 mb-2">
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                    Company Announcement
                  </h3>
                </div>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {teamBuyInComplete 
                    ? 'Team announcement sent. Everyone is aligned and ready to support the integration.'
                    : 'Inform your team that this initiative is happening.'}
                </p>
                {#if !teamBuyInComplete && headOfAI}
              <div class="mb-2">
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                      </svg>
                      {headOfAI.name}, {headOfAI.jobTitle}
                    </span>
                  </div>
                {/if}
            {#if !teamBuyInComplete}
              <button
                on:click={openDialog}
                class="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
              >
                <span>Compose</span>
              </button>
            {:else}
              <div class="flex items-start gap-1.5 text-xs font-medium text-green-700 dark:text-green-300">
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Team has been notified—ready for integration work</span>
              </div>
              {/if}
              </div>
        </div>
      </div>

      <!-- Step 5: Complete Connections -->
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-full {!hasPrioritizedConnections ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center flex-shrink-0 relative z-10 ring-4 ring-white dark:ring-gray-800">
              {#if !hasPrioritizedConnections}
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              {:else}
                <span class="text-white font-bold text-xl">!</span>
              {/if}
            </div>
            <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg border-2 {!hasPrioritizedConnections ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'} overflow-hidden w-full {hasPrioritizedConnections ? 'shadow-lg ring-2 ring-red-400/50 dark:ring-red-600/50' : ''}">
              <div class="p-4">
                <div class="flex flex-col gap-2 mb-2">
                  <h3 class="text-base font-bold text-gray-900 dark:text-white">
                  Complete Connections
                </h3>
                  <span class="px-2 py-0.5 text-xs font-bold rounded-full {!hasPrioritizedConnections ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'} self-start">
                  {!hasPrioritizedConnections ? 'COMPLETE' : 'BLOCKED'}
                </span>
              </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-3">
                {#if !hasPrioritizedConnections}
                  All critical integrations have been successfully configured and connected. The platform is fully operational and ready to deliver insights.
                {:else}
                  Connect all prioritized integrations to complete the deployment. Each integration is essential for comprehensive visibility into your tenant's workflows.
                {/if}
              </p>
              {#if hasPrioritizedConnections && directorOfIT}
                <div>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    {directorOfIT.name}, {directorOfIT.jobTitle}
                  </span>
                </div>
                {/if}
              </div>
            </div>
          </div>
          
        </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Company Announcement Dialog -->
<CompanyAnnouncementDialog 
  bind:isOpen={isDialogOpen}
  tenantName={tenantName}
  on:close={() => isDialogOpen = false}
  on:sent={handleSent}
/>
