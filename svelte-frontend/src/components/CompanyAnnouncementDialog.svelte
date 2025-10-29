<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let isOpen = false;
  export let organizationName: string = 'Acme Corp';
  
  const dispatch = createEventDispatcher<{
    close: void;
    sent: void;
  }>();
  
  let emailAddresses = '';
  let emailSubject = "We're Taking Back Our Time (and Cutting the Red Tape)";
  let emailBody = `Hi team,

I want to share something we're doing that I think will resonate with frustrations we've all felt.

**The reality:**
How much of your week goes to things that aren't actually your job? Chasing people for updates. Meetings that could have been emails (and emails that should have been nothing). Navigating political minefields to get simple things done. Waiting on approvals that sit in someone's inbox for days.

The bureaucracy creeps in. It's not anyone's fault—it's what happens when companies grow and systems don't keep up.

**Here's what we're doing about it:**
We're implementing Parable—not to watch people, but to see where the bureaucracy has taken root. It connects our tools (Salesforce, Slack, Google Workspace, etc.) to show us where time disappears:

• Which processes have become bureaucratic mazes
• Where decisions get stuck in political dynamics  
• What coordination overhead we can actually eliminate
• Where the gap is between "doing work" and "coordinating to do work"

**This is not about:**
❌ Monitoring individuals  
❌ Eliminating positions  
❌ Making people replaceable  
❌ Justifying headcount reductions  

**This is about:**
✅ Giving everyone their time back  
✅ Removing the friction that makes good work harder  
✅ Making the bureaucracy visible so we can actually fix it  
✅ Letting you focus on work that uses your actual skills  

**What changes for you:**
Nothing. Keep using your tools exactly as you do now. Parable works in the background.

Our DevOps and IT teams will reach out to configure a few integrations over the next few weeks. Each takes about 10-15 minutes. Please support them when they do—it's a small lift that helps everyone.

**The promise:**
We're not using this to justify cutting people. We're using it to cut the bureaucratic overhead that's been burying us all.

More time for real work. Less time navigating internal politics. Better clarity on what's actually slowing us down.

Thanks for your support.

[Your Name]`;

  let copied = false;
  
  function copyToClipboard() {
    const fullEmail = `Subject: ${emailSubject}\n\n${emailBody}`;
    navigator.clipboard.writeText(fullEmail)
      .then(() => {
        copied = true;
        setTimeout(() => copied = false, 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Please try again.');
      });
  }
  
  function sendEmail() {
    const emails = emailAddresses.split(',').map(e => e.trim()).join(',');
    const mailtoLink = `mailto:${emails}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    
    // Notify parent that email was sent
    dispatch('sent');
    close();
  }
  
  function close() {
    dispatch('close');
  }
  
  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Escape' && close()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <!-- Dialog -->
    <div 
      class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="document"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Company Announcement
          </h2>
          <button
            on:click={close}
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close dialog"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Inform your team that this initiative is happening.
        </p>
      </div>
      
      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <!-- Why This Matters -->
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <div class="text-2xl">💡</div>
            <div class="flex-1 text-sm text-amber-900 dark:text-amber-200">
              <div class="font-semibold mb-2">Why this matters</div>
              <p>This announcement prevents confusion and builds trust. When technical teams know leadership has already approved it, they're more likely to help. Send this <strong>before</strong> requesting integration work.</p>
            </div>
          </div>
        </div>
        
        <!-- Email Form -->
        <div class="space-y-4">
          <!-- To Field -->
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To (Email Addresses)
            </label>
            <input
              type="text"
              bind:value={emailAddresses}
              placeholder="announcements@{organizationName.toLowerCase().replace(/\s+/g, '')}.com, devops@{organizationName.toLowerCase().replace(/\s+/g, '')}.com"
              class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Separate multiple emails with commas
            </p>
          </div>
          
          <!-- Subject Field -->
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Subject
            </label>
            <input
              type="text"
              bind:value={emailSubject}
              class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <!-- Body Field -->
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Body
            </label>
            <textarea
              bind:value={emailBody}
              rows="16"
              class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
        <button
          on:click={copyToClipboard}
          class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {#if copied}
            <span>✓</span>
            <span>Copied!</span>
          {:else}
            <span>📋</span>
            <span>Copy</span>
          {/if}
        </button>
        <button
          on:click={sendEmail}
          class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <span>🚀</span>
          <span>Send Announcement</span>
        </button>
      </div>
    </div>
  </div>
{/if}

