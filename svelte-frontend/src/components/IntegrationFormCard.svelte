<script lang="ts">
  import { Tabs } from 'bits-ui';
  import type { Connector, NotifyUser } from '../types';
  import VariantForm from './VariantForm.svelte';
  import StickyActionBar from './StickyActionBar.svelte';
  import PonderChat from './PonderChat.svelte';
  import AddIntegratorsDialog from './AddIntegratorsDialog.svelte';
  import { formData, validationErrors, connectionInstances, activeInstanceId } from '../stores/connectorStore';
  import { formatDaysRemaining, formatDaysConnected, formatNextNudge, isOverdue, isDueSoon } from '../utils/dateUtils';
  import { tenants } from '../data/tenants';
  
  export let connector: Connector;
  
  let activeTab = connector.variants.find(v => v.recommended)?.id || connector.variants[0]?.id;
  let testResult: { success: boolean; message: string } | null = null;
  let testing = false;
  let isFormValid = false;
  let ponderTab: 'chat' | 'documentation' = 'chat';
  let isIntegratorsDialogOpen = false;
  
  // Get the current tenant's users for the dialog
  const currentTenant = tenants[0]; // In production, this would be the current user's tenant
  
  $: activeVariant = connector.variants.find(v => v.id === activeTab);
  $: activeInstance = $activeInstanceId ? 
    Object.values($connectionInstances).flat().find(inst => inst.id === $activeInstanceId) : 
    null;
  
  function getConnectionStatusColor(connected: boolean, prioritized: boolean): string {
    if (connected) return 'bg-green-500';
    if (prioritized) return 'bg-red-500';
    return 'bg-gray-400';
  }
  
  function getConnectionStatusText(connected: boolean): string {
    return connected ? 'Connected' : 'Not Connected';
  }
  
  async function handleTestConnection() {
    if (!activeInstance || !activeVariant) return;
    
    testing = true;
    testResult = null;
    
    // Mock test connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    testResult = {
      success: true,
      message: activeVariant.testConfig.expectedResponse.successMessage,
    };
    
    // Update instance test status
    const variantId = activeInstance.variantId;
    const instances = $connectionInstances[variantId] || [];
    $connectionInstances = {
      ...$connectionInstances,
      [variantId]: instances.map(inst => 
        inst.id === activeInstance.id 
          ? { ...inst, testStatus: 'success' as const, lastTested: new Date().toISOString() }
          : inst
      )
    };
    
    testing = false;
  }
  
  function handleSave() {
    if (!activeInstance) return;
    
    console.log('Saving configuration:', {
      connectorId: connector.id,
      instanceId: activeInstance.id,
      instanceName: activeInstance.name,
      variantId: activeVariant?.id,
      data: $formData,
    });
    
    alert(`Configuration "${activeInstance.name}" saved! (Mock)`);
  }
  
  function handleValidationChange(valid: boolean) {
    isFormValid = valid;
  }
  
  function openIntegratorsDialog() {
    isIntegratorsDialogOpen = true;
  }
  
  function handleIntegratorsSave(event: CustomEvent<NotifyUser[]>) {
    // Update the connector's priorityNotifyUsers
    connector.priorityNotifyUsers = event.detail;
    console.log('Updated integrators:', connector.priorityNotifyUsers);
    // In a real app, you would save this to your backend here
  }
</script>

<div class="flex gap-6 mb-20">
  <!-- Main Content Area -->
  <div class="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
  <!-- Header -->
  <div class="p-6 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center gap-4">
      <!-- Logo from logo.dev -->
      <img src={connector.icon} alt="{connector.name} logo" class="w-16 h-16 rounded-lg object-contain" />
      <div class="flex-1">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {connector.name}
        </h2>
      </div>
    </div>
    
    <!-- Integrators Section with Add Button -->
    <div class="mt-4 space-y-3">
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Integrators
        </div>
        <button
          on:click={openIntegratorsDialog}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Integrator(s)
        </button>
      </div>
      
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
      {:else}
        <div class="text-sm text-gray-500 dark:text-gray-400 py-2">
          No integrators assigned yet. Click "Add Integrator(s)" to assign users.
      </div>
    {/if}
    </div>
  </div>
  
  <!-- Tabs for Variants -->
  <Tabs.Root bind:value={activeTab} class="w-full">
    <Tabs.List class="flex border-b border-gray-200 dark:border-gray-700 px-6">
        {#if connector.variants.length > 1}
          {#each connector.variants as variant}
            <Tabs.Trigger 
              value={variant.id}
              class="px-4 py-3 text-sm font-medium transition-colors relative data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-600 dark:data-[state=active]:after:bg-blue-400"
            >
              {variant.name}
              {#if variant.recommended}
                <span class="ml-1 text-amber-500">★</span>
              {/if}
            </Tabs.Trigger>
          {/each}
        {:else}
          <!-- Single variant - show as active tab -->
          <Tabs.Trigger 
            value={connector.variants[0].id}
            class="px-4 py-3 text-sm font-medium transition-colors relative data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-600 dark:data-[state=active]:after:bg-blue-400"
          >
            {connector.variants[0].name}
          </Tabs.Trigger>
        {/if}
    </Tabs.List>
      
    {#each connector.variants as variant}
      <Tabs.Content value={variant.id}>
        <div class="p-6">
          <VariantForm variant={variant} connectorId={connector.id} onValidationChange={handleValidationChange} />
        </div>
      </Tabs.Content>
    {/each}
  </Tabs.Root>
  </div>
  
  <!-- Parable Ponder Sidebar - Always visible on the right -->
  <div class="w-[500px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col sticky top-6" style="max-height: calc(100vh - 120px - 1.5rem);">
    <!-- Ponder Header with Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-900/10 to-pink-900/10">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white px-6 pt-4 pb-2">
        💬 Parable Ponder
      </h3>
      <div class="flex px-6">
        <button
          on:click={() => ponderTab = 'chat'}
          class="px-4 py-3 text-sm font-medium transition-colors relative {ponderTab === 'chat' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}"
        >
          Chat
          {#if ponderTab === 'chat'}
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"></div>
          {/if}
        </button>
        <button
          on:click={() => ponderTab = 'documentation'}
          class="px-4 py-3 text-sm font-medium transition-colors relative {ponderTab === 'documentation' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}"
        >
          Documentation
          {#if ponderTab === 'documentation'}
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"></div>
          {/if}
        </button>
      </div>
    </div>
    
    <!-- Ponder Content -->
    <div class="flex-1 overflow-hidden">
      {#if ponderTab === 'chat'}
        <PonderChat connector={connector} />
      {:else}
        <div class="p-6 overflow-y-auto h-full">
        <div class="space-y-3">
          <a
            href={connector.documentationPath}
            target="_blank"
            rel="noopener noreferrer"
            class="block p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="font-medium text-gray-900 dark:text-white mb-1">
              📖 Main Documentation
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Complete guide to {connector.name} integration
            </div>
          </a>
          
          {#each connector.variants as variant}
            <a
              href={variant.documentationPath}
              target="_blank"
              rel="noopener noreferrer"
              class="block p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="font-medium text-gray-900 dark:text-white mb-1">
                📝 {variant.name} Setup Guide
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Step-by-step instructions for {variant.name}
              </div>
            </a>
          {/each}
        </div>
      </div>
      {/if}
    </div>
  </div>
    
</div>

<!-- Sticky Action Bar at Bottom -->
<StickyActionBar 
  {connector} 
  {testing}
  {testResult}
  canSave={testResult?.success || false}
  activeConnectionName={activeInstance?.name || null}
  onTest={handleTestConnection}
  onSave={handleSave}
/>

<!-- Add Integrators Dialog -->
<AddIntegratorsDialog
  bind:isOpen={isIntegratorsDialogOpen}
  availableUsers={currentTenant.users}
  currentIntegrators={connector.priorityNotifyUsers || []}
  on:close={() => isIntegratorsDialogOpen = false}
  on:save={handleIntegratorsSave}
/>

