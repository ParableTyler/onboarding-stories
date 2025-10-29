<script lang="ts">
  import { Tabs } from 'bits-ui';
  import { organizations } from '../data/organizations';
  import { connectors } from '../data/connectors';
  import type { Organization, OrganizationUser, OrganizationPlugin } from '../data/organizations';
  import { getTimeAgo, formatDateTime } from '../utils/timeUtils';
  import { formatNextNudge } from '../utils/dateUtils';
  
  let searchQuery = '';
  let expandedOrg: string | null = null;
  let activeTab: Record<string, string> = {};
  let userSearchQuery: Record<string, string> = {};
  let pluginSearchQuery: Record<string, string> = {};
  let localOrganizations = [...organizations];
  let showDueDateModal = false;
  let selectedDueDatePlugin: { orgId: string; pluginId: string; pluginName: string } | null = null;
  let dueDateValue = '';
  let applyToAllPlugins = true;
  let showAddOrgModal = false;
  let newOrgName = '';
  let newOrgWebsite = '';
  let newOrgSlug = '';
  let showDeleteConfirm: string | null = null;
  let deleteConfirmText = '';
  let logoPreviewUrl = '';
  let showAddUserModal = false;
  let newUserFirstName = '';
  let newUserLastName = '';
  let newUserEmail = '';
  let newUserJobTitle = '';
  let newUserParableRole: 'sponsor' | 'integrator' | 'project-manager' = 'integrator';
  let showEditUserModal = false;
  let editingUser: { orgId: string; user: OrganizationUser } | null = null;
  
  // Cache for random connector icons per organization
  let orgConnectorIcons: Record<string, { prioritized: string[], active: string[] }> = {};
  
  // Function to get random connector icons for display
  function getRandomConnectorIcons(orgId: string, count: number, type: 'prioritized' | 'active'): string[] {
    // Initialize cache for this org if it doesn't exist
    if (!orgConnectorIcons[orgId]) {
      orgConnectorIcons[orgId] = { prioritized: [], active: [] };
    }
    
    // Return cached icons if they exist
    if (orgConnectorIcons[orgId][type].length > 0) {
      return orgConnectorIcons[orgId][type];
    }
    
    // Generate new random selection
    const shuffled = [...connectors].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, 5)).map(c => c.icon); // Max 5 icons
    
    // Cache the selection
    orgConnectorIcons[orgId][type] = selected;
    return selected;
  }
  
  $: filteredOrgs = localOrganizations.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  function toggleOrg(orgId: string) {
    if (expandedOrg === orgId) {
      expandedOrg = null;
    } else {
      expandedOrg = orgId;
      if (!activeTab[orgId]) {
        activeTab[orgId] = 'users';
      }
    }
  }
  
  function updateUserRole(orgId: string, userEmail: string, newRole: string) {
    localOrganizations = localOrganizations.map(org => {
      if (org.id === orgId) {
        return {
          ...org,
          users: org.users.map(user => 
            user.email === userEmail 
              ? { ...user, parableRole: newRole as OrganizationUser['parableRole'] }
              : user
          )
        };
      }
      return org;
    });
    console.log(`Autosaved role for ${userEmail} to ${newRole}`);
  }
  
  function getRoleBadgeColor(role: OrganizationUser['parableRole']): string {
    switch (role) {
      case 'sponsor':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
      case 'integrator':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'project-manager':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
    }
  }
  
  function togglePrioritize(orgId: string, pluginId: string) {
    localOrganizations = localOrganizations.map(org => {
      if (org.id === orgId) {
        const updatedPlugins = org.plugins.map(plugin => 
          plugin.id === pluginId 
            ? { ...plugin, prioritized: !plugin.prioritized }
            : plugin
        );
        const prioritizedCount = updatedPlugins.filter(p => p.prioritized).length;
        return {
          ...org,
          plugins: updatedPlugins,
          prioritizedIntegrations: prioritizedCount,
        };
      }
      return org;
    });
    console.log(`Toggled prioritize for plugin ${pluginId} in org ${orgId}`);
  }
  
  function sendNudge(orgName: string, pluginName: string) {
    console.log(`Sending nudge email for ${pluginName} to ${orgName}`);
    alert(`Nudge email sent to ${orgName} for ${pluginName} integration!`);
  }
  
  function openDueDateModal(orgId: string, pluginId: string, pluginName: string) {
    selectedDueDatePlugin = { orgId, pluginId, pluginName };
    showDueDateModal = true;
    dueDateValue = '';
    applyToAllPlugins = true;
  }
  
  function applyDueDate() {
    if (!selectedDueDatePlugin || !dueDateValue) return;
    
    if (applyToAllPlugins) {
      // Apply to all prioritized plugins across all orgs
      localOrganizations = localOrganizations.map(org => ({
        ...org,
        plugins: org.plugins.map(plugin => 
          plugin.prioritized 
            ? { ...plugin, nextNudgeDate: dueDateValue }
            : plugin
        )
      }));
      console.log(`Applied due date ${dueDateValue} to all prioritized plugins`);
    } else {
      // Apply to single plugin
      localOrganizations = localOrganizations.map(org => {
        if (org.id === selectedDueDatePlugin!.orgId) {
          return {
            ...org,
            plugins: org.plugins.map(plugin => 
              plugin.id === selectedDueDatePlugin!.pluginId
                ? { ...plugin, nextNudgeDate: dueDateValue }
                : plugin
            )
          };
        }
        return org;
      });
      console.log(`Applied due date ${dueDateValue} to ${selectedDueDatePlugin.pluginName}`);
    }
    
    showDueDateModal = false;
    selectedDueDatePlugin = null;
  }
  
  function startOnboarding(orgName: string) {
    console.log(`Starting onboarding for ${orgName}`);
    alert(`Onboarding started for ${orgName}!`);
  }
  
  function addOrganization() {
    if (!newOrgName || !newOrgWebsite || !newOrgSlug) return;
    
    const newOrg: Organization = {
      id: String(localOrganizations.length + 1),
      name: newOrgName,
      domain: newOrgWebsite,
      users: [],
      plugins: [],
      prioritizedIntegrations: 0,
      connectedIntegrations: 0,
    };
    
    localOrganizations = [...localOrganizations, newOrg];
    console.log(`Added organization: ${newOrgName}`);
    
    showAddOrgModal = false;
    newOrgName = '';
    newOrgWebsite = '';
    newOrgSlug = '';
  }
  
  function confirmDeleteOrg(orgId: string) {
    showDeleteConfirm = orgId;
    deleteConfirmText = '';
  }
  
  function deleteOrganization(orgId: string, orgName: string) {
    if (deleteConfirmText !== `DELETE ${orgName.toUpperCase()}`) {
      alert('Please type the confirmation text exactly as shown');
      return;
    }
    
    localOrganizations = localOrganizations.filter(org => org.id !== orgId);
    console.log(`Deleted organization: ${orgName}`);
    showDeleteConfirm = null;
    deleteConfirmText = '';
  }
  
  $: if (newOrgName) {
    newOrgSlug = newOrgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  
  // Update logo preview when website has a domain
  $: if (newOrgWebsite && newOrgWebsite.includes('.')) {
    logoPreviewUrl = `https://img.logo.dev/${newOrgWebsite}?token=pk_N2gy3fJKQ0aldg9QTg7cHA`;
  } else {
    logoPreviewUrl = '';
  }
  
  function addUser() {
    if (!newUserFirstName || !newUserLastName || !newUserEmail || !newUserJobTitle || !expandedOrg) return;
    
    const fullName = `${newUserFirstName} ${newUserLastName}`;
    
    localOrganizations = localOrganizations.map(org => {
      if (org.id === expandedOrg) {
        return {
          ...org,
          users: [...org.users, {
            name: fullName,
            email: newUserEmail,
            jobTitle: newUserJobTitle,
            parableRole: newUserParableRole,
            lastSeen: new Date().toISOString(),
          }]
        };
      }
      return org;
    });
    
    console.log(`Added user: ${fullName}`);
    showAddUserModal = false;
    newUserFirstName = '';
    newUserLastName = '';
    newUserEmail = '';
    newUserJobTitle = '';
    newUserParableRole = 'integrator';
  }
  
  function openEditUser(orgId: string, user: OrganizationUser) {
    editingUser = { orgId, user };
    showEditUserModal = true;
  }
  
  function saveEditUser() {
    if (!editingUser) return;
    
    localOrganizations = localOrganizations.map(org => {
      if (org.id === editingUser!.orgId) {
        return {
          ...org,
          users: org.users.map(u => 
            u.email === editingUser!.user.email ? editingUser!.user : u
          )
        };
      }
      return org;
    });
    
    console.log(`Updated user: ${editingUser.user.name}`);
    showEditUserModal = false;
    editingUser = null;
  }
  
  function getFilteredUsers(org: Organization): OrganizationUser[] {
    const query = userSearchQuery[org.id] || '';
    if (!query) return org.users;
    return org.users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.jobTitle.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  function getFilteredPlugins(org: Organization): OrganizationPlugin[] {
    const query = pluginSearchQuery[org.id] || '';
    let filtered = org.plugins;
    
    if (query) {
      filtered = filtered.filter(plugin => 
        plugin.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Sort: prioritized first, then connected, then other
    return filtered.sort((a, b) => {
      if (a.prioritized && !b.prioritized) return -1;
      if (!a.prioritized && b.prioritized) return 1;
      if (a.status === 'connected' && b.status === 'not-connected') return -1;
      if (a.status === 'not-connected' && b.status === 'connected') return 1;
      return 0;
    });
  }
</script>

<div class="space-y-4">
  <!-- Search Bar with Add Organization Button -->
  <div class="flex gap-3">
    <div class="relative flex-1">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search organizations..."
        class="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <button
      on:click={() => showAddOrgModal = true}
      class="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Organization
    </button>
  </div>
  
  <!-- Table -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
    <table class="w-full">
      <thead class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Organization Name
          </th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Organization Users
          </th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Prioritized Connectors
          </th>
          <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Active Connectors
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        {#each filteredOrgs as org}
          <tr 
            class="group hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            on:click={() => toggleOrg(org.id)}
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <img 
                  src="https://img.logo.dev/{org.domain}?token=pk_N2gy3fJKQ0aldg9QTg7cHA" 
                  alt="{org.name} logo" 
                  class="w-10 h-10 rounded-lg object-contain bg-white p-1 border border-gray-200"
                  on:error={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=random&size=128`;
                  }}
                />
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{org.name}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{org.domain}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-900 dark:text-white">
              {org.users.length}
            </td>
            <td class="px-6 py-4">
              {#if org.prioritizedIntegrations > 0}
                <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                  {org.prioritizedIntegrations}
                </span>
                  <div class="flex items-center gap-1">
                    {#each getRandomConnectorIcons(org.id, org.prioritizedIntegrations, 'prioritized') as iconUrl}
                      <img 
                        src={iconUrl}
                        alt="Connector icon"
                        class="w-5 h-5 rounded object-contain"
                        on:error={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    {/each}
                  </div>
                </div>
              {/if}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div>
                  {#if org.connectedIntegrations > 0}
                    <div class="flex items-center gap-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      {org.connectedIntegrations}
                    </span>
                      <div class="flex items-center gap-1">
                        {#each getRandomConnectorIcons(org.id, org.connectedIntegrations, 'active') as iconUrl}
                          <img 
                            src={iconUrl}
                            alt="Connector icon"
                            class="w-5 h-5 rounded object-contain"
                            on:error={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    on:click|stopPropagation={() => startOnboarding(org.name)}
                    class="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                  >
                    Start Onboarding
                  </button>
                  <button
                    on:click|stopPropagation={() => confirmDeleteOrg(org.id)}
                    class="px-3 py-1 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
          {#if expandedOrg === org.id}
            <tr>
              <td colspan="4" class="px-6 py-4 bg-gray-50 dark:bg-gray-900">
                <Tabs.Root bind:value={activeTab[org.id]} class="w-full">
                  <Tabs.List class="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                    <Tabs.Trigger 
                      value="users"
                      class="px-4 py-2 text-sm font-medium transition-colors relative data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-600 dark:data-[state=active]:after:bg-blue-400"
                    >
                      Users
                    </Tabs.Trigger>
                    <Tabs.Trigger 
                      value="plugins"
                      class="px-4 py-2 text-sm font-medium transition-colors relative data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-blue-600 dark:data-[state=active]:after:bg-blue-400"
                    >
                      Connectors
                    </Tabs.Trigger>
                  </Tabs.List>
                  
                  <!-- Users Tab -->
                  <Tabs.Content value="users">
                    <div class="space-y-3">
                      <!-- User Search with Add Button -->
                      <div class="flex gap-3">
                        <div class="relative flex-1">
                        <input
                          type="text"
                          bind:value={userSearchQuery[org.id]}
                          placeholder="Search users..."
                          class="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        </div>
                        <button
                          on:click|stopPropagation={() => showAddUserModal = true}
                          class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Add User
                        </button>
                      </div>
                      
                      <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table class="w-full">
                          <thead class="bg-gray-100 dark:bg-gray-800">
                            <tr>
                              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Name
                              </th>
                              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Email
                              </th>
                              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Job Title
                              </th>
                              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Parable Role
                              </th>
                              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Last Seen
                              </th>
                              <th class="px-4 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {#each getFilteredUsers(org) as user}
                              <tr class="group">
                                <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{user.name}</td>
                                <td class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                                <td class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{user.jobTitle}</td>
                                <td class="px-4 py-2 text-sm">
                                  <select
                                    value={user.parableRole}
                                    on:change={(e) => {
                                      const target = e.currentTarget;
                                      updateUserRole(org.id, user.email, target.value);
                                    }}
                                    on:click|stopPropagation
                                    class="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="sponsor">Sponsor</option>
                                    <option value="integrator">Integrator</option>
                                    <option value="project-manager">Project Manager</option>
                                  </select>
                                </td>
                                <td class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400" title={formatDateTime(user.lastSeen)}>
                                  {getTimeAgo(user.lastSeen)}
                                </td>
                                <td class="px-4 py-2 text-right">
                                  <button
                                    on:click|stopPropagation={() => openEditUser(org.id, user)}
                                    class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-all opacity-0 group-hover:opacity-100"
                                  >
                                    Edit
                                  </button>
                                </td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Tabs.Content>
                  
                  <!-- Plugins Tab -->
                  <Tabs.Content value="plugins">
                    <div class="space-y-3">
                      <!-- Plugin Search -->
                      <div class="relative">
                        <input
                          type="text"
                          bind:value={pluginSearchQuery[org.id]}
                          placeholder="Search plugins..."
                          class="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      
                      <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table class="w-full">
                          <thead class="bg-gray-100 dark:bg-gray-800">
                            <tr>
                              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Plugin
                              </th>
                              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Next Nudge
                              </th>
                              <th class="px-4 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {#each getFilteredPlugins(org) as plugin}
                              {@const hoverId = `${org.id}-${plugin.id}`}
                              <tr class="group">
                                <td class="px-4 py-2">
                                  <div class="flex items-center gap-2">
                                    <img 
                                      src={plugin.icon}
                                      alt="{plugin.name} logo" 
                                      class="w-6 h-6 rounded object-contain"
                                      on:error={(e) => {
                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(plugin.name)}&background=random&size=64`;
                                      }}
                                    />
                                    <span class="text-sm font-medium text-gray-900 dark:text-white">{plugin.name}</span>
                                  </div>
                                </td>
                                <td class="px-4 py-2">
                                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {plugin.status === 'connected' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}">
                                    {plugin.status === 'connected' ? 'Connected' : 'Not Connected'}
                                  </span>
                                </td>
                                <td class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                  {#if plugin.nextNudgeDate}
                                    {formatNextNudge(plugin.nextNudgeDate)}
                                  {:else}
                                    —
                                  {/if}
                                </td>
                                <td class="px-4 py-2 text-right">
                                  <div class="flex items-center justify-end gap-2">
                                    <button
                                      on:click|stopPropagation={() => togglePrioritize(org.id, plugin.id)}
                                      class="px-2 py-1 text-xs font-medium rounded transition-all {plugin.prioritized ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100'}"
                                    >
                                      {plugin.prioritized ? '★ Prioritized' : 'Prioritize'}
                                    </button>
                                    <button
                                      on:click|stopPropagation={() => openDueDateModal(org.id, plugin.id, plugin.name)}
                                      class="px-2 py-1 text-xs font-medium rounded bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in"
                                    >
                                      📅 Set Due Date
                                    </button>
                                    {#if plugin.prioritized}
                                      <button
                                        on:click|stopPropagation={() => sendNudge(org.name, plugin.name)}
                                        class="px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in"
                                      >
                                        📧 Nudge
                                      </button>
                                    {/if}
                                  </div>
                                </td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Tabs.Content>
                </Tabs.Root>
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- Add Organization Modal -->
{#if showAddOrgModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" on:click={() => showAddOrgModal = false}>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4" on:click|stopPropagation>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Organization</h3>
      
      <!-- Logo Preview -->
      {#if logoPreviewUrl}
        <div class="flex justify-center mb-6">
          <img 
            src={logoPreviewUrl} 
            alt="Organization logo preview" 
            class="w-24 h-24 rounded-lg object-contain bg-white p-2 border-2 border-gray-200 dark:border-gray-600"
            on:error={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(newOrgName || 'Org')}&background=random&size=128`;
            }}
          />
        </div>
      {/if}
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Organization Name
          </label>
          <input
            type="text"
            bind:value={newOrgName}
            placeholder="e.g., Acme Corporation"
            class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Organization Website
          </label>
          <input
            type="text"
            bind:value={newOrgWebsite}
            placeholder="acme.com"
            class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Organization Slug
          </label>
          <div class="flex items-center gap-2">
            <input
              type="text"
              bind:value={newOrgSlug}
              placeholder="acme"
              class="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-500 dark:text-gray-400">.parable.work</span>
          </div>
        </div>
      </div>
      
      <div class="flex gap-3 mt-6">
        <button
          on:click={() => showAddOrgModal = false}
          class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          on:click={addOrganization}
          disabled={!newOrgName || !newOrgWebsite || !newOrgSlug}
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add Organization
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Delete Organization Confirmation Modal -->
{#if showDeleteConfirm}
  {@const orgToDelete = localOrganizations.find(o => o.id === showDeleteConfirm)}
  {#if orgToDelete}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" on:click={() => { showDeleteConfirm = null; deleteConfirmText = ''; }}>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4" on:click|stopPropagation>
        <h3 class="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Delete Organization</h3>
        
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Are you sure you want to delete <strong>{orgToDelete.name}</strong>? This action cannot be undone.
        </p>
        
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Type <strong class="text-gray-900 dark:text-white">DELETE {orgToDelete.name.toUpperCase()}</strong> to confirm:
        </p>
        
        <input
          type="text"
          bind:value={deleteConfirmText}
          placeholder="DELETE {orgToDelete.name.toUpperCase()}"
          class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
        />
        
        <div class="flex gap-3">
          <button
            on:click={() => { showDeleteConfirm = null; deleteConfirmText = ''; }}
            class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            on:click={() => deleteOrganization(orgToDelete.id, orgToDelete.name)}
            disabled={deleteConfirmText !== `DELETE ${orgToDelete.name.toUpperCase()}`}
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Delete Organization
          </button>
        </div>
      </div>
    </div>
  {/if}
{/if}

<!-- Set Due Date Modal -->
{#if showDueDateModal && selectedDueDatePlugin}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" on:click={() => { showDueDateModal = false; selectedDueDatePlugin = null; }}>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4" on:click|stopPropagation>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Set Due Date</h3>
      
      <p class="text-gray-700 dark:text-gray-300 mb-4">
        Setting due date for <strong>{selectedDueDatePlugin.pluginName}</strong>
      </p>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            bind:value={dueDateValue}
            class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="applyToAll"
            bind:checked={applyToAllPlugins}
            class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label for="applyToAll" class="text-sm text-gray-700 dark:text-gray-300">
            Apply to all prioritized plugins
          </label>
        </div>
      </div>
      
      <div class="flex gap-3 mt-6">
        <button
          on:click={() => { showDueDateModal = false; selectedDueDatePlugin = null; }}
          class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          on:click={applyDueDate}
          disabled={!dueDateValue}
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Add User Modal -->
{#if showAddUserModal}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" on:click={() => showAddUserModal = false}>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4" on:click|stopPropagation>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Add User</h3>
      
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
          </label>
          <input
            type="text"
              bind:value={newUserFirstName}
              placeholder="John"
            class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              bind:value={newUserLastName}
              placeholder="Doe"
              class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            bind:value={newUserEmail}
            placeholder="john@company.com"
            class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Job Title
          </label>
          <input
            type="text"
            bind:value={newUserJobTitle}
            placeholder="Software Engineer"
            class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Parable Role
          </label>
          <select
            bind:value={newUserParableRole}
            class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sponsor">Sponsor</option>
            <option value="integrator">Integrator</option>
            <option value="project-manager">Project Manager</option>
          </select>
        </div>
      </div>
      
      <div class="flex gap-3 mt-6">
        <button
          on:click={() => showAddUserModal = false}
          class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          on:click={addUser}
          disabled={!newUserFirstName || !newUserLastName || !newUserEmail || !newUserJobTitle}
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add User
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Edit User Modal -->
{#if showEditUserModal && editingUser}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" on:click={() => { showEditUserModal = false; editingUser = null; }}>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4" on:click|stopPropagation>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit User</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            bind:value={editingUser.user.name}
            class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            bind:value={editingUser.user.email}
            disabled
            class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Email cannot be changed
          </p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Job Title
          </label>
          <input
            type="text"
            bind:value={editingUser.user.jobTitle}
            class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Parable Role
          </label>
          <select
            bind:value={editingUser.user.parableRole}
            class="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sponsor">Sponsor</option>
            <option value="integrator">Integrator</option>
            <option value="project-manager">Project Manager</option>
          </select>
        </div>
      </div>
      
      <div class="flex gap-3 mt-6">
        <button
          on:click={() => { showEditUserModal = false; editingUser = null; }}
          class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          on:click={saveEditUser}
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
{/if}
