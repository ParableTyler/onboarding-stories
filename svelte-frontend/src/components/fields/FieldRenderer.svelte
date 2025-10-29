<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { FormField } from '../../types';
  import StringInput from './StringInput.svelte';
  import SecretInput from './SecretInput.svelte';
  import EmailInput from './EmailInput.svelte';
  import URLInput from './URLInput.svelte';
  import SelectInput from './SelectInput.svelte';
  import MultiSelectInput from './MultiSelectInput.svelte';
  import BooleanInput from './BooleanInput.svelte';
  import MarkdownDisplay from './MarkdownDisplay.svelte';
  
  export let field: FormField;
  export let value: any;
  export let error: string | undefined = undefined;
  
  const dispatch = createEventDispatcher();
  
  function handleChange(newValue: any) {
    dispatch('change', newValue);
  }
</script>

{#if field.__typename === 'StringField' || field.__typename === 'HostnameField'}
  <StringInput {field} {value} {error} on:change={(e) => handleChange(e.detail)} />
  
{:else if field.__typename === 'SecretField'}
  <SecretInput {field} {value} {error} on:change={(e) => handleChange(e.detail)} />
  
{:else if field.__typename === 'EmailField'}
  <EmailInput {field} {value} {error} on:change={(e) => handleChange(e.detail)} />
  
{:else if field.__typename === 'URLField'}
  <URLInput {field} {value} {error} on:change={(e) => handleChange(e.detail)} />
  
{:else if field.__typename === 'SelectField'}
  <SelectInput {field} {value} {error} on:change={(e) => handleChange(e.detail)} />
  
{:else if field.__typename === 'MultiSelectField'}
  <MultiSelectInput {field} {value} {error} on:change={(e) => handleChange(e.detail)} />
  
{:else if field.__typename === 'BooleanField'}
  <BooleanInput {field} {value} {error} on:change={(e) => handleChange(e.detail)} />
  
{:else if field.__typename === 'MarkdownField'}
  <MarkdownDisplay {field} />
  
{:else}
  <div class="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-300">
    Unsupported field type: {field.__typename}
  </div>
{/if}

