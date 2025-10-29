<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Checkbox } from 'bits-ui';
  import type { MultiSelectField } from '../../types';
  
  export let field: MultiSelectField;
  export let value: string[] = [];
  export let error: string | undefined = undefined;
  
  const dispatch = createEventDispatcher();
  
  function handleToggle(optionValue: string, checked: boolean) {
    let newValue: string[];
    if (checked) {
      newValue = [...value, optionValue];
    } else {
      newValue = value.filter(v => v !== optionValue);
    }
    dispatch('change', newValue);
  }
</script>

<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
    {field.label}
    {#if field.required}
      <span class="text-red-500 ml-1">*</span>
    {/if}
  </label>
  
  <div class="space-y-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
    {#each field.options as option (option.value)}
      <div class="flex items-start gap-3">
        <Checkbox.Root
          checked={value.includes(option.value)}
          onCheckedChange={(checked) => handleToggle(option.value, checked === true)}
          class="mt-1"
        >
          <div class="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded flex items-center justify-center data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600">
            <Checkbox.Indicator class="text-white text-xs">✓</Checkbox.Indicator>
          </div>
        </Checkbox.Root>
        
        <div class="flex-1">
          <label class="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
            {option.label}
          </label>
          {#if option.description}
            <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              {option.description}
            </p>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  
  {#if field.minSelections || field.maxSelections}
    <p class="text-xs text-gray-500 dark:text-gray-400">
      {#if field.minSelections}
        Minimum: {field.minSelections}
      {/if}
      {#if field.minSelections && field.maxSelections}•{/if}
      {#if field.maxSelections}
        Maximum: {field.maxSelections}
      {/if}
    </p>
  {/if}
  
  {#if error}
    <p class="text-sm text-red-600 dark:text-red-400">
      {error}
    </p>
  {/if}
</div>

