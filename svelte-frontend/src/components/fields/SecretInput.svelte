<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SecretField } from '../../types';
  
  export let field: SecretField;
  export let value: string = '';
  export let error: string | undefined = undefined;
  
  const dispatch = createEventDispatcher();
  
  let showPassword = false;
  
  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    dispatch('change', target.value);
  }
  
  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
</script>

<div class="space-y-2">
  <label for={field.id} class="block text-sm font-medium text-gray-700 dark:text-gray-300">
    {field.label}
    {#if field.required}
      <span class="text-red-500 ml-1">*</span>
    {/if}
  </label>
  
  <div class="relative">
    <input
      id={field.id}
      type={showPassword ? 'text' : 'password'}
      {value}
      placeholder="••••••••"
      on:input={handleInput}
      required={field.required}
      class="w-full px-3 py-2 pr-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors {error ? 'border-red-500 dark:border-red-500' : ''}"
    />
    
    {#if field.revealable}
      <button
        type="button"
        on:click={togglePasswordVisibility}
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        {showPassword ? '🙈' : '👁️'}
      </button>
    {/if}
  </div>
  
  {#if error}
    <p class="text-sm text-red-600 dark:text-red-400">
      {error}
    </p>
  {/if}
</div>

