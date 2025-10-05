<script lang="ts">
  import { Card, Button } from "flowbite-svelte";
  import { link } from "svelte-spa-router";
  import { Settings } from 'lucide-svelte';

  import {
    ShoppingBagSolid,
    PizzaSliceSolid,
    FileChartBarSolid,
    CogSolid,
    PenSolid
  } from "flowbite-svelte-icons";

  // Svelte 5 runes for state/derivations
  let restaurantName = "Rudra";

  // Quick actions (matching React structure, using Flowbite-Svelte Buttons)
  const quickActions = [
    {
      id: 1,
      label: "Add New Cuisine",
      href: "/RCreateCuisine",
      classes:
        "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 dark:bg-gradient-to-r dark:from-orange-500 dark:to-red-600 dark:hover:from-orange-600 dark:hover:to-red-700"
    },
    {
      id: 2,
      label: "View Analytics",
      href: "/ROrderHistory",
      classes:
        " bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:bg-gradient-to-r dark:from-blue-500 dark:to-indigo-600 dark:hover:from-blue-600 dark:hover:to-indigo-700"
    },
    {
      id: 3,
      label: "Edit Details",
      href: "/REditDetails",
      classes: "bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 "
    },
    {
      id: 4,
      label: "Edit Menu Price",
      href: "/RManageCuisine",
      classes: "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
    },
    {
      id: 5,
      label: "Edit Status",
      href: "/RStatus",
      // spans two columns on small screens to mirror React’s layout nuance
      classes:
        "bg-pink-500 hover:bg-pink-600 dark:bg-pink-500 dark:hover:bg-pink-600"
    }
  ];

  // Top performing items list
  const topItems = [
    { name: "Margherita Pizza", percentage: 85, icon: "🍕", bar: "bg-orange-500" },
    { name: "Caesar Salad", percentage: 72, icon: "🥗", bar: "bg-blue-500" },
    { name: "Chicken Wings", percentage: 64, icon: "🍗", bar: "bg-green-500" }
  ];

  function widthStyle(p: number) {
    return `width: ${p}%;`;
  }
  
</script>


<div class="min-h-screen dark:bg-[#0f1729] dark:text-white p-6 lg:p-8">
  <div class="max-w-7xl mx-auto">

    <!-- Intro Heading: -->
    <div class="mb-8 animate-fade-in ">
      <h1 class="text-4xl md:text-5xl font-extrabold">
        Welcome back, <span class=" text-red-500 dark:text-orange-500">{restaurantName}</span>!
      </h1>
      <p class="text-slate-400 mt-2">
        Here's what's happening with your restaurant today.
      </p>
    </div>

    <!-- Main Content:  -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-10 md:gap-6 lg:grid-cols-12 lg:gap-10">

      <!-- Left Side: -->

      <div class="space-y-6 md:col-span-6 lg:col-span-7">
        <Card class="w-full max-w-none dark:bg-[#172135] border-2 rounded-xl shadow-xl">
          <div class="p-6">
            <h3 class="text-xl font-bold mb-1 flex items-center gap-5 "> <Settings color="#d6f43e" /> Quick Actions </h3>
            <p class="text-sm dark:text-slate-400 mb-5">Manage your restaurant efficiently</p>

            <div class="grid grid-cols-2 gap-4">
              {#each quickActions as action, index}
                <a use:link href={action.href} class={`w-full ${action.classes}`}>

                  <Button class="w-full h-14 dark:text-white font-semibold text-base shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] {action.classes} ">
                    
                    {#if action.id === 1}
                      <PizzaSliceSolid class="w-5 h-5 mr-2" />
                    {:else if action.id === 2}
                      <FileChartBarSolid class="w-5 h-5 mr-2" />
                    {:else if action.id === 3}
                      <CogSolid class="w-5 h-5 mr-2" />
                    {:else if action.id === 4}
                      <PenSolid class="w-5 h-5 mr-2" />
                    {/if}
                    {action.label}
                  </Button>
                </a>
              {/each}
            </div>
          </div>
        </Card>

        <Card class="w-full max-w-none dark:bg-[#172135] border-2 rounded-xl shadow-xl">
          <div class="p-6 space-y-6">
            <div>
              <h3 class="text-xl font-bold">Top Performing Items</h3>
              <p class="text-sm text-slate-400">Your most popular dishes this week</p>
            </div>

            {#each topItems as item, index}
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">{item.icon}</span>
                    <span class="font-medium">{item.name}</span>
                  </div>
                  <span class="font-bold">{item.percentage}%</span>
                </div>
                <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div class={`h-2 ${item.bar}`} style={widthStyle(item.percentage)}></div>
                </div>
              </div>
            {/each}
          </div>
        </Card>
      </div>

      <!-- Right Side: -->

      <div class="space-y-6 md:col-span-4 lg:col-span-5">
        <Card class="w-full max-w-none dark:bg-[#172135] border-2 rounded-xl shadow-xl">

          <div class="p-6 space-y-4" >
            <h3 class="text-xl font-bold">Restaurant Status</h3>

            <div class="flex items-center justify-between py-3 border-b dark:border-slate-700">
              <span class="text-slate-400">Operating Hours</span>
              <span class="px-3 py-1 bg-green-600/10 dark:bg-green-500/10 text-green-400 rounded-full text-sm font-semibold">
                Open
              </span>
            </div>
            <div class="flex items-center justify-between py-3 border-b dark:border-slate-700">
              <span class="text-slate-400">Kitchen Status</span>
              <span class="px-3 py-1 bg-yellow-600/10 dark:bg-yellow-500/10 text-yellow-400 rounded-full text-sm font-semibold">
                Busy
              </span>
            </div>
            <div class="flex items-center justify-between py-3">
              <span class="text-slate-400">Delivery</span>
              <span class="px-3 py-1 bg-blue-600/10 dark:bg-blue-500/10  text-blue-400 rounded-full text-sm font-semibold">
                Active
              </span>
            </div>

            <a use:link href="/RStatus" class="block w-full">
              <Button color="light" class="w-full justify-center text-orange-400 hover:text-orange-300 bg-transparent hover:bg-transparent">
                Edit Status
              </Button>
            </a>
          </div>
        </Card>

        <Card class="w-full max-w-none dark:bg-[#172135] border-2 rounded-xl shadow-xl">
          <div class="p-6">
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <p class="text-sm dark:text-slate-400 mb-1">Today's Orders</p>
                <p class="text-4xl font-extrabold">127</p>
                <p class="text-sm text-green-600 dark:text-green-400 mt-1">+12% vs last week</p>
              </div>
            <div class="p-4 bg-blue-500/10 rounded-xl">
                <ShoppingBagSolid class="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>

  </div>
</div>

