<!-- Login.svelte -->
<script>
  import { login } from "../stores/authStore.js";
  import { Button, Input, Label, Checkbox, Helper } from "flowbite-svelte";
  import { push } from "svelte-spa-router";
  import { link } from "svelte-spa-router";
  import AuthMessage from "../components/Card/AuthCard.svelte";
  import burger from "../assets/icons/burger.png";

  let showAuthMessage = $state(false);
  let authMessage = $state("");
  let iconType = $state();
  let isRestaurant = $state(false);
  let isDarkMode = $state(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const loginData = new FormData();

    if (isRestaurant) {
      loginData.append("username", formData.get("gstIN"));
      loginData.append("password", formData.get("password"));
    } else {
      loginData.append("username", formData.get("email"));
      loginData.append("password", formData.get("password"));
    }

    const result = await login(loginData);

    if (result.success) {
      authMessage = result.message;
      showAuthMessage = true;
      iconType = "loginSuccess";
      setTimeout(() => push("/protectedHome"), 700);
    } else {
      authMessage = result.message;
      showAuthMessage = true;
      iconType = "wrongDetails";
      setTimeout(() => push("/register"), 700);
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden transition-all duration-500">

  <!-- Background decorative elements -->
  <div class="absolute top-10 left-10 w-20 h-20 bg-orange-200 dark:bg-orange-800/30 rounded-full opacity-60 animate-pulse transition-colors duration-500"></div>
  <div class="absolute bottom-20 right-16 w-16 h-16 bg-red-200 dark:bg-red-800/30 rounded-full opacity-40 animate-pulse delay-1000 transition-colors duration-500"></div>
  <div class="absolute top-1/3 right-10 w-12 h-12 bg-yellow-200 dark:bg-yellow-800/30 rounded-full opacity-50 animate-pulse delay-500 transition-colors duration-500"></div>
  
  <div class="w-full max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      
      <!-- Left Side - Login Form -->
      <div class="order-2 lg:order-1">
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl dark:shadow-gray-900/50 rounded-3xl p-8 lg:p-10 border border-white/20 dark:border-gray-700/50 relative transition-all duration-500">
          <!-- Decorative gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 dark:from-orange-400/10 dark:to-red-400/10 rounded-3xl transition-all duration-500"></div>
          
          <div class="relative z-10">
            <!-- Header -->
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 rounded-2xl mb-4 shadow-lg transition-all duration-500">
                <span class="text-2xl">🍴</span>
              </div>
              <h1 class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent mb-2 transition-all duration-500">
                Welcome to Foodle
              </h1>
              <p class="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-500">Made with ❤️ for food lovers</p>
            </div>

            <!-- Toggle Switch -->
            <div class="flex items-center justify-center mb-8">
              <div class="bg-gray-100 dark:bg-gray-700 rounded-full p-1 inline-flex items-center space-x-1 transition-colors duration-500">
                <button 
                  type="button"
                  class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 {!isRestaurant ? 'bg-white dark:bg-gray-600 shadow-md text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}"
                  onclick={() => isRestaurant = false}
                >
                  👤 Customer
                </button>
                <button 
                  type="button"
                  class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 {isRestaurant ? 'bg-white dark:bg-gray-600 shadow-md text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}"
                  onclick={() => isRestaurant = true}
                >
                  🏪 Restaurant
                </button>
              </div>
            </div>

            <!-- Form -->
            <form onsubmit={handleSubmit} class="space-y-6">
              {#if isRestaurant}
                <!-- Restaurant Fields -->
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 transition-colors duration-500">
                    <span class="text-orange-500 dark:text-orange-400">📋</span>
                    <span>GSTIN Number</span>
                  </label>
                  <div class="relative">
                    <input 
                      type="text" 
                      name="gstIN" 
                      placeholder="Enter your GSTIN number"
                      class="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      required 
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 transition-colors duration-500">
                    <span class="text-orange-500 dark:text-orange-400">🔒</span>
                    <span>Password</span>
                  </label>
                  <div class="relative">
                    <input 
                      type="password" 
                      name="password" 
                      placeholder="Enter your password"
                      class="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      required 
                    />
                  </div>
                </div>
              {:else}
                <!-- Customer Fields -->
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 transition-colors duration-500">
                    <span class="text-orange-500 dark:text-orange-400">✉️</span>
                    <span>Email Address</span>
                  </label>
                  <div class="relative">
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Enter your email address"
                      class="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      required 
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 transition-colors duration-500">
                    <span class="text-orange-500 dark:text-orange-400">🔒</span>
                    <span>Password</span>
                  </label>
                  <div class="relative">
                    <input 
                      type="password" 
                      name="password" 
                      placeholder="Enter your password"
                      class="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      required 
                    />
                  </div>
                </div>
              {/if}

              <!-- Login Button -->
              <button 
                type="submit" 
                class="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 dark:from-orange-400 dark:to-red-400 dark:hover:from-orange-500 dark:hover:to-red-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl dark:hover:shadow-orange-500/25 text-lg"
              >
                {#if isRestaurant}
                  🏪 Restaurant Login
                {:else}
                  👤 Customer Login
                {/if}
              </button>
            </form>

            <!-- Register Link -->
            <div class="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-500">
              <p class="text-gray-600 dark:text-gray-300 transition-colors duration-500">
                Don't have an account? 
                <a 
                  use:link 
                  href="/register" 
                  class="text-orange-600 hover:text-red-600 dark:text-orange-400 dark:hover:text-red-400 font-bold hover:underline transition-colors duration-300 ml-1"
                >
                  Create one now! 🚀
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Hero Image -->
      <div class="order-1 lg:order-2 flex items-center justify-center">
        <div class="relative">
          <!-- Decorative background circles -->
          <div class="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-orange-200 to-red-200 dark:from-orange-800/30 dark:to-red-800/30 rounded-full opacity-20 animate-pulse transition-colors duration-500"></div>
          <div class="absolute -bottom-4 -right-4 w-64 h-64 bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-yellow-800/30 dark:to-orange-800/30 rounded-full opacity-30 animate-pulse delay-1000 transition-colors duration-500"></div>
          
          <!-- Main image container -->
          <div class="relative z-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl dark:shadow-gray-900/50 transition-all duration-500">
            <img 
              src={burger}
              alt="Delicious Restaurant Food" 
              class="w-full max-w-md mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-300 {isDarkMode ? 'filter brightness-110' : ''}"
            />
            
            <!-- Floating elements -->
            <div class="absolute top-8 right-8 bg-orange-100 dark:bg-orange-900/80 text-orange-600 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-bold animate-bounce border dark:border-orange-800 transition-all duration-500">
              🔥 Hot & Fresh!
            </div>
            <div class="absolute bottom-8 left-8 bg-red-100 dark:bg-red-900/80 text-red-600 dark:text-red-300 px-4 py-2 rounded-full text-sm font-bold animate-bounce delay-500 border dark:border-red-800 transition-all duration-500">
              ⭐ Premium Quality
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom tagline -->
    <div class="text-center mt-12 lg:mt-16">
      <p class="text-gray-500 dark:text-gray-400 text-lg font-medium transition-colors duration-500">
        🍕 Connecting food lovers with amazing restaurants 🍔
      </p>
      <div class="flex items-center justify-center space-x-8 mt-4 text-gray-400 dark:text-gray-500 transition-colors duration-500">
        <span class="text-sm">🚀 Fast Delivery</span>
        <span class="text-sm">💯 Quality Food</span>
        <span class="text-sm">⭐ Best Service</span>
      </div>
    </div>
  </div>

  <!-- Error Modal -->
  {#if showAuthMessage}
    <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md p-4 transition-all duration-300">
      <AuthMessage {authMessage} {iconType} />
    </div>
  {/if}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  
  * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  /* Dark mode root class */
  :global(html.dark) {
    color-scheme: dark;
  }

  /* Custom animations */
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-pulse {
    animation: pulse 2s infinite;
  }
  
  .animate-bounce {
    animation: bounce 2s infinite;
  }
  
  /* Smooth theme transitions */
  * {
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-duration: 300ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .max-w-7xl {
      max-width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    .rounded-3xl {
      border-radius: 1.5rem;
    }
    
    .p-8 {
      padding: 1.5rem;
    }
    
    .lg\\:p-10 {
      padding: 1.5rem;
    }
  }

  /* Enhanced focus states for both themes */
  input:focus {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(251, 146, 60, 0.15);
  }
  
  :global(.dark) input:focus {
    box-shadow: 0 10px 25px rgba(251, 146, 60, 0.25);
  }
  
  button:focus {
    outline: 2px solid #f97316;
    outline-offset: 2px;
  }
  
  :global(.dark) button:focus {
    outline-color: #fb923c;
  }
  
  /* Theme toggle button hover effects */
  .group:hover .transform {
    transform: rotate(180deg);
  }
  
  /* Improved contrast for dark mode text */
  :global(.dark) .text-gray-800 {
    color: #f3f4f6;
  }
  
  :global(.dark) .placeholder-gray-400 {
    color: #9ca3af;
  }
  
  /* Smooth scrolling for mobile */
  html {
    scroll-behavior: smooth;
  }
  
  /* Custom scrollbar for dark mode */
  :global(.dark) ::-webkit-scrollbar {
    width: 8px;
  }
  
  :global(.dark) ::-webkit-scrollbar-track {
    background: #374151;
  }
  
  :global(.dark) ::-webkit-scrollbar-thumb {
    background: #6b7280;
    border-radius: 4px;
  }
  
  :global(.dark) ::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  /* Improved button shadows in dark mode */
  :global(.dark) .shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  }
</style>