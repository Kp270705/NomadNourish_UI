<script>
  import routesType from "../config/backend_routes.js";
  import { onMount } from 'svelte';
  
  // Flowbite components
  import { Card, Button, Label, Input, Checkbox } from "flowbite-svelte";
  
  // Router
  import { push, link } from "svelte-spa-router";
  
  // Error Card
  import AuthMessage from "../components/Card/AuthCard.svelte";
  
// States
  let showAuthMessage = $state(false);
  let authMessage = $state("");
  let iconType = $state();
  let isRestaurant = $state(false);

  // Correct: Use $state() for reactive variables
  let communityStats = $state({
    total_customers: 10000,
    total_restaurants: 500,
    total_orders: 50000
  });
  
  onMount(async () => {
    try {
      const response = await fetch(`${routesType.current_route}/stats/community`);
      if (response.ok) {
        const stats = await response.json();
        // Correct: Assign the new data directly to the $state variable
        communityStats = stats;
      }
    } catch (e) {
      console.error("Failed to fetch community stats:", e);
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const endpoint = isRestaurant 
        ? `${routesType.current_route}/restaurant/register` 
        : `${routesType.current_route}/user/register`;
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      const result = await response.json();
      
      if (response.status === 409) {
        setTimeout(() => {
          push("/register");
        }, 700);
        authMessage = result.detail;
        showAuthMessage = true;
        iconType = "userAlreadyFound";
        return;
      } else if (response.status === 200) {
        setTimeout(() => {
          push("/login");
        }, 700);
        authMessage = "Registered successfully 🎉 🎉";
        showAuthMessage = true;
        iconType = "registerSuccess";
        return;
      } else if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`);
      }
    } catch (err) {
      console.error("❌ Register error:", err);
      authMessage = `${err.message}. Server unavailable.`;
      setTimeout(() => {
        push("/register");
      }, 700);
      showAuthMessage = true;
      iconType = "serverNotAvailable";
      return;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500 flex items-center justify-center p-8">
  <div class="w-full max-w-6xl mx-auto">
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-400 dark:to-blue-400 rounded-3xl mb-4 shadow-xl">
        <span class="text-4xl">🥘</span>
      </div>
      <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
        Join Nomad Nourish Family
      </h1>
      <p class="text-gray-600 dark:text-gray-300 text-xl">Start your culinary journey today! 🍽️</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      <div class="lg:order-1 space-y-6">
        <Card class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
            👥 For Customers
          </h3>
          <ul class="space-y-3 text-gray-600 dark:text-gray-300">
            <li class="flex items-center space-x-3 text-green-500">
              <span>✅ Discover amazing restaurants</span>
            </li>
            <li class="flex items-center space-x-3 text-green-500">
              <span>✅ Read genuine reviews</span>
            </li>
            <li class="flex items-center space-x-3 text-green-500">
              <span>✅ Easy online ordering</span>
            </li>
            <li class="flex items-center space-x-3 text-green-500">
              <span>✅ Exclusive deals & offers</span>
            </li>
          </ul>
        </Card>

        <Card class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
            🏪 For Restaurants
          </h3>
          <ul class="space-y-3 text-gray-600 dark:text-gray-300">
            <li class="flex items-center space-x-3 text-blue-500">
              <span>✅ Reach more customers</span>
            </li>
            <li class="flex items-center space-x-3 text-blue-500">
              <span>✅ Manage your menu online</span>
            </li>
            <li class="flex items-center space-x-3 text-blue-500">
              <span>✅ Track orders & analytics</span>
            </li>
            <li class="flex items-center space-x-3 text-blue-500">
              <span>✅ Build your brand</span>
            </li>
          </ul>
        </Card>
      </div>

      <div class="lg:order-2 lg:col-span-1">
        <Card class="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Create Account</h2>
            <p class="text-gray-600 dark:text-gray-400">Fill in your details to get started</p>
          </div>

          <div class="flex items-center justify-center mb-6">
            <div class="bg-gray-100 dark:bg-gray-700 rounded-full p-1 inline-flex items-center space-x-1">
              <button 
                type="button"
                class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 {!isRestaurant ? 'bg-white dark:bg-gray-600 shadow-md text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}"
                onclick={() => isRestaurant = false}
              >
                👤 I'm a Customer
              </button>
              <button 
                type="button"
                class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 {isRestaurant ? 'bg-white dark:bg-gray-600 shadow-md text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}"
                onclick={() => isRestaurant = true}
              >
                🏪 I'm a Restaurant
              </button>
            </div>
          </div>

          <form onsubmit={handleSubmit} class="space-y-5">
            {#if isRestaurant}
              <div class="space-y-4">
                <div>
                  <Label for="name" class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 mb-1">
                    <span class="text-blue-500 dark:text-blue-400">🏪</span>
                    <span>Restaurant Name</span>
                  </Label>
                  <Input type="text" name="name" id="name" placeholder="Enter your restaurant name" required />
                </div>

                <div>
                  <Label for="password" class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 mb-1">
                    <span class="text-blue-500 dark:text-blue-400">🔒</span>
                    <span>Password</span>
                  </Label>
                  <Input type="password" name="password" id="password" placeholder="Create a secure password" required />
                </div>

                <div>
                  <Label for="location" class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 mb-1">
                    <span class="text-blue-500 dark:text-blue-400">📍</span>
                    <span>Location</span>
                  </Label>
                  <Input type="text" name="location" id="location" placeholder="City, State, Country" required />
                </div>
                
                <div>
                  <Label for="mobile_number" class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 mb-1">
                    <span class="text-blue-500 dark:text-blue-400">📱</span>
                    <span>Contact Number</span>
                  </Label>
                  <Input type="tel" name="mobile_number" id="mobile_number" placeholder="+91 98765 43210" required />
                </div>

                <div>
                  <Label for="gstIN" class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 mb-1">
                    <span class="text-blue-500 dark:text-blue-400">📋</span>
                    <span>GSTIN Number</span>
                  </Label>
                  <Input type="text" name="gstIN" id="gstIN" placeholder="22AAAAA0000A1Z5" required />
                </div>
                <div>
                  <Label for="support_email" class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 mb-1">
                    <span class="text-blue-500 dark:text-blue-400">📧</span>
                    <span>Support Email (For Customers)</span>
                  </Label>
                  <Input type="email" name="support_email" id="support_email" placeholder="support@yourrestaurant.com" required />
                </div>

                <!-- <div class="space-y-2">
                  <Label class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2">
                    <span class="text-blue-500 dark:text-blue-400">📧</span>
                    <span>Support Email (For Customers)</span>
                  </Label>
                  <input type="email" name="support_email" placeholder="support@yourrestaurant.com" class="..." required />
                </div> -->

              </div>
            {:else}
              <div class="space-y-4">
                <div>
                  <Label for="username" class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 mb-1">
                    <span class="text-green-500 dark:text-green-400">👤</span>
                    <span>Username</span>
                  </Label>
                  <Input type="text" name="username" id="username" placeholder="Choose a unique username" required />
                </div>

                <div>
                  <Label for="email" class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 mb-1">
                    <span class="text-green-500 dark:text-green-400">✉️</span>
                    <span>Email Address</span>
                  </Label>
                  <Input type="email" name="email" id="email" placeholder="your.email@example.com" required />
                </div>

                <div>
                  <Label for="password" class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 mb-1">
                    <span class="text-green-500 dark:text-green-400">🔒</span>
                    <span>Password</span>
                  </Label>
                  <Input type="password" name="password" id="password" placeholder="Create a secure password" required />
                </div>

                <div>
                  <Label for="location" class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 mb-1">
                    <span class="text-green-500 dark:text-green-400">🔒</span>
                    <span>Location</span>
                  </Label>
                  <Input type="text" name="location" id="location" placeholder="Enter your current location" required />
                </div>

              </div>
            {/if}

            <button 
              type="submit" 
              class="w-full mt-6 bg-gradient-to-r {isRestaurant ? 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' : 'from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'} text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-lg"
            >
              {#if isRestaurant}
                🏪 Register Restaurant
              {:else}
                👤 Create Account
              {/if}
            </button>
          </form>

          <div class="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p class="text-gray-600 dark:text-gray-300">
              Already have an account? 
              <a use:link href="/login" class="text-blue-600 hover:text-green-600 dark:text-blue-400 dark:hover:text-green-400 font-bold hover:underline ml-1">
                Sign in here! 🚀
              </a>
            </p>
          </div>
        </Card>
      </div>

      <div class="lg:order-3 space-y-6">
        <Card class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
            📊 Our Community
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{communityStats.total_customers}+</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Happy Customers</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{communityStats.total_restaurants}+</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Partner Restaurants</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600 dark:text-green-400">{communityStats.total_orders}+</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Orders Delivered</div>
            </div>
          </div>
        </Card>

        <Card class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
            ⭐ Why Choose Us?
          </h3>
          <div class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div class="flex items-center space-x-2 text-yellow-500">
              <span>🛡️</span>
              <span>100% Secure Platform</span>
            </div>
            <div class="flex items-center space-x-2 text-green-500">
              <span>⚡</span>
              <span>Lightning Fast Service</span>
            </div>
            <div class="flex items-center space-x-2 text-blue-500">
              <span>💰</span>
              <span>Best Prices Guaranteed</span>
            </div>
            <div class="flex items-center space-x-2 text-purple-500">
              <span>🎯</span>
              <span>Personalized Experience</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>

  {#if showAuthMessage}
    <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md p-4">
      <AuthMessage {authMessage} {iconType} />
    </div>
  {/if}
</div>