<script>
  import { onMount } from 'svelte';
  import { Card, Spinner } from "flowbite-svelte";
  import routesType from "../../config/backend_routes.js";
  import { isAuthorized } from '../../stores/authStore.js';

  // State variables
  let orders = [];
  let loading = true;
  let error = null;

  // Helper function to format the date in the user's native timezone
  function formatNativeDate(isoDateString) {
    if (!isoDateString) return "N/A";
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat(navigator.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    }).format(date);
  }

  // Fetch all orders for the current user
  onMount(async () => {
    loading = true;
    error = null;
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error("No authorization token found. Please log in.");
      }
      
      const response = await fetch(`${routesType.current_route}/order/my-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch order history.');
      }

      const fetchedOrders = await response.json();
      // Reverse the array to show the most recent order first
      orders = fetchedOrders.reverse();

    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

</script>


<!-- ✅ Order History Page -->
<div class="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-4xl font-extrabold text-center mb-10 text-gray-900 dark:text-white">
      Your Order History
    </h1>

    {#if loading}
      <div class="text-center">
        <Spinner size="8" color="red" class="mb-4" />
        <p class="text-lg text-gray-600 dark:text-gray-400">Loading your orders...</p>
      </div>

    {:else if error}
      <Card class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 shadow-md">
        <p class="font-semibold">{error}</p>
      </Card>

    {:else if orders.length > 0}
      <!-- ✅ Latest Order -->
      <div class="mb-12 flex justify-center">
        {#if orders[0]}
          <Card
            class="relative w-full md:w-3/4 lg:w-2/3 overflow-hidden bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-2xl shadow-xl border border-yellow-300 dark:border-gray-600 hover:scale-[1.02] transition-transform duration-300"
          >
            <!-- 🎀 Slanted Ribbon -->
            <div class="absolute top-1.5 left-12 rotate-[0deg] mb-10
            md:top-2.5 md:left-20  
            lg:top-2.5 lg:left-20">
              <span class="bg-green-600 text-white text-xs lg:text-xl font-bold px-6 py-1 shadow-lg tracking-wide">
                🆕 LATEST ORDER
              </span>
            </div>

            <!-- Accent bar -->
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>

            <div class="p-6 space-y-4">
              <!-- Order ID badge -->
              <span class="inline-block mt-10 px-4 py-1 text-sm font-bold text-white bg-red-600 rounded-full shadow">
                Order #{orders[0].id}
              </span>

              <p class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                🍽️ Restaurant: <span class="font-normal">{orders[0].restaurant_name}</span>
              </p>
              <p class="text-lg font-medium text-gray-800 dark:text-gray-100">
                💰 Total Price: <span class="font-normal text-green-600 dark:text-green-400">₹{orders[0].total_price.toFixed(2)}</span>
              </p>
              <p class="text-md text-gray-600 dark:text-gray-400">
                📅 Placed On: <span class="font-medium">{formatNativeDate(orders[0].order_date)}</span>
              </p>

              <h4 class="text-lg font-semibold mt-4 text-gray-900 dark:text-white">🛒 Items Ordered:</h4>
              <ul class="space-y-1 text-gray-700 dark:text-gray-300">
                {#each orders[0].items.split(', ') as item}
                  <li class="flex items-center space-x-2">
                    <span class="text-green-500">✔</span>
                    <span>{item}</span>
                  </li>
                {/each}
              </ul>
            </div>
          </Card>
        {/if}
      </div>

<div class="inline-flex items-center justify-center w-full">
    <hr class="w-64 h-1 my-8 bg-gray-200 border-0 rounded-sm dark:bg-gray-700">
    <div class="absolute px-4 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900">
        <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
    <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
  </svg>
    </div>
</div>


      <!-- ✅ Older Orders -->
      {#if orders.length > 1}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          {#each orders.slice(1) as order (order.id)}
            <Card
              class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-transform duration-300 justify-self-center"
            >
              <!-- Accent bar -->
              <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>

              <div class="p-6 space-y-4">
                <!-- Order ID badge -->
                <span class="inline-block px-4 py-1 text-sm font-bold text-white bg-red-500 rounded-full shadow">
                  Order #{order.id}
                </span>

                <p class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  🍽️ Restaurant: <span class="font-normal">{order.restaurant_name}</span>
                </p>
                <p class="text-lg font-medium text-gray-800 dark:text-gray-100">
                  💰 Total Price: <span class="font-normal text-green-600 dark:text-green-400">₹{order.total_price.toFixed(2)}</span>
                </p>
                <p class="text-md text-gray-600 dark:text-gray-400">
                  📅 Placed On: <span class="font-medium">{formatNativeDate(order.order_date)}</span>
                </p>

                <h4 class="text-lg font-semibold mt-4 text-gray-900 dark:text-white">🛒 Items Ordered:</h4>
                <ul class="space-y-1 text-gray-700 dark:text-gray-300">
                  {#each order.items.split(', ') as item}
                    <li class="flex items-center space-x-2">
                      <span class="text-green-500">✔</span>
                      <span>{item}</span>
                    </li>
                  {/each}
                </ul>
              </div>
            </Card>
          {/each}
        </div>
      {/if}

    {:else}
      <p class="text-center text-gray-600 dark:text-gray-400">You have no orders yet. Start ordering!</p>
    {/if}
  </div>
</div>


