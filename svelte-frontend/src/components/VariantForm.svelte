<script lang="ts">
  import { onMount } from 'svelte';
  import type { ConnectorVariant, ConnectionInstance } from '../types';
  import { connectionInstances, activeInstanceId } from '../stores/connectorStore';
  import ConnectionInstanceAccordion from './ConnectionInstanceAccordion.svelte';
  
  export let variant: ConnectorVariant;
  export let connectorId: string;
  export let onValidationChange: (isValid: boolean) => void;
  
  let instances: ConnectionInstance[] = [];
  
  // Subscribe to connection instances for this variant
  $: instances = $connectionInstances[variant.id] || [];
  
  // Initialize on mount to avoid cyclical dependency
  onMount(() => {
    if (!$connectionInstances[variant.id] || $connectionInstances[variant.id].length === 0) {
      const defaultInstance: ConnectionInstance = {
        id: `${variant.id}-${Date.now()}`,
        name: 'Primary Connection',
        variantId: variant.id,
        config: {},
        createdAt: new Date().toISOString(),
      };
      
      connectionInstances.update(current => ({
        ...current,
        [variant.id]: [defaultInstance]
      }));
      
      $activeInstanceId = defaultInstance.id;
    } else if (instances.length > 0) {
      // Always open the first instance (Primary Connection) by default when visiting a connector
      $activeInstanceId = instances[0].id;
    }
  });
  
  function handleToggle(instanceId: string) {
    $activeInstanceId = $activeInstanceId === instanceId ? null : instanceId;
  }
  
  function handleNameChange(instanceId: string, newName: string) {
    $connectionInstances = {
      ...$connectionInstances,
      [variant.id]: instances.map(inst => 
        inst.id === instanceId ? { ...inst, name: newName } : inst
      )
    };
  }
  
  function handleDelete(instanceId: string) {
    const filteredInstances = instances.filter(inst => inst.id !== instanceId);
    
    $connectionInstances = {
      ...$connectionInstances,
      [variant.id]: filteredInstances
    };
    
    // If we deleted the active instance, clear or set to first instance
    if ($activeInstanceId === instanceId) {
      $activeInstanceId = filteredInstances.length > 0 ? filteredInstances[0].id : null;
    }
  }
  
  function addNewInstance() {
    const newInstance: ConnectionInstance = {
      id: `${variant.id}-${Date.now()}`,
      name: `Connection ${instances.length + 1}`,
      variantId: variant.id,
      config: {},
      createdAt: new Date().toISOString(),
    };
    
    $connectionInstances = {
      ...$connectionInstances,
      [variant.id]: [...instances, newInstance]
    };
    
    $activeInstanceId = newInstance.id;
  }
</script>

<div class="space-y-4 pb-8">
  <!-- Connection Instances -->
  {#each instances as instance (instance.id)}
    <ConnectionInstanceAccordion
      {instance}
      {variant}
      isOpen={$activeInstanceId === instance.id}
      onToggle={() => handleToggle(instance.id)}
      onNameChange={(newName) => handleNameChange(instance.id, newName)}
      onDelete={() => handleDelete(instance.id)}
      {onValidationChange}
    />
  {/each}
  
  <!-- Add New Connection Button -->
  <button
    on:click={addNewInstance}
    class="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center justify-center gap-2"
  >
    <span class="text-lg">+</span>
    <span class="font-medium">Add Connection</span>
  </button>
</div>

