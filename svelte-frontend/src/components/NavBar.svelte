<script lang="ts">
  import { location } from 'svelte-spa-router';
  
  $: currentPath = $location;
  
  // Mock user data - replace with actual user data later
  const user = {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@nike.com',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Mitchell&background=3b82f6&color=fff'
  };
  
  // Split name into first and last
  $: nameParts = user.name.split(' ');
  $: firstName = nameParts[0] || '';
  $: lastName = nameParts.slice(1).join(' ') || '';
</script>

<!-- Sidebar -->
<aside class="fixed left-0 top-0 h-screen w-48 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
  <!-- Logo/Brand -->
  <div class="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700">
    <h1 class="text-xl font-bold text-gray-900 dark:text-white">Parable</h1>
  </div>
  
  <!-- Navigation -->
  <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto min-h-0">
      <a 
        href="#/"
      class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all {currentPath === '/' || currentPath === '/connectors' 
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}"
      >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
        Connectors
      </a>
    
    <a 
      href="#/admin"
      class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all {currentPath === '/admin' 
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      PEP
    </a>
  </nav>
  
  <!-- User Profile Section (Footer) -->
  <div class="flex-shrink-0 px-4 pb-4">
    <div class="flex items-center gap-3">
      <img 
        src={user.avatar} 
        alt={user.name}
        class="w-10 h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
      />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{firstName}</p>
        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{lastName}</p>
      </div>
    </div>
  </div>
</aside>

