<script lang="ts">
  import { Collapsible } from 'bits-ui';
  import type { ConnectionInstance, ConnectorVariant } from '../types';
  import { formData, validationErrors } from '../stores/connectorStore';
  import FieldRenderer from './fields/FieldRenderer.svelte';
  
  export let instance: ConnectionInstance;
  export let variant: ConnectorVariant;
  export let isOpen: boolean;
  export let onToggle: () => void;
  export let onNameChange: (newName: string) => void;
  export let onValidationChange: (isValid: boolean) => void;
  export let onDelete: () => void;
  
  let isEditingName = false;
  let editedName = instance.name;
  let isHovering = false;
  
  // Separate markdown fields (prerequisites) from regular fields
  $: markdownFields = variant.formFields.filter(f => f.__typename === 'MarkdownField');
  $: regularFields = variant.formFields.filter(f => f.__typename !== 'MarkdownField');
  
  // Initialize form data with instance config
  $: if (isOpen) {
    $formData = { ...instance.config };
  }
  
  // Validate and notify parent
  $: if (isOpen) {
    const isValid = validateForm();
    onValidationChange(isValid);
  }
  
  function handleFieldChange(key: string, value: any) {
    $formData = { ...$formData, [key]: value };
    instance.config[key] = value;
    
    // Clear error for this field
    if ($validationErrors[key]) {
      const { [key]: _, ...rest } = $validationErrors;
      $validationErrors = rest;
    }
  }
  
  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    
    variant.formFields.forEach(field => {
      if (field.__typename === 'MarkdownField') return;
      
      const value = $formData[field.key];
      
      if (field.required && !value) {
        errors[field.key] = `${field.label} is required`;
      }
      
      // Type-specific validation
      if (value) {
        if (field.__typename === 'EmailField') {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(value)) {
            errors[field.key] = 'Invalid email format';
          }
        }
        
        if (field.__typename === 'URLField') {
          try {
            new URL(value);
          } catch {
            errors[field.key] = 'Invalid URL format';
          }
        }
        
        if (field.__typename === 'HostnameField') {
          const hostnameRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/;
          if (!hostnameRegex.test(value)) {
            errors[field.key] = 'Invalid hostname format';
          }
        }
      }
    });
    
    $validationErrors = errors;
    return Object.keys(errors).length === 0;
  }
  
  function handleNameEdit() {
    isEditingName = true;
  }
  
  function handleNameSave() {
    if (editedName.trim()) {
      onNameChange(editedName.trim());
    }
    isEditingName = false;
  }
  
  function handleNameKeypress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      editedName = instance.name;
      isEditingName = false;
    }
  }
</script>

<Collapsible.Root open={isOpen} onOpenChange={onToggle}>
  <div 
    class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mb-3 {isOpen ? 'border-purple-500' : ''}"
    on:mouseenter={() => isHovering = true}
    on:mouseleave={() => isHovering = false}
  >
    <Collapsible.Trigger class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-gray-50 dark:bg-gray-800">
      <div class="flex items-center gap-3 flex-1">
        <div class="text-gray-400 transition-transform {isOpen ? 'rotate-90' : ''}">
          ▶
        </div>
        
        {#if isEditingName}
          <input
            type="text"
            bind:value={editedName}
            on:blur={handleNameSave}
            on:keydown={handleNameKeypress}
            class="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            on:click|stopPropagation
            autofocus
          />
        {:else}
          <button
            on:click|stopPropagation={handleNameEdit}
            class="text-sm font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            {instance.name}
          </button>
        {/if}
        
        {#if isHovering}
          <div class="flex items-center gap-2">
        <button
          on:click|stopPropagation={handleNameEdit}
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs transition-opacity"
              title="Edit connection name"
        >
          ✏️
        </button>
            <button
              on:click|stopPropagation={onDelete}
              class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-xs transition-colors"
              title="Delete connection"
            >
              🗑️
            </button>
          </div>
        {/if}
      </div>
      
      {#if instance.testStatus}
        <div class="flex items-center gap-2 mr-2">
          {#if instance.testStatus === 'success'}
            <span class="text-xs text-green-600 dark:text-green-400">✓ Tested</span>
          {:else if instance.testStatus === 'failed'}
            <span class="text-xs text-red-600 dark:text-red-400">✗ Failed</span>
          {/if}
        </div>
      {/if}
    </Collapsible.Trigger>
    
    <Collapsible.Content>
      <div class="p-4 space-y-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <!-- Prerequisites (Markdown fields) - Always at top in red -->
        {#if markdownFields.length > 0}
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
            <div class="flex items-start gap-2 mb-2">
              <span class="text-red-600 dark:text-red-400 text-lg">⚠️</span>
              <h4 class="font-semibold text-red-900 dark:text-red-300">Prerequisites</h4>
            </div>
            {#each markdownFields as field}
              <FieldRenderer
                {field}
                value={$formData[field.key]}
                error={$validationErrors[field.key]}
                on:change={(e) => handleFieldChange(field.key, e.detail)}
              />
            {/each}
          </div>
        {/if}
        
        <!-- Form Fields -->
        {#each regularFields as field}
          <FieldRenderer
            {field}
            value={$formData[field.key]}
            error={$validationErrors[field.key]}
            on:change={(e) => handleFieldChange(field.key, e.detail)}
          />
        {/each}
      </div>
    </Collapsible.Content>
  </div>
</Collapsible.Root>

