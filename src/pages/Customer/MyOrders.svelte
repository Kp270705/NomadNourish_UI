<script>
  import { onMount } from 'svelte';
  import { Card, Badge, Spinner } from 'flowbite-svelte';
  import { ClockOutline } from 'flowbite-svelte-icons';
  import routesType from '../../config/backend_routes.js';

  let orders = [];
  let loading = true;
  let error = null;

  const statusColors = {
    Pending: 'yellow',
    Preparing: 'blue',
    Ready: 'purple',
    Delivered: 'green',
    Cancelled: 'red',
  };

  onMount(async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${routesType.current_route}/order/user/my-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || 'Failed to fetch orders.');
      }
      orders = responseData;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-IN', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    });
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 dark:text-white">My Orders</h1>

    {#if loading}
      <div class="text-center">
        <Spinner size="8" />
        <p class="mt-4 dark:text-gray-300">Fetching your order history...</p>
      </div>
    {:else if error}
      <p class="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</p>
    {:else if orders.length === 0}
      <p class="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">You haven't placed any orders yet.</p>
    {:else}
      <div class="space-y-6">
        {#each orders as order (order.id)}
          <Card>
            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
              <div>
                <h5 class="text-xl font-bold text-gray-900 dark:text-white">{order.restaurant_name}</h5>
                <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <ClockOutline class="w-4 h-4" />
                  {formatDate(order.order_date)}
                </p>
              </div>
              <Badge color={statusColors[order.status] || 'gray'} class="mt-2 sm:mt-0 text-lg">
                {order.status}
              </Badge>
            </div>
            
            <hr class="my-3 dark:border-gray-700"/>

            <div>
              <h6 class="font-semibold mb-2 dark:text-gray-200">Order Items:</h6>
              <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {#each order.order_items as item}
                  <li>
                    {item.quantity} x {item.cuisine.cuisine_name} 
                    <span class="text-xs capitalize text-gray-500">({item.size})</span>
                  </li>
                {/each}
              </ul>
            </div>
            
            <div class="text-right font-bold text-lg mt-4 text-gray-800 dark:text-white">
              Total: ₹{order.total_price.toFixed(2)}
            </div>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</div>