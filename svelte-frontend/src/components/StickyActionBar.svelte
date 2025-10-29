<script lang="ts">
  import { Button } from 'bits-ui';
  import type { Connector } from '../types';
  import { formatDaysRemaining, formatDaysConnected, isOverdue, isDueSoon } from '../utils/dateUtils';
  
  export let connector: Connector;
  export let onTest: () => void;
  export let onSave: () => void;
  export let testing: boolean = false;
  export let testResult: { success: boolean; message: string } | null = null;
  export let canSave: boolean = false;
  export let activeConnectionName: string | null = null;
  
  function getConnectionStatusColor(connected: boolean, prioritized: boolean): string {
    if (connected) return 'bg-green-500';
    if (prioritized) return 'bg-red-500';
    return 'bg-gray-400';
  }
  
  function getConnectionStatusText(connected: boolean): string {
    return connected ? 'Connected' : 'Not Connected';
  }
  
  $: testButtonText = activeConnectionName ? `Test ${activeConnectionName}` : 'Test Connection';
</script>

<div class="fixed bottom-0 left-48 right-0 {connector.prioritized ? 'bg-red-50 dark:bg-red-950 border-t-2 border-red-200 dark:border-red-800' : 'bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700'} shadow-2xl z-50">
  <div class="container mx-auto px-4 py-4 max-w-6xl">
    <div class="flex items-center justify-between gap-4">
      <!-- Left: Due Date Badge -->
      <div class="flex items-center gap-3">
        {#if connector.connected && connector.connectedDate}
          {@const daysConnected = formatDaysConnected(connector.connectedDate)}
          <span class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
            📅 {daysConnected}
          </span>
        {:else if connector.prioritized && connector.priorityDueDate}
          {@const daysText = formatDaysRemaining(connector.priorityDueDate)}
          {@const overdue = isOverdue(connector.priorityDueDate)}
          {@const dueSoon = isDueSoon(connector.priorityDueDate)}
          <span class="inline-block px-3 py-2 text-sm font-bold rounded-lg bg-red-600 dark:bg-red-700 text-white {overdue ? 'animate-pulse' : ''}">
            🎯 {daysText}
          </span>
        {/if}
      </div>
      
      <!-- Center: Test Result -->
      {#if testResult}
        <div class="flex-1 max-w-md">
          <div 
            class="p-3 rounded-lg text-sm font-medium {testResult.success ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'}"
          >
            {testResult.message}
          </div>
        </div>
      {/if}
      
      <!-- Right: Connection Status & Action Buttons -->
      <div class="flex items-center gap-3">
        <!-- Connection Status (next to buttons) -->
        <span class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg {connector.connected ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : connector.prioritized ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'}">
          <div class="{getConnectionStatusColor(connector.connected, connector.prioritized)} w-2.5 h-2.5 rounded-full"></div>
          {getConnectionStatusText(connector.connected)}
        </span>
        
        <Button.Root
          on:click={onTest}
          disabled={testing || !activeConnectionName}
          class="px-6 py-3 bg-gray-800 dark:bg-gray-200 hover:bg-gray-900 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? '⏳ Testing...' : `🔌 ${testButtonText}`}
        </Button.Root>
        
        <Button.Root
          on:click={onSave}
          disabled={!canSave || !activeConnectionName}
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Configuration
        </Button.Root>
      </div>
    </div>
  </div>
</div>

<!-- Spacer to prevent content from being hidden under sticky bar -->
<div class="h-24"></div>

