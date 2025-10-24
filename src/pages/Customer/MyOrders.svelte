<script>
  import { onMount } from 'svelte';
  import { Card, Badge, Spinner, Button } from 'flowbite-svelte';
  import { ClockOutline, CloseCircleSolid, StoreOutline } from 'flowbite-svelte-icons';
  import routesType from '../../config/backend_routes.js';
  import Notifications from '../../components/Notifications.svelte';

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
  const statusCancelOrder = [
    'Pending',
    'Preparing',
    'Ready',
    'Delivered',
    'Cancelled',
  ];
  const statusStyles = {
    Pending: { color: 'yellow', text: 'Pending Confirmation' },
    Preparing: { color: 'blue', text: 'Restaurant is Preparing' },
    Ready: { color: 'purple', text: 'Ready for Delivery/Pickup' },
    Delivered: { color: 'green', text: 'Delivered' },
    Cancelled: { color: 'red', text: 'Cancelled' },
  };

  onMount(async () => {
    await fetchOrders();
  });

  async function fetchOrders() {
    try {
      loading = true;
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
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-IN', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    });
  }

  // +++ NEW FUNCTION TO CANCEL AN ORDER +++
  async function cancelOrder(orderId) {
    if (!confirm("Are you sure you want to cancel this order? This cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${routesType.current_route}/order/user/cancel/${orderId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || 'Failed to cancel order.');
      }
      
      // Update the UI without a full refresh
      orders = orders.map(order => 
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
      );

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  }
</script>

<div class="min-h-screen bg-white dark:bg-[#0a101d] p-4 sm:p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">Your Orders</h1>

    {#if loading}
      <div class="text-center py-10"><Spinner size="8" /></div>
    {:else if error}
      <p class="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</p>
    {:else if orders.length === 0}
      <div class="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
         <p class="text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each orders as order (order.id)}
          <div class="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#172135] shadow-sm overflow-hidden">
            
            <div class="bg-gray-200 dark:bg-[#0f1729] p-3 px-4 text-xs text-gray-600 dark:text-gray-300 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
              <div>
                <span class="uppercase font-medium block">Order Placed</span>
                <span>{formatDate(order.order_date)}</span>
              </div>
              <div>
                <span class="uppercase font-medium block">Total</span>
                <span>₹{order.total_price.toFixed(2)}</span>
              </div>
              <div class="hidden sm:block">
                 <span class="uppercase font-medium block">Restaurant</span>
                 <span class="flex items-center gap-1"><StoreOutline class="w-3 h-3"/>{order.restaurant_name}</span>
              </div>
              <div class="text-right">
                <span class="uppercase font-medium block">Order #</span>
                <span>{order.id}</span>
                </div>
            </div>

            <div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <div class="flex items-center mb-3">
                   <Badge color={statusStyles[order.status]?.color || 'gray'} class="text-sm font-semibold mr-3">
                    {statusStyles[order.status]?.text || order.status}
                   </Badge>
                   {#if order.status === 'Cancelled'}
                    <p class="text-sm text-gray-500 dark:text-gray-400">If you were charged, a refund is processing.</p>
                   {/if}
                </div>

                <ul class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {#each order.order_items as item}
                    <li class="pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                      <span class="font-medium">{item.quantity} x</span> {item.cuisine.cuisine_name} 
                      <span class="text-xs capitalize text-gray-500">({item.size})</span>
                    </li>
                  {/each}
                </ul>
              </div>

              <div class="md:col-span-1 flex flex-col items-stretch gap-2 justify-start md:border-l md:pl-4 dark:border-gray-700">
                {#if order.status === 'Pending' || order.status === 'Preparing'}
                  <Button color="red" size="sm" class="w-full justify-center" onclick={() => cancelOrder(order.id)}>
                    <CloseCircleSolid class="w-4 h-4 mr-2"/> Cancel Order
                  </Button>
                {/if}
                 {#if order.status === 'Delivered'}
                   <Button color="light" size="sm" class="w-full justify-center">Leave Feedback</Button>
                   <Button color="light" size="sm" class="w-full justify-center">Write a Review</Button>
                {/if}
                 <Button color="light" size="sm" class="w-full justify-center">View Invoice</Button> 
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

