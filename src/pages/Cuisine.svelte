<script>
  import { params } from 'svelte-spa-router';
  import { Card, Button } from "flowbite-svelte";
  import { CheckCircleSolid, CircleMinusSolid, SearchOutline, StarSolid, ClockOutline, FireOutline, MapPinOutline } from 'flowbite-svelte-icons';
  import routesType from "../config/backend_routes.js";
  import { userData } from '../stores/authStore';
  import { push } from 'svelte-spa-router';

  // State variables
  let cuisines = [];
  let loading = false;
  let error = null;
  let restaurant_id = 0
  let searchCuisine = "";
  let restaurantName = "Loading..."; 
  let restaurantLocation = "";

  $: if ($params && $params.id) {
    loading = true;
    error = null;
    restaurant_id = parseInt($params.id);
    fetchMenuData($params.id);
  }

  async function fetchMenuData(restaurantId) {
    try {
      if (!restaurantId || isNaN(restaurantId)) {
        throw new Error('Invalid restaurant ID.');
      }
      const response = await fetch(`${routesType.current_route}/cuisine/cuisines_by_restaurant_id/${restaurantId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch menu.');
      }
      const data = await response.json();
      restaurantName = data.restaurant_name;
      restaurantLocation = data.restaurant_location;
      cuisines = data.cuisines.map(c => ({ ...c, count: 0 }));
    } catch (err) {
      console.error("Error fetching menu:", err);
      error = err.message;
    } finally {
      loading = false;
    }
  }

  $: filteredCuisines = cuisines.filter(c =>
    c.cuisine_name.toLowerCase().includes(searchCuisine.toLowerCase())
  );
  
  function selectOrder(index) {
    cuisines = cuisines.map((c, i) => i === index ? { ...c, count: 1 } : c);
  }
  function increment(index) {
    cuisines = cuisines.map((c, i) => i === index ? { ...c, count: c.count + 1 } : c);
  }
  function decrement(index) {
    cuisines = cuisines.map((c, i) => {
      if (i === index) {
        const newCount = c.count - 1;
        return { ...c, count: newCount < 0 ? 0 : newCount };
      }
      return c;
    });
  }
  function unselect(index) {
    cuisines = cuisines.map((c, i) => i === index ? { ...c, count: 0 } : c);
  }
  
  $: selectedItems = cuisines.filter(c => c.count > 0);
  $: selectedCount = selectedItems.length;
  $: selectedTotal = selectedItems.reduce((sum, c) => sum + c.cuisine_price * c.count, 0);
  
  async function submitOrder() {
    if ($userData && $userData.is_restaurant) {
      alert("Restaurant owners cannot place orders.");
      return;
    }
    const orderItems = selectedItems.map(c => `${c.cuisine_name}: ${c.count}`);
    const orderTotal = selectedTotal;
    const orderPayload = { items: orderItems, total_price: orderTotal };
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${routesType.current_route}/order/orders/${restaurant_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to place order.');
      }
      const newOrder = await response.json();
      push(`/my-orders`);
      selectedItems = [];
    } catch (err) {
      console.error("Order submission failed:", err);
      alert(err.message);
    }
  }
</script>

<div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
  <div class="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 dark:from-red-800 dark:via-orange-800 dark:to-yellow-800">
    <div class="absolute inset-0 bg-black/20"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center text-white">
        <div class="mb-6">
          <div class="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
            <MapPinOutline class="mr-2" />
            <span class="font-medium">{restaurantLocation}</span>
          </div>
        </div>
        <h1 class="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {restaurantName}
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-white/90 font-light max-w-2xl mx-auto">
          "Crafted with passion, served with love. Experience flavors that tell a story."
        </p>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div class="text-3xl mb-2">🍽️</div>
            <div class="text-2xl font-bold">{cuisines.length}</div>
            <div class="text-sm opacity-90">Menu Items</div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <StarSolid class="mx-auto mb-2 text-3xl text-yellow-300" />
            <div class="text-2xl font-bold">4.8</div>
            <div class="text-sm opacity-90">Rating</div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <ClockOutline class="mx-auto mb-2 text-3xl" />
            <div class="text-2xl font-bold">25-30</div>
            <div class="text-sm opacity-90">Min Delivery</div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div class="text-3xl mb-2">💰</div>
            <div class="text-2xl font-bold">
              ₹{cuisines.length > 0 ? Math.min(...cuisines.map(c => c.cuisine_price)) : 0}
            </div>
            <div class="text-sm opacity-90">Starting From</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-12">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <div class="relative max-w-2xl mx-auto">
          <input
            type="text"
            bind:value={searchCuisine}
            placeholder="Search for your favorite dish..."
            class="w-full h-14 rounded-2xl border-2 border-gray-200 dark:border-gray-600 px-6 pl-14 text-lg bg-gray-50 dark:bg-gray-700 focus:ring-4 focus:ring-orange-500/25 focus:border-orange-500 dark:text-white transition-all duration-300 shadow-inner"
          />
          <SearchOutline class="absolute left-5 top-4 text-gray-400 text-xl" />
          <div class="absolute right-3 top-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl text-sm font-medium shadow-lg">
            Search
          </div>
        </div>
      </div>
    </div>
    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="text-center">
          <div class="text-6xl mb-4 animate-bounce">🍽️</div>
          <p class="text-2xl font-semibold text-gray-700 dark:text-gray-300">Preparing your menu...</p>
        </div>
      </div>
    {:else if error}
      <div class="text-center py-16">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-12 max-w-md mx-auto">
          <div class="text-6xl mb-4">😞</div>
          <p class="text-red-600 dark:text-red-400 text-xl font-semibold mb-2">Oops! Something went wrong</p>
          <p class="text-red-500 dark:text-red-300">{error}</p>
        </div>
      </div>
    {:else if filteredCuisines.length > 0}
      
      <div class="space-y-6 mb-32 ">
        {#each filteredCuisines as cuisine, i (cuisine.id)}
          <Card class="w-full max-w-full md:max-w-4xl lg:max-w-5xl mx-auto overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row items-stretch">
              <div class="w-full sm:w-64 flex-shrink-0 h-48 sm:h-auto bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 relative overflow-hidden flex items-center justify-center">
                <div class="text-6xl filter drop-shadow-lg text-white">
                  🍽️
                </div>
              </div>
              <div class="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {cuisine.cuisine_name}
                  </h3>
                  <div class="flex items-center gap-2 mb-4">
                    <div class="text-3xl font-bold text-gray-900 dark:text-white">
                      ₹{cuisine.cuisine_price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div class="mt-4 flex justify-end">
                  {#if cuisine.count === 0}
                    <Button 
                      onclick={() => selectOrder(i)}
                      class="flex items-center gap-3 px-6 py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transition-all duration-300"
                    >
                      <CheckCircleSolid class="w-5 h-5" />
                      Add to Cart
                    </Button>
                  {:else}
                    <div class="flex items-center gap-4">
                      <Button 
                        color="gray" 
                        size="sm" 
                        onclick={() => unselect(i)}
                        class="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Remove
                      </Button>
                      <div class="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-2xl p-2">
                        <Button 
                          color="light" 
                          size="sm" 
                          onclick={() => decrement(i)}
                          class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-lg"
                        >
                          -
                        </Button>
                        <span class="font-bold text-xl text-gray-900 dark:text-white min-w-8 text-center">{cuisine.count}</span>
                        <Button 
                          color="light" 
                          size="sm" 
                          onclick={() => increment(i)}
                          class="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-lg"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </Card>
        {/each}
      </div>

      {#if selectedCount > 0}
        <div class="
          fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 
          text-white shadow-2xl z-50 backdrop-blur-sm border-t border-blue-500
        ">
          <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div class="flex items-center gap-4 w-full md:w-auto">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  🛒
                </div>
                <div>
                  <div class="font-bold text-lg">
                    {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
                  </div>
                  <div class="text-blue-100 text-sm">Ready to order</div>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
              <div class="text-center md:text-right w-full sm:w-auto">
                <div class="text-sm text-blue-100">Total Amount</div>
                <div class="font-bold text-2xl">₹{selectedTotal.toFixed(2)}</div>
              </div>
              
              <div class="flex gap-4 w-full sm:w-auto">
                <Button 
                  color="light" 
                  onclick={() => {
                    cuisines = cuisines.map(c => ({ ...c, count: 0 }));
                  }}
                  class="px-4 py-2 rounded-xl hover:bg-gray-100 w-full"
                >
                  Clear All
                </Button>
                
                <Button 
                  onclick={submitOrder}
                  class="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                  text-white font-bold rounded-2xl shadow-lg transition-all duration-300 w-full"
                >
                  Place Order 🚀
                </Button>
              </div>
            </div>

          </div>
        </div>
      {/if}

      
    {:else}
      <div class="text-center py-16">
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-lg border border-gray-100 dark:border-gray-700 max-w-md mx-auto">
          <div class="text-6xl mb-6">🔍</div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">No dishes found</h3>
          <p class="text-gray-600 dark:text-gray-400 text-lg">
            {#if searchCuisine}
              Sorry, we couldn't find any dishes matching "{searchCuisine}". Try a different search term!
            {:else}
              This restaurant hasn't added any menu items yet. Check back soon!
            {/if}
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>
<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .space-y-6 > * {
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: calc(var(--index, 0) * 0.1s);
  }
</style>