<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { Card, Spinner, Badge, Alert } from "flowbite-svelte";
  import { InfoCircleSolid, ShoppingBagSolid, UserCircleSolid, ChevronDownOutline } from "flowbite-svelte-icons";
  import routesType from "../../config/backend_routes";
  import { restaurant } from '../../stores/authStore';
  import GeneralStyle from '../../utils/restaurants/generalStyle';

  const cardDarkBg = new GeneralStyle().CardDarkBg();
  const hoverCardDarkBg = new GeneralStyle().HoverCardDarkBg();
  const labelDarkBg = new GeneralStyle().LabelDarkBg();
  const hoverLabelDarkBg = new GeneralStyle().HoverLabelDarkBg();

  let allOrders = []; // Master list
  let filteredOrders = []; // UI list
  let loading = true;
  let error = null;

  // Stats
  let totalRevenue = 0;
  let totalOrders = 0;
  let averageOrderValue = 0;
  let restaurantName = "Your Restaurant";
  $: if ($restaurant) {
    restaurantName = $restaurant.name;
  }
  
  // Filter states
  let selectedFilter = 'Month'; // Default filter "Month"
  const filterOptions = [
    { value: 'Today', label: 'Today' },
    { value: 'Week', label: 'Last 7 Days' }, // Label change
    { value: 'Month', label: 'Last 30 Days' }, // Label change
    { value: '3Months', label: '3 Months' },
    { value: '6Months', label: '6 Months' },
    { value: 'Yearly', label: 'This Year' },
  ];
  // ---

  const statusStyles = {
    Pending: { color: 'yellow', text: '⏳ Pending' },
    Preparing: { color: 'blue', text: '🍳 Preparing' },
    Ready: { color: 'purple', text: '🔔 Ready for Pickup' },
    Delivered: { color: 'green', text: '✅ Delivered' },
    Cancelled: { color: 'red', text: '❌ Cancelled' },
  };

  let expandedOrderId = null;

  function toggleOrder(orderId) {
    if (expandedOrderId === orderId) {
      expandedOrderId = null;
    } else {
      expandedOrderId = orderId;
    }
  }

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

  // --- fetchAllOrders function (This is correct, no change) ---
  async function fetchAllOrders() {
    loading = true;
    error = null;
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) throw new Error("No authorization token found.");
      
      const fetchUrl = `${routesType.current_route}/order/restaurant/my-orders`;
      
      const response = await fetch(fetchUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch orders.');
      }
      
      allOrders = await response.json(); 
      
      totalOrders = allOrders.length;
      totalRevenue = allOrders.reduce((sum, order) => sum + (order.status !== 'Cancelled' ? order.total_price : 0), 0);
      averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0; 

    } catch (err) {
      error = err.message;
      allOrders = [];
    } finally {
      loading = false;
    }
  }

  // --- SVELTE REACTIVE FILTER LOGIC (FIXED) ---
  $: {
    if (loading) {
      filteredOrders = [];
    } else {
      const now = new Date();
      let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0); // Start of today

      if (selectedFilter === "Today") {
        // Start date is already set to today 00:00
      } 
      else if (selectedFilter === "Week") {
        // "Last 7 Days"
        startDate.setDate(now.getDate() - 7);
      } 
      else if (selectedFilter === "Month") {
        // "Last 30 Days"
        startDate.setDate(now.getDate() - 30);
      } 
      else if (selectedFilter === "3Months") {
        // "Last 3 Months"
        startDate.setMonth(now.getMonth() - 3);
      } 
      else if (selectedFilter === "6Months") {
        // "Last 6 Months"
        startDate.setMonth(now.getMonth() - 6);
      } 
      else if (selectedFilter === "Yearly") {
        // "This Year" (since Jan 1st)
        startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
      }

      // Filter the master list
      filteredOrders = allOrders.filter(order => {
        const orderDate = new Date(order.order_date); // DB ISO string
        return orderDate >= startDate;
      });
      
      console.log(`Filter changed to '${selectedFilter}'. Start Date: ${startDate.toString()}. Showing ${filteredOrders.length} of ${allOrders.length} orders.`);
    }
  }
  // --- END OF FIX ---

  // --- Simplified handler (This is correct, no change) ---
  function handleFilterChange(newFilter) {
    if (newFilter === selectedFilter) return;
    selectedFilter = newFilter;
  }

  // onMount (This is correct, no change)
  onMount(fetchAllOrders);
</script>

<!-- HTML -->
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    
    <!-- Header -->
    <div class="flex items-center gap-3 mb-4">
      <div class="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
        <ShoppingBagSolid class="w-5 h-5 text-slate-600 dark:text-slate-400" />
      </div>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Recent Orders</h3>
    </div>

    <!-- Filter Bar (Labels updated) -->
    <div class="flex flex-wrap gap-2 mb-8">
      {#each filterOptions as filter}
        <button
          onclick={() => handleFilterChange(filter.value)}
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            {selectedFilter === filter.value
              ? 'bg-orange-500 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }"
        >
          {filter.label} <!-- Uses new labels like "Last 30 Days" -->
        </button>
      {/each}
    </div>

    {#if loading}
      <div class="flex justify-center items-center py-20">
        <Spinner size="12" color="red" />
      </div>
    {:else if error}
      <Alert color="red" dismissable>
         {error}
      </Alert>
    {:else if allOrders.length === 0}
      <!-- No orders ever -->
      <div class="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Orders Found</h3>
        <p class="text-gray-500 dark:text-gray-400">
          You have no order history yet.
        </p>
      </div>
    {:else if filteredOrders.length === 0}
      <!-- Orders exist, but none match filter -->
      <div class="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Orders Found</h3>
        <p class="text-gray-500 dark:text-gray-400">
          No orders match the selected filter. Try a different date range.
        </p>
      </div>
    {:else}
      <!-- Order List (loops 'filteredOrders') -->
      <!-- <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"> -->
      <div class="bg-white {cardDarkBg} rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        <!-- Table Header (desktop) -->
        <div class="hidden md:grid md:grid-cols-6 gap-4 items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 {cardDarkBg} ">
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Order ID</span>
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Customer</span>
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</span>
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</span>
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">Total</span>
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">Details</span>
        </div>
        
        <!-- Order Loop -->
        {#each filteredOrders as order (order.id)}
          <div class="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <!-- Clickable Row -->
            <button
              onclick={() => toggleOrder(order.id)}
              class="w-full px-6 py-5 text-left transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div class="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                
                <!-- Order ID -->
                <div class="md:col-span-1">
                  <span class="md:hidden text-xs font-semibold text-gray-500 uppercase">Order ID</span>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mt-1 md:mt-0">
                    #{order.id}
                  </h4>
                </div>
                
                <!-- Customer -->
                <div class="md:col-span-1">
                  <span class="md:hidden text-xs font-semibold text-gray-500 uppercase">Customer</span>
                  <span class="block text-sm text-gray-700 dark:text-gray-300 mt-1 md:mt-0">
                    {order.user.username}
                  </span>
                </div>
                
                <!-- Date -->
                <div class="md:col-span-1">
                  <span class="md:hidden text-xs font-semibold text-gray-500 uppercase">Date</span>
                  <span class="block text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-0">
                    {formatDate(order.order_date)}
                  </span>
                </div>

                <!-- Status -->
                <div class="md:col-span-1">
                  <span class="md:hidden text-xs font-semibold text-gray-500 uppercase">Status</span>
                  <div class="mt-1 md:mt-0">
                    <Badge color={statusStyles[order.status]?.color || 'gray'} class="text-xs">
                      {statusStyles[order.status]?.text || order.status}
                    </Badge>
                  </div>
                </div>

                <!-- Total -->
                <div class="md:col-span-1 text-left md:text-right">
                  <span class="md:hidden text-xs font-semibold text-gray-500 uppercase">Total</span>
                  <span class="block text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 md:mt-0">
                    ₹{order.total_price.toFixed(2)}
                  </span>
                </div>
                
                <!-- Chevron Icon -->
                <div class="md:col-span-1 flex justify-end items-center">
                  <ChevronDownOutline 
                    class="w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-300 {expandedOrderId === order.id ? 'transform rotate-180' : ''}" 
                  />
                </div>
              </div>
            </button>
            
            <!-- Expandable Item List -->
            {#if expandedOrderId === order.id}
            <!-- <div class="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"> -->
              <div class="p-6 bg-gray-100 {labelDarkBg} border-t border-gray-200 dark:border-gray-700">
                <h5 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Items Ordered</h5>
                <div class="space-y-3">
                  {#each order.order_items as item (item.id)}
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center font-bold text-gray-600 dark:text-gray-400">
                        {item.quantity}x
                      </div>
                      <div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.cuisine.cuisine_name}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 capitalize block">
                          ({item.size})
                        </span>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>