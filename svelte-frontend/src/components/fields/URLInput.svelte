<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { URLField } from '../../types';
  
  export let field: URLField;
  export let value: string = '';
  export let error: string | undefined = undefined;
  
  const dispatch = createEventDispatcher();
  
  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    dispatch('change', target.value);
  }
</script>

<div class="space-y-2">
  <label for={field.id} class="block text-sm font-medium text-gray-700 dark:text-gray-300">
    {field.label}
    {#if field.required}
      <span class="text-red-500 ml-1">*</span>
    {/if}
  </label>
  
  <input
    id={field.id}
    type="url"
    {value}
    placeholder={field.placeholder || 'https://example.com'}
    on:input={handleInput}
    required={field.required}
    class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors {error ? 'border-red-500 dark:border-red-500' : ''}"
  />
  
  {#if error}
    <p class="text-sm text-red-600 dark:text-red-400">
      {error}
    </p>
  {/if}
</div>

