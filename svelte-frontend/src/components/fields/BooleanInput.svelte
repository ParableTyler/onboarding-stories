<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Switch } from 'bits-ui';
  import type { BooleanField } from '../../types';
  
  export let field: BooleanField;
  export let value: boolean = false;
  export let error: string | undefined = undefined;
  
  const dispatch = createEventDispatcher();
  
  function handleChange(checked: boolean) {
    dispatch('change', checked);
  }
</script>

<div class="space-y-2">
  <div class="flex items-center justify-between">
    <div class="flex-1">
      <label for={field.id} class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.label}
        {#if field.required}
          <span class="text-red-500 ml-1">*</span>
        {/if}
      </label>
    </div>
    
    <Switch.Root 
      checked={value}
      onCheckedChange={handleChange}
      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
    >
      <Switch.Thumb 
        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1"
      />
    </Switch.Root>
  </div>
  
  {#if error}
    <p class="text-sm text-red-600 dark:text-red-400">
      {error}
    </p>
  {/if}
</div>

