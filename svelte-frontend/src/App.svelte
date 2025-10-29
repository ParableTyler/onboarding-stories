<script lang="ts">
  import Router from 'svelte-spa-router';
  import NavBar from './components/NavBar.svelte';
  import ConnectorsPage from './pages/ConnectorsPage.svelte';
  import AdminPage from './pages/AdminPage.svelte';
  
  const routes = {
    '/': ConnectorsPage,
    '/connectors': ConnectorsPage,
    '/admin': AdminPage,
  };
</script>

<div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Sidebar -->
  <NavBar />
  
  <!-- Main Content -->
  <main class="flex-1 ml-48 p-8">
<Router {routes} />
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>

