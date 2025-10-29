<script lang="ts">
  import type { Connector } from '../types';
  
  export let connector: Connector;
  
  interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }
  
  let messages: Message[] = [
    {
      role: 'assistant',
      content: `Hi! I'm Parable Ponder, your AI assistant for setting up ${connector.name}. I can help you with:\n\n• Getting your API credentials\n• Understanding configuration options\n• Troubleshooting connection issues\n• Best practices for ${connector.name} integration\n\nWhat would you like help with?`,
      timestamp: new Date(),
    }
  ];
  
  let userInput = '';
  let isTyping = false;
  
  async function handleSend() {
    if (!userInput.trim()) return;
    
    // Add user message
    messages = [...messages, {
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    }];
    
    const currentInput = userInput;
    userInput = '';
    isTyping = true;
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock responses based on keywords
    let response = '';
    const input = currentInput.toLowerCase();
    
    if (input.includes('credential') || input.includes('api key') || input.includes('client id')) {
      response = `To get your ${connector.name} credentials:\n\n1. Log in to your ${connector.name} admin account\n2. Navigate to Settings → Integrations or Apps\n3. Create a new Connected App or API Key\n4. Copy the credentials provided\n\nWould you like me to walk you through any specific step?`;
    } else if (input.includes('test') || input.includes('connection')) {
      response = `The connection test verifies your credentials by making a secure API call to ${connector.name}. If it fails, common issues are:\n\n• Incorrect credentials (double-check for typos)\n• Missing permissions/scopes\n• IP restrictions on your ${connector.name} account\n• Expired tokens\n\nWhat error message are you seeing?`;
    } else if (input.includes('permission') || input.includes('scope')) {
      response = `For ${connector.name}, you'll typically need:\n\n• Read access to basic account info\n• API access permissions\n• OAuth scopes for the data you want to sync\n\nThe exact permissions depend on what data you want Parable to access. What specific data are you looking to integrate?`;
    } else {
      response = `I can help you with that! For ${connector.name} setup, I recommend:\n\n1. Check the documentation links in the Documentation tab\n2. Ensure you have admin access to ${connector.name}\n3. Follow the step-by-step setup guide\n\nCan you tell me more about what specific issue you're facing?`;
    }
    
    messages = [...messages, {
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }];
    
    isTyping = false;
  }
  
  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }
</script>

<div class="flex flex-col h-full">
  <!-- Chat Messages -->
  <div class="flex-1 overflow-y-auto p-6 space-y-4">
    {#each messages as message}
      <div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="flex items-start gap-3 max-w-[80%] {message.role === 'user' ? 'flex-row-reverse' : ''}">
          <!-- Avatar -->
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm {message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'} flex-shrink-0">
            {message.role === 'user' ? '👤' : '🤖'}
          </div>
          
          <!-- Message Bubble -->
          <div class="{message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'} rounded-lg px-4 py-3">
            <div class="text-sm whitespace-pre-wrap">{message.content}</div>
          </div>
        </div>
      </div>
    {/each}
    
    {#if isTyping}
      <div class="flex justify-start">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-purple-600 text-white">
            🤖
          </div>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Input Area -->
  <div class="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
    <div class="flex gap-3">
      <input
        type="text"
        bind:value={userInput}
        on:keypress={handleKeyPress}
        placeholder="Ask about {connector.name} setup..."
        class="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      <button
        on:click={handleSend}
        disabled={!userInput.trim()}
        class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
      Press Enter to send, Shift+Enter for new line
    </p>
  </div>
</div>

