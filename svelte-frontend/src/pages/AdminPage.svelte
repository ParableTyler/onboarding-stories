<script lang="ts">
  import { Tabs } from 'bits-ui';
  import TenantsTable from '../components/TenantsTable.svelte';
  import OnboardingsTable from '../components/OnboardingsTable.svelte';
  
  let activeTab = 'tenants';
</script>

<svelte:head>
  <title>Parable Employee Portal</title>
</svelte:head>

<div class="container mx-auto max-w-7xl">
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
        Parable Employee Portal
      </h1>
    </header>
    
    <Tabs.Root bind:value={activeTab} class="w-full">
      <Tabs.List class="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <Tabs.Trigger 
          value="tenants"
          class="px-6 py-3 text-sm font-medium transition-colors relative data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-600 dark:data-[state=active]:after:bg-blue-400"
        >
          Tenants
        </Tabs.Trigger>
        <Tabs.Trigger 
          value="onboardings"
          class="px-6 py-3 text-sm font-medium transition-colors relative data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-600 dark:data-[state=active]:after:bg-blue-400"
        >
          Onboardings
        </Tabs.Trigger>
      </Tabs.List>
      
      <Tabs.Content value="tenants">
        <TenantsTable />
      </Tabs.Content>
      
      <Tabs.Content value="onboardings">
        <OnboardingsTable />
      </Tabs.Content>
    </Tabs.Root>
  </div>

