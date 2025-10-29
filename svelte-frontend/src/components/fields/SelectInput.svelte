<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Select } from 'bits-ui';
  import type { SelectField } from '../../types';
  
  export let field: SelectField;
  export let value: string = '';
  export let error: string | undefined = undefined;
  
  const dispatch = createEventDispatcher();
  
  $: selected = field.options.find(opt => opt.value === value);
  
  function handleChange(selectedItem: { value: string } | undefined) {
    if (selectedItem) {
      dispatch('change', selectedItem.value);
    }
  }
</script>

<div class="space-y-2">
  <label for={field.id} class="block text-sm font-medium text-gray-700 dark:text-gray-300">
    {field.label}
    {#if field.required}
      <span class="text-red-500 ml-1">*</span>
    {/if}
  </label>
  
  <Select.Root items={field.options} selected={selected} onSelectedChange={handleChange}>
    <Select.Trigger 
      class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-left flex items-center justify-between {error ? 'border-red-500 dark:border-red-500' : ''}"
    >
      <Select.Value placeholder="Select..." class="text-sm" />
      <span class="ml-2">▼</span>
    </Select.Trigger>
    
    <Select.Content 
      class="mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto z-50"
    >
      {#each field.options as option (option.value)}
        <Select.Item 
          value={option.value}
          label={option.label}
          class="px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
        >
          <div>
            <div class="font-medium">{option.label}</div>
            {#if option.description}
              <div class="text-xs text-gray-600 dark:text-gray-400">{option.description}</div>
            {/if}
          </div>
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
  
  {#if error}
    <p class="text-sm text-red-600 dark:text-red-400">
      {error}
    </p>
  {/if}
</div>

