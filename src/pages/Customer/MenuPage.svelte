<script>
  // onMount hata diya, $effect use karenge
  import { params, push, link, location } from 'svelte-spa-router'; 
  import { Card, Button, Badge } from 'flowbite-svelte';
  import { MapPinOutline, ShoppingBagSolid, StarSolid, ClockOutline, UsersOutline } from 'flowbite-svelte-icons';
  import routesType from '../../config/backend_routes.js';
  import nn from "../../assets/Images/Home/nn.png"
  import food from "../../assets/icons/food1.png"

  // NAYE DERIVED STORES IMPORT KIYE
  import { cart, cartStore, totalItemsInCart, cartRestaurants } from '../../stores/cartStore.js'; 
  
  // --- State variables (Svelte Runes style) ---
  let restaurant = $state({ name: 'Loading...', location: '...' });
  let cuisines = $state([]);
  let loading = $state(true);
  let error = $state(null);
  let restaurant_id = $state(0);
  let selectedCategory = $state('all');

  // --- Derived state (Svelte Runes style) ---
  let itemsInThisCart = $derived(() => {
    const thisRestoInCart = $cartStore.restaurants[restaurant_id];
    if (thisRestoInCart) {
      return Object.values(thisRestoInCart.items);
    }
    return [];
  });
  
  let categories = $derived([...new Set(cuisines.map(c => c.category))]);
  
  let filteredCuisines = $derived(
    selectedCategory === 'all' 
      ? cuisines 
      : cuisines.filter(c => c.category === selectedCategory)
  );
  // --- END OF RUNES REFACTOR ---

  async function fetchMenuData(id) {
    try {
      const response = await fetch(`${routesType.current_route}/cuisine/cuisines_by_restaurant_id/${id}`);
      if (!response.ok) throw new Error('Failed to fetch menu.');
      const data = await response.json();
      restaurant = { name: data.restaurant_name, location: data.restaurant_location };
      cuisines = data.cuisines;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  // Side Effect (Runes style) - yeh onMount jaisa kaam karega
  // aur jab bhi $params badlega, tab bhi run hoga
  $effect(() => {
    if ($params && $params.id) {
      loading = true;
      error = null;
      restaurant_id = parseInt($params.id);
      fetchMenuData($params.id);
    }
  });
</script>

<!-- HTML (Aapka HTML/Template poora sahi tha, usmein koi change nahi) -->
<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- ... (Header section) ... -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <img src="{food}" alt="Restaurant" class="w-[100%] h-[100%]" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {restaurant.name}
            </h1>
            <div class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <MapPinOutline size="sm" class="text-orange-500"/>
              <span>{restaurant.location}</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <StarSolid class="text-yellow-500" size="sm"/>
            <span>4.8</span>
          </div>
          <div class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <ClockOutline class="text-green-500" size="sm"/>
            <span>25-30 min</span>
          </div>
        </div>
      </div>
    </div>
  </div>        

  <div class="max-w-6xl mx-auto px-4 py-6 ">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 ">
      
      <!-- Menu Section -->
      <div class="lg:col-span-8 ">
        <!-- ... (Minimal Menu Header) ... -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Menu ({cuisines.length} items)
            </h2>
            
            {#if categories.length > 1}
              <div class="flex gap-2">
                <button 
                  class="px-3 py-1 text-sm rounded-md font-medium transition-colors {selectedCategory === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}"
                  onclick={() => selectedCategory = 'all'}>
                  All
                </button>
                {#each categories as category}
                  <button 
                    class="px-3 py-1 text-sm rounded-md font-medium transition-colors {selectedCategory === category ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}"
                    onclick={() => selectedCategory = category}>
                    {category}
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        </div>
        
        {#if loading}
          <!-- Loading state -->
        {:else if error}
          <!-- Error state -->
        {:else}
          <div class="space-y-4">
            <!-- Ab yeh $derived 'filteredCuisines' ko loop karega -->
            {#each filteredCuisines as cuisine (cuisine.id)}
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow overflow-hidden">
                <div class="flex flex-col sm:flex-row" >
                  <!-- Image -->
                  <div class="relative w-full sm:w-32 h-40 sm:h-32 flex-shrink-0">
                    {#if cuisine.cuisine_image}
                      <img src="{cuisine.cuisine_image}" alt="{cuisine.cuisine_name}" class="w-full h-full object-cover sm:rounded-l-lg rounded-t-lg sm:rounded-t-none" />
                    {:else}
                      <div class="w-full h-full bg-gradient-to-br from-orange-300 to-red-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center sm:rounded-l-lg rounded-t-lg sm:rounded-t-none">
                        <img src="{nn}" alt="Food" class="w-[90%] h-[90%] opacity-90" />
                      </div>
                    {/if}
                    <div class="absolute top-2 right-2">
                      <div class="w-6 h-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                        <div class="w-3 h-3 rounded-full" style="background-color: {cuisine.category === 'Veg' ? '#22c55e' : '#ef4444'}"></div>
                      </div>
                    </div>
                  </div>
                  <!-- Details -->
                  <div class="flex-1 p-3 sm:p-4">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between h-full gap-3">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            {cuisine.cuisine_name}
                          </h3>
                          <Badge 
                            color={cuisine.category === 'Veg' ? 'green' : 'red'} 
                            class="text-xs px-2 py-1">
                            {cuisine.category}
                          </Badge>
                        </div>
                        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
                          Fresh ingredients, authentic flavors
                        </p>
                      </div>
                      <!-- Add Buttons -->
                      <div class="flex gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                        {#if cuisine.price_half}
                          <Button 
                            size="sm"
                            color="light"
                            class="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-orange-200 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            onclick={() => cart.addToCart(cuisine, 'half', restaurant_id, restaurant.name)}>
                            <div class="text-center">
                              <div class="text-xs text-gray-500 dark:text-gray-400">Half</div>
                              <div class="font-semibold text-sm">₹{cuisine.price_half}</div>
                            </div>
                          </Button>
                        {/if}
                        <Button 
                          size="sm"
                          class="flex-1 sm:flex-none px-2 sm:px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white"
                          onclick={() => cart.addToCart(cuisine, 'full', restaurant_id, restaurant.name)}>
                          <div class="text-center">
                            <div class="text-xs opacity-90">Full</div>
                            <div class="font-semibold text-sm">₹{cuisine.price_full}</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Compact Cart Section -->
      <div class="lg:col-span-4">
        <div class="lg:sticky lg:top-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <!-- Header -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2">
                  <ShoppingBagSolid class="text-orange-500" size="sm"/>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white inline">
                    Your Cart
                  </h2>
                </div>
                {#if $totalItemsInCart > 0}
                  <span class="text-sm font-medium text-orange-500 truncate">
                    ({$totalItemsInCart} total items)
                  </span>
                {/if}
              </div>
            </div>

            <!-- Items from THIS restaurant (ab 'itemsInThisCart' $derived se aa raha hai) -->
            {#if itemsInThisCart.length > 0}
              <div class="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">From {restaurant.name}</h3>
                {#each itemsInThisCart() as item (`${item.id}-${item.size}`)}
                  <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div class="flex justify-between items-start mb-3">
                      <div class="flex-1 pr-3">
                          <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-1">{item.name}</h4>
                          <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.size} • ₹{item.price} each</p>
                      </div>
                      <div class="text-right">
                          <p class="text-sm font-semibold text-orange-600 dark:text-orange-400">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <div class="flex items-center justify-end">
                      <div class="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-md p-1 border border-gray-200 dark:border-gray-600">
                        <Button size="sm" color="light" class="w-6 h-6 p-0..."
                          onclick={() => cart.updateQuantity(`${item.id}-${item.size}`, restaurant_id, -1)}>
                          −
                        </Button>
                        <span class="w-8 text-center...">{item.quantity}</span>
                        <Button size="sm" color="light" class="w-6 h-6 p-0..."
                          onclick={() => cart.updateQuantity(`${item.id}-${item.size}`, restaurant_id, 1)}>
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>

              <!-- Other restaurants summary -->
              {#if $cartRestaurants.length > 1}
                <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Also in your cart:</h3>
                  {#each $cartRestaurants as resto}
                    {#if resto.restaurantId !== restaurant_id}
                      <p class="text-sm text-gray-600 dark:text-gray-300">Items from {resto.restaurantName}</p>
                    {/if}
                  {/each}
                </div>
              {/if}

            
              {:else if $totalItemsInCart > 0}
              <div class="p-8 text-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  You have items from other restaurants in your cart.
                </p>
              </div>
            {:else}
              <div class="p-8 text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <ShoppingBagSolid size="lg" class="text-gray-400 dark:text-gray-500" />
                </div>
                <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Cart is empty</h3>
              </div>
            {/if}

            <!-- View Cart button -->
            {#if $totalItemsInCart > 0}
              <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                <a use:link href="/usercart" 
                   class="w-full text-center block font-medium py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
                  View Full Cart ({$totalItemsInCart} {$totalItemsInCart === 1 ? 'item' : 'items'})
                </a>
              </div>
            {/if}
            
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* ... same styles ... */
</style>