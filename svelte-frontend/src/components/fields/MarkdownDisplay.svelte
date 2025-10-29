<script lang="ts">
  import { marked } from 'marked';
  import type { MarkdownField } from '../../types';
  
  export let field: MarkdownField;
  
  $: html = marked(field.content);
</script>

<div class="prose dark:prose-invert max-w-none">
  {@html html}
</div>

<style>
  :global(.prose h2) {
    @apply text-base font-semibold mb-2 mt-0 text-red-900 dark:text-red-200;
  }
  
  :global(.prose p) {
    @apply text-sm mb-2 text-red-800 dark:text-red-300;
  }
  
  :global(.prose ul) {
    @apply text-sm mb-2 pl-5 list-disc text-red-800 dark:text-red-300;
  }
  
  :global(.prose ol) {
    @apply text-sm mb-2 pl-5 list-decimal text-red-800 dark:text-red-300;
  }
  
  :global(.prose a) {
    @apply text-red-700 dark:text-red-400 hover:underline font-medium;
  }
</style>

