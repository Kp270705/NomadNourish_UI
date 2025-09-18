<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { Card, Spinner, Button, } from "flowbite-svelte";
  import { ArrowLeftOutline, ShoppingBagSolid, CalendarMonthSolid, CashSolid, FileChartBarSolid, ArrowUpRightFromSquareSolid, StarSolid } from "flowbite-svelte-icons";
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

  // Helper to format the date
  function formatNativeDate(isoDateString) {
    if (!isoDateString) return "N/A";
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat(navigator.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    }).format(date);
  }

  onMount(async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error("No authorization token found.");
      }
      const response = await fetch(`${routesType.current_route}/order/restaurant/my-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch business insights.');
      }
      const fetchedOrders = await response.json();
      orders = fetchedOrders.reverse();
      
      // Calculate insights from fetched data
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

<!-- Main Container -->
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
  <!-- Header Section -->
  <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <Button 
          onclick={() => push('/RHome')} 
          class="bg-slate-600 hover:bg-slate-700 text-white border-0 shadow-md transition-all duration-200 px-6 py-3 rounded-lg"
        >
          <ArrowLeftOutline class="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
        
        <div class="flex-1 text-center">
          <div class="flex items-center justify-center gap-3 mb-2">
            <FileChartBarSolid class="w-8 h-8 text-slate-600" />
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Business Insights
            </h1>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            Track your restaurant's performance and growth
          </p>
        </div>
        
        <div class="hidden sm:block w-32"></div>
      </div>
    </div>
  </div>

  <!-- Content Container -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if loading}
      <div class="flex flex-col justify-center items-center py-32">
        <Spinner size="12" color="orange" />
        <p class="mt-6 text-gray-600 dark:text-gray-300 text-lg">Loading your business insights...</p>
      </div>
    {:else if error}
      <div class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center max-w-md mx-auto">
        <div class="text-red-500 text-5xl mb-4">⚠️</div>
        <p class="text-red-600 dark:text-red-400 text-lg font-medium">{error}</p>
      </div>
    {:else if orders.length > 0}
      <!-- Restaurant Welcome Section -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-3 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800/50 dark:to-slate-700/50 px-8 py-4 rounded-full shadow-sm">
          <div class="text-3xl">🍽️</div>
          <div>
            <h2 class="text-xl font-bold text-slate-800 dark:text-slate-200">Welcome, {restaurantName}!</h2>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <!-- Total Orders Card -->
        <Card class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-800/50 shadow-md rounded-xl hover:shadow-lg transition-all duration-300 sm:max-w-full justify-self-center">
          <div class="p-8">
            <div class="flex items-center justify-between mb-6">
              <div class="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                <ShoppingBagSolid class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Orders</p>
                <p class="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1">{totalOrders}</p>
              </div>
            </div>
            <div class="flex items-center text-green-600 dark:text-green-400">
              <!-- <TrendingUpSolid class="w-4 h-4 mr-2" /> -->
               <ArrowUpRightFromSquareSolid class="shrink-0 h-6 w-6" />
              <span class="text-sm font-medium">Active orders</span>
            </div>
          </div>
        </Card>

        <!-- Total Revenue Card -->
        <Card class="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-100 dark:border-emerald-800/50 shadow-md rounded-xl hover:shadow-lg transition-all duration-300 sm:max-w-full justify-self-center">
          <div class="p-8">
            <div class="flex items-center justify-between mb-6">
              <div class="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-lg">
                <CashSolid class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Revenue</p>
                <p class="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div class="flex items-center text-emerald-600 dark:text-emerald-400">
              <span class="text-sm font-medium">💰 Earnings growth</span>
            </div>
          </div>
        </Card>

        <!-- Average Order Value Card -->
        <Card class="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-100 dark:border-violet-800/50 shadow-md rounded-xl hover:shadow-lg transition-all duration-300 sm:max-w-full justify-self-center">
          <div class="p-8">
            <div class="flex items-center justify-between mb-6">
              <div class="bg-violet-100 dark:bg-violet-900/50 p-3 rounded-lg">
                <StarSolid class="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Avg Order Value</p>
                <p class="text-3xl font-bold text-violet-700 dark:text-violet-300 mt-1">₹{averageOrderValue.toFixed(0)}</p>
              </div>
            </div>
            <div class="flex items-center text-violet-600 dark:text-violet-400">
              <span class="text-sm font-medium">📊 Per order average</span>
            </div>
          </div>
        </Card>
      </div>

      <!-- Orders Section -->
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
                <!-- Order Header -->
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <div class="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                      <ShoppingBagSolid class="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Order #{order.id}</h4>
                      <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✅ Completed</span>
                    </div>
                  </div>
                </div>

                <!-- Order Details -->
                <div class="space-y-4 mb-6">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Total Amount</span>
                    <span class="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹{order.total_price.toFixed(2)}</span>
                  </div>
                  
                  <div class="flex items-start justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Order Date</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white text-right">{formatNativeDate(order.order_date)}</span>
                  </div>
                </div>

                <!-- Items Section -->
                <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h5 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Items Ordered</h5>
                  <div class="space-y-2">
                    {#each order.items.split(', ') as item}
                      <div class="flex items-center gap-2">
                        <div class="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <span class="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            </Card>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Empty State -->
      <div class="text-center py-20">
        <div class="bg-gray-100 dark:bg-gray-800 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
          <ShoppingBagSolid class="w-16 h-16 text-gray-400" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Orders Yet
        </h3>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Your restaurant journey starts here! Once customers start ordering, you'll see detailed insights and analytics.
        </p>
        <div class="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl p-6 max-w-lg mx-auto">
          <div class="flex items-center justify-center gap-2 mb-3">
            <!-- <TrendingUpSolid class="w-5 h-5 text-orange-600" /> -->
             <ArrowUpRightFromSquareSolid class="shrink-0 h-6 w-6" />
            <h4 class="text-lg font-semibold text-orange-900 dark:text-orange-100">Ready to Grow?</h4>
          </div>
          <p class="text-orange-700 dark:text-orange-300">
            Ensure your menu is complete and attractive to start receiving orders from hungry customers.
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>