<script lang="ts">
  import { connectors } from '../data/connectors';
  import { selectedConnector } from '../stores/connectorStore';
  import { formatDaysRemaining, formatNextNudge, isOverdue, isDueSoon } from '../utils/dateUtils';
  
  let searchQuery = '';
  
  function selectConnector(connector: typeof connectors[0]) {
    selectedConnector.set(connector);
  }
  
  function getConnectionStatusColor(connector: typeof connectors[0]): string {
    if (connector.connected) return 'bg-green-500';
    if (connector.prioritized) return 'bg-red-500';
    return 'bg-gray-400';
  }
  
  function getConnectionStatusText(connector: typeof connectors[0]): string {
    if (connector.connected) return 'Connected';
    if (connector.prioritized) return 'Not Connected';
    return 'Not Connected';
  }
  
  function getRandomDataPoints(connectorId: string): number {
    // Generate consistent random number based on connector ID
    let hash = 0;
    for (let i = 0; i < connectorId.length; i++) {
      hash = ((hash << 5) - hash) + connectorId.charCodeAt(i);
      hash = hash & hash;
    }
    // Return a value between 1.0 and 9.9 billion
    return Math.abs(hash % 89) / 10 + 1.0;
  }
  
  // Filter connectors based on search query
  $: filteredConnectors = connectors.filter(connector => 
    connector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connector.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group and sort connectors
  $: prioritizedConnectors = filteredConnectors
    .filter(p => p.prioritized && !p.connected)
    .sort((a, b) => {
      // Sort by due date (most urgent first)
      if (a.priorityDueDate && b.priorityDueDate) {
        return new Date(a.priorityDueDate).getTime() - new Date(b.priorityDueDate).getTime();
      }
      return 0;
    });
  
  $: connectedConnectors = filteredConnectors
    .filter(p => p.connected)
    .sort((a, b) => a.name.localeCompare(b.name));
  
  $: otherConnectors = filteredConnectors
    .filter(p => !p.prioritized && !p.connected)
    .sort((a, b) => a.name.localeCompare(b.name));
</script>

<div class="space-y-8">
  <!-- Search Bar -->
  <div class="relative">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search connectors..."
      class="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>

  <!-- Prioritized Section -->
  {#if prioritizedConnectors.length > 0}
    <section>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span class="w-1 h-6 bg-red-500 rounded"></span>
        Prioritized
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each prioritizedConnectors as connector}
          <button
            on:click={() => selectConnector(connector)}
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left border border-gray-200 dark:border-gray-700 flex flex-col min-h-[200px] overflow-hidden"
          >
            <div class="p-6 flex-1">
              <div class="flex items-center gap-4 mb-4">
                <!-- Logo from logo.dev -->
                <img src={connector.icon} alt="{connector.name} logo" class="w-14 h-14 rounded-lg object-contain" />
                
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {connector.name}
                  </h3>
                </div>
              </div>
        
              <!-- User Badges (Full Width, Grouped) -->
              {#if connector.priorityNotifyUsers && connector.priorityNotifyUsers.length > 0}
                {@const accountable = connector.priorityNotifyUsers.filter(u => u.role === 'accountable')}
                {@const informed = connector.priorityNotifyUsers.filter(u => u.role === 'informed')}
                
                <div class="space-y-3">
                  {#if accountable.length > 0}
                    <div>
                      <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                        Responsible
                      </div>
                      <div class="flex flex-wrap gap-2">
                        {#each accountable as user}
                          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                            <div class="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                            {user.name} <span class="text-purple-600 dark:text-purple-400">({user.jobTitle})</span>
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                  
                  {#if informed.length > 0}
                    <div>
                      <div class="flex items-center gap-1.5 mb-1.5">
                        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Informed
                        </div>
                        {#if connector.nextNudgeDate}
                          <div class="text-xs text-gray-500 dark:text-gray-400">•</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">
                            {formatNextNudge(connector.nextNudgeDate)}
                          </div>
                        {/if}
                      </div>
                      <div class="flex flex-wrap gap-2">
                        {#each informed as user}
                          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                            <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            {user.name} <span class="text-blue-600 dark:text-blue-400">({user.jobTitle})</span>
                          </span>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
            
            <!-- Full Width Separator & Status Bar -->
            <div class="w-full border-t border-red-200 dark:border-red-800 py-3 px-4 flex items-center justify-between bg-red-50 dark:bg-red-950">
              <!-- Due Date (Bottom Left) -->
              {#if connector.priorityDueDate}
                {@const daysText = formatDaysRemaining(connector.priorityDueDate)}
                {@const overdue = isOverdue(connector.priorityDueDate)}
                {@const dueSoon = isDueSoon(connector.priorityDueDate)}
                <span class="inline-block px-2 py-1 text-xs font-bold rounded-full bg-red-600 dark:bg-red-700 text-white {overdue ? 'animate-pulse' : ''}">
                  🎯 {daysText}
                </span>
              {:else}
                <div></div>
              {/if}
              
              <!-- Connection Status (Bottom Right) -->
              <div class="flex items-center gap-1.5">
                <div class="{getConnectionStatusColor(connector)} w-2.5 h-2.5 rounded-full animate-ping-fast"></div>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {getConnectionStatusText(connector)}
                </span>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </section>
  {/if}
  
  <!-- Connected Section -->
  {#if connectedConnectors.length > 0}
    <section>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span class="w-1 h-6 bg-green-500 rounded"></span>
        Connected
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each connectedConnectors as connector}
          <button
            on:click={() => selectConnector(connector)}
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            <div class="p-6 flex-1">
              <div class="flex items-center gap-4">
                <!-- Logo from logo.dev -->
                <img src={connector.icon} alt="{connector.name} logo" class="w-14 h-14 rounded-lg object-contain" />
                
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {connector.name}
                  </h3>
                </div>
              </div>
            </div>
            
            <!-- Full Width Separator & Status Bar -->
            <div class="w-full border-t border-gray-200 dark:border-gray-700 py-3 px-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
              <!-- Data Points (Bottom Left) -->
              {#if connector.connectedDate}
                {@const dataPoints = getRandomDataPoints(connector.id)}
                <span class="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                  {dataPoints}B data points
                </span>
              {:else}
                <div></div>
              {/if}
              
              <!-- Connection Status (Bottom Right) -->
              <div class="flex items-center gap-1.5">
                <div class="{getConnectionStatusColor(connector)} w-2.5 h-2.5 rounded-full"></div>
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {getConnectionStatusText(connector)}
                </span>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </section>
  {/if}
  
  <!-- Other Section -->
  {#if otherConnectors.length > 0}
    <section>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span class="w-1 h-6 bg-gray-400 rounded"></span>
        Other
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each otherConnectors as connector}
          <button
            on:click={() => selectConnector(connector)}
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            <div class="p-6 flex-1">
              <div class="flex items-center gap-4">
                <!-- Logo from logo.dev -->
                <img src={connector.icon} alt="{connector.name} logo" class="w-14 h-14 rounded-lg object-contain" />
                
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {connector.name}
                  </h3>
                </div>
              </div>
            </div>
            
            <!-- Full Width Separator & Status Bar -->
            <div class="w-full border-t border-gray-200 dark:border-gray-700 py-3 px-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
              <!-- Empty left side -->
              <div></div>
              
              <!-- Connection Status (Bottom Right) -->
              <div class="flex items-center gap-1.5">
                <div class="{getConnectionStatusColor(connector)} w-2.5 h-2.5 rounded-full"></div>
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {getConnectionStatusText(connector)}
                </span>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </section>
  {/if}
</div>

