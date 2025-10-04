<script>
  import { onMount } from 'svelte';
  import { push, link } from 'svelte-spa-router';
  import { Card, Button, Progressbar} from "flowbite-svelte";
  import { PizzaSliceSolid, FileChartBarOutline, ChartMixedDollarSolid, StarSolid, UserSolid, ClockOutline, FireOutline, FileChartBarSolid, UserSettingsSolid, PenSolid, CartSolid, RocketSolid } from "flowbite-svelte-icons";
  import { restaurant } from "../../stores/authStore";

  // State variables
  $: restaurantName = $restaurant.name;
  
  // Static/Mock Data for UI Design (In a real app, this would be fetched from the backend)
  const dashboardData = {
    // Top Row KPIs
    metrics: [
      { id: 1, title: "Today's Orders", value: 127, change: 12, icon: CartSolid, color: "blue" },
      { id: 2, title: "Revenue", value: 2847, change: 5, icon: ChartMixedDollarSolid, color: "green" },
      { id: 3, title: "Avg Rating", value: 4.7, change: -2, icon: StarSolid, color: "yellow" },
      { id: 4, title: "Active Customers", value: 89, change: -3, icon: UserSolid, color: "purple" },
    ],
    // Performance items
    topItems: [
      { name: "Margherita Pizza", percent: 85, },
      { name: "Caesar Salad", percent: 72, },
      { name: "Chicken Wings", percent: 64, },
    ],
    // Recent activity feed
    recentActivity: [
      { id: 1, type: "order", text: "New order #1247", time: "2 minutes ago" },
      { id: 2, type: "menu", text: "Menu updated", time: "15 minutes ago" },
      { id: 3, type: "review", text: "5-star review received", time: "1 hour ago" },
      { id: 4, type: "login", text: "Staff member logged in", time: "2 hours ago" },
    ]
  };

  // Helper component for the KPI cards
  function getMetricColor(color) {
    switch (color) {
      case 'blue': return 'text-blue-500 dark:text-blue-400 bg-blue-500/10';
      case 'green': return 'text-green-500 dark:text-green-400 bg-green-500/10';
      case 'yellow': return 'text-yellow-500 dark:text-yellow-400 bg-yellow-500/10';
      case 'purple': return 'text-purple-500 dark:text-purple-400 bg-purple-500/10';
      default: return 'text-gray-500';
    }
  }

  // Utility to format currency/value
  function formatValue(title, value) {
    if (title === 'Revenue') return `${value.toLocaleString()}`;
    if (title === 'Avg Rating') return value.toFixed(1);
    return value;
  }
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <header class="mb-10">
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
        Welcome back, <span class="text-red-600 dark:text-red-400">{restaurantName}</span>!
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mt-2">
        Here's what's happening with your restaurant today.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      {#each dashboardData.metrics as metric (metric.id)}
        <Card class="p-4 rounded-xl shadow-lg dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-semibold text-gray-600 dark:text-gray-300">{metric.title}</p>
              <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">
                {#if metric.title === 'Revenue'}<span class="text-green-500">$</span>{/if}{formatValue(metric.title, metric.value)}
              </h2>
            </div>
            <div class="{getMetricColor(metric.color)} p-3 rounded-xl">
              <svelte:component this={metric.icon} class="w-8 h-8" />
            </div>
          </div>
          <div class="flex items-center mt-3">
            <span class="{metric.change > 0 ? 'text-green-500' : 'text-red-500'} font-bold text-sm mr-1">
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </span>
            <span class="text-gray-500 dark:text-gray-400 text-sm">vs last week</span>
          </div>
        </Card>
      {/each}

      <div class="lg:col-span-2 space-y-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
        <p class="text-gray-600 dark:text-gray-400 -mt-2 mb-3">Manage your restaurant efficiently</p>
        
        <div class="grid grid-cols-2 gap-4">
          <a use:link href="/RCreateCuisine" class="w-full">
            <Button class="w-full h-24 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-2xl text-xl shadow-lg">
              Add New Cuisine
            </Button>
          </a>
          <a use:link href="/ROrderHistory" class="w-full">
            <Button class="w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-2xl text-xl shadow-lg">
              View Analytics
            </Button>
          </a>
          <a use:link href="/REditDetails" class="w-full">
            <Button class="w-full h-24 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold rounded-2xl text-xl shadow-lg">
              Edit Details
            </Button>
          </a>
          <a use:link href="/RManageCuisine" class="w-full">
            <Button class="w-full h-24 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold rounded-2xl text-xl shadow-lg">
              Edit Menu Prices
            </Button>
          </a>
        </div>
      </div>

      <Card class="lg:col-span-2 p-6 rounded-xl shadow-lg dark:bg-gray-800 space-y-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Restaurant Status</h3>
        <div class="space-y-3 text-gray-600 dark:text-gray-300">
          {#each [
            { label: 'Operating Hours', status: 'Open', color: 'green' },
            { label: 'Kitchen Status', status: 'Busy', color: 'yellow' },
            { label: 'Delivery', status: 'Active', color: 'blue' },
            { label: 'Staff Online', status: '8/12', color: 'gray' }
          ] as statusItem}
            <div class="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
              <span>{statusItem.label}</span>
              <span class="font-semibold text-sm px-3 py-1 rounded-full {statusItem.color === 'green' ? 'bg-green-100 text-green-700' : statusItem.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' : statusItem.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 dark:text-gray-300'}">
                {statusItem.status}
              </span>
            </div>
          {/each}
        </div>
      </Card>

      <Card class="lg:col-span-2 p-6 rounded-xl shadow-lg dark:bg-gray-800 space-y-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Top Performing Items</h3>
        <p class="text-gray-600 dark:text-gray-400 -mt-2 mb-4">Your most popular dishes this week</p>

        <div class="space-y-4">
          {#each dashboardData.topItems as item (item.name)}
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-gray-800 dark:text-gray-200">{item.name}</span>
                <span class="font-bold text-sm text-gray-900 dark:text-white">{item.percent}%</span>
              </div>
              <RocketSolid class="shrink-0 h-6 w-6" />
               <Progressbar progress={item.percent} color="green" />

            </div>
          {/each}
        </div>
      </Card>

      <div class="lg:col-span-2 space-y-6">
        <Card class="p-6 rounded-xl shadow-lg dark:bg-gray-800">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div class="space-y-3">
            {#each dashboardData.recentActivity as activity (activity.id)}
              <div class="flex items-start gap-3 border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0">
                <div class="w-2 h-2 mt-2 rounded-full {activity.type === 'order' ? 'bg-red-500' : activity.type === 'review' ? 'bg-yellow-500' : 'bg-gray-400'}"></div>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200">{activity.text}</p>
                  <p class="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            {/each}
          </div>
        </Card>
        
        <Card class="p-6 rounded-xl shadow-lg bg-indigo-600 dark:bg-indigo-900 text-white">
          <h3 class="text-xl font-bold mb-2">This Month</h3>
          <div class="text-4xl font-extrabold">$45,210</div>
          <p class="text-sm opacity-80 mt-1">+18% from last month</p>
        </Card>
      </div>
      
    </div>
  </div>
</div>