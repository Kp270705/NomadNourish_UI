<script>
  import { onMount } from 'svelte';
  import { Card, Spinner, Button, Badge } from 'flowbite-svelte';
  import { UserCircleSolid, ClockSolid, ArrowRightOutline, CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';
  import routesType from '../../config/backend_routes.js';
  import CancelModal from '../../components/alert/CancelModal.svelte';

  let orders = [];
  let loading = true;
  let error = null;
  let showCancelModal = false;
  let orderToCancelId = null;
  
  const statusConfig = {
    Pending: { color: 'yellow', nextAction: 'Preparing', nextActionText: 'Start Preparing' },
    Preparing: { color: 'blue', nextAction: 'Ready', nextActionText: 'Mark as Ready' },
    Ready: { color: 'purple', nextAction: 'Delivered', nextActionText: 'Mark as Delivered' },
  };

  async function fetchActiveOrders() {
    loading = true;
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${routesType.current_route}/order/restaurant/active-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch active orders.');
      orders = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
  
  onMount(fetchActiveOrders);

  async function updateOrderStatus(orderId, newStatus) {
    try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`${routesType.current_route}/order/restaurant/order/${orderId}/status`, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ new_status: newStatus })
        });

        if (!response.ok) throw new Error(`Failed to update status to ${newStatus}.`);
        if (newStatus === 'Delivered' || newStatus === 'Cancelled') {
          orders = orders.filter(o => o.id !== orderId);
        } else {
          const updatedOrder = await response.json();
          orders = orders.map(o => o.id === orderId ? updatedOrder : o);
        }
    } catch (err) {
        alert(err.message);
    }
  }

  
  // --- NEW FUNCTIONS TO HANDLE THE MODAL FLOW ---

  // This runs when the "Cancel Order" button is clicked.
  // It remembers which order we're working on and shows the modal.
  function promptToCancel(orderId) {
    orderToCancelId = orderId;
    showCancelModal = true;
  }
  
  // This is the function we will pass to the modal.
  // It runs the API call when the user confirms.
  function confirmCancel() {
    if (orderToCancelId) {
      updateOrderStatus(orderToCancelId, 'Cancelled');
    }
    // Close the modal regardless
    closeModal();
  }

  // This function simply closes the modal and resets our state.
  function closeModal() {
    showCancelModal = false;
    orderToCancelId = null;
  }

</script>


<CancelModal 
  bind:popupModal={showCancelModal}
  message="Are you sure you want to cancel this order?"
  onConfirm={confirmCancel}
  onCancel={closeModal}
/>

<div class="p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-8">Active Orders</h1>

    {#if loading}
      <div class="text-center py-16"><Spinner size="10" /></div>
    {:else if error}
      <p class="text-red-500 text-center">{error}</p>
    {:else if orders.length === 0}
      <div class="text-center py-20 text-gray-500">
          <CheckCircleSolid class="w-16 h-16 mx-auto mb-4 text-green-500"/>
          <h2 class="text-2xl font-bold mb-2 dark:text-white">All Caught Up!</h2>
          <p>You have no pending orders right now.</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each orders as order (order.id)}
          <Card class=" p-4 " >
            <div class="flex justify-between items-start">
              <h5 class="text-xl font-bold dark:text-white">Order #{order.id}</h5>
              <Badge color={statusConfig[order.status]?.color || 'gray'}>{order.status}</Badge>
            </div>

            <!-- customer name and time of order:  -->
            <div class="text-sm text-gray-500 dark:text-gray-400 my-4 space-y-2">
               <p class="flex items-center gap-2"><UserCircleSolid/> Customer: <span class="font-medium text-gray-700 dark:text-gray-200">{order.user.username}</span></p>
               <p class="flex items-center gap-2"><ClockSolid/> Placed: {new Date(order.order_date).toLocaleTimeString()}</p>
            </div>

            <!-- items quantity  -->
            <div class="border-t border-b dark:border-gray-700 py-3 my-3">
              <h6 class="font-semibold text-sm mb-2 dark:text-white">Items:</h6>
              <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {#each order.order_items as item}
                  <li>{item.quantity} x {item.cuisine.cuisine_name} ({item.size})</li>
                {/each}
              </ul>
            </div>
            
            <p class="font-bold text-lg dark:text-white text-right">Total: ₹{order.total_price.toFixed(2)}</p>

            <div class="mt-6 flex flex-col gap-2">
                {#if statusConfig[order.status]}
                    <Button onclick={() => updateOrderStatus(order.id, statusConfig[order.status].nextAction)}>
                        {statusConfig[order.status].nextActionText} <ArrowRightOutline class="w-4 h-4 ml-2"/>
                    </Button>
                {/if}
                <Button color="light" onclick={() => promptToCancel(order.id)} >
                    <CloseCircleSolid class="w-4 h-4 mr-2"/> Cancel Order
                </Button>
            </div>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</div>