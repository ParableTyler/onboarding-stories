<script lang="ts">
  import ConnectorList from '../components/ConnectorList.svelte';
  import IntegrationFormCard from '../components/IntegrationFormCard.svelte';
  import CompanyAnnouncementPane from '../components/CompanyAnnouncementPane.svelte';
  import { selectedConnector } from '../stores/connectorStore';
  import { organizations } from '../data/organizations';
  import { connectors } from '../data/connectors';
  
  let showList = true;
  
  // Get the first organization for demo purposes (in production, this would be the current user's org)
  const currentOrg = organizations[0];
  const sponsors = currentOrg.users.filter(user => user.parableRole === 'sponsor');
  
  // Find specific roles for blocking users
  const headOfAI = currentOrg.users.find(u => u.jobTitle.toLowerCase().includes('head of ai')) || 
                   currentOrg.users.find(u => u.jobTitle.toLowerCase().includes('cto')) ||
                   sponsors[0] || null;
  const directorOfIT = currentOrg.users.find(u => u.jobTitle.toLowerCase().includes('director of it')) ||
                       currentOrg.users.find(u => u.jobTitle.toLowerCase().includes('director')) ||
                       currentOrg.users.find(u => u.parableRole === 'integrator') || null;
  
  // Check if there are any prioritized connections
  $: hasPrioritizedConnections = connectors.some(c => c.prioritized && !c.connected);
  
  $: if ($selectedConnector) {
    showList = false;
  }
  
  function goBack() {
    $selectedConnector = null;
    showList = true;
  }
</script>

<svelte:head>
  <title>Parable Connectors</title>
</svelte:head>

<div class="container mx-auto max-w-6xl">
    <header class="mb-8">
      <div class="flex items-center gap-3">
        {#if !showList && $selectedConnector}
          <button 
            on:click={goBack}
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Back to connectors"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        {/if}
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
          Parable Connectors
        </h1>
      </div>
    </header>
    
    {#if showList}
      <CompanyAnnouncementPane 
        organizationName={currentOrg.name} 
        organizationDomain={currentOrg.domain}
        sponsors={sponsors} 
        hasPrioritizedConnections={hasPrioritizedConnections}
        headOfAI={headOfAI}
        directorOfIT={directorOfIT}
      />
      <ConnectorList />
    {:else if $selectedConnector}
      <IntegrationFormCard connector={$selectedConnector} />
    {/if}
  </div>

