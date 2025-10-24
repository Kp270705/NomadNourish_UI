<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { Card, Spinner, Badge, Alert } from "flowbite-svelte";
  import { InfoCircleSolid, ShoppingBagSolid, UserCircleSolid } from "flowbite-svelte-icons";
  import routesType from "../../config/backend_routes";
  import { restaurant } from '../../stores/authStore';

  let orders = [];
  let loading = true;
  let error = null;

  let totalRevenue = 0;
  let totalOrders = 0;
  let averageOrderValue = 0;
  let restaurantName = "Your Restaurant";
  $: if ($restaurant) {
    restaurantName = $restaurant.name;
  }
  
  // --- NEW: Object to map status to UI styles ---
  const statusStyles = {
    Pending: { color: 'yellow', text: '⏳ Pending' },
    Preparing: { color: 'blue', text: '🍳 Preparing' },
    Ready: { color: 'purple', text: '🔔 Ready for Pickup' },
    Delivered: { color: 'green', text: '✅ Delivered' },
    Cancelled: { color: 'red', text: '❌ Cancelled' },
  };

  function formatDate(isoDateString) {
    if (!isoDateString) return "N/A";
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  }

  onMount(async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) throw new Error("No authorization token found.");
      
      const response = await fetch(`${routesType.current_route}/order/restaurant/my-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch orders.');
      }
      
      const fetchedOrders = await response.json();
      // --- UPDATED: No need to reverse, the API already sorts by newest first ---
      orders = fetchedOrders; 
      
      totalOrders = orders.length;
      totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
      averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if loading}
    <Spinner />
    {:else if error}
      <Alert color="red" dismissable>
        {#snippet icon()}<InfoCircleSolid class="h-5 w-5" />{/snippet}
        A simple info alert with an
        <a href="/" class="font-semibold underline hover:text-red-800 dark:hover:text-red-900">example link</a>
        . Give it a click if you like.
      </Alert>
    {:else if orders.length > 0}
      <div>
        <div class="flex items-center gap-3 mb-8">
          <div class="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
            <ShoppingBagSolid class="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Recent Orders</h3>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {#each orders as order (order.id)}
            <Card class="bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 sm:min-w-full justify-self-center">
              <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <div class="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                      <ShoppingBagSolid class="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Order #{order.id}</h4>
                      <Badge color={statusStyles[order.status]?.color || 'gray'}>
                        {statusStyles[order.status]?.text || order.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div class="space-y-4 mb-6">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2"><UserCircleSolid/> Customer</span>
                    <span class="text-sm font-bold text-gray-900 dark:text-white">{order.user.username}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Total Amount</span>
                    <span class="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹{order.total_price.toFixed(2)}</span>
                  </div>
                  <div class="flex items-start justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Order Date</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white text-right">{formatDate(order.order_date)}</span>
                  </div>
                </div>

                <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h5 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Items Ordered</h5>
                  <div class="space-y-2">
                    {#each order.order_items as item (item.id)}
                      <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                          {item.quantity} x {item.cuisine.cuisine_name} <span class="text-xs capitalize">({item.size})</span>
                        </span>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            </Card>
          {/each}
        </div>
      </div>
      {/if}
  </div>
</div>