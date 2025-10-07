<script lang="ts">
  import { Card, Button, Spinner } from "flowbite-svelte";
  import { link } from "svelte-spa-router";
  import { Settings, ChartNoAxesCombined, Rss, BaggageClaim } from 'lucide-svelte';
  import { isAuthorized } from "../../stores/authStore";
  import routesType from "../../config/backend_routes";

  import {
    ShoppingBagSolid,
    PizzaSliceSolid,
    FileChartBarSolid,
    CogSolid,
    PenSolid,
    CalendarEditSolid,
  } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  import { restaurant } from "../../stores/authStore";
  import Skeleton1 from "../../components/skeleton/Skeleton1.svelte";

  let loading = true;
  let error = null;
  let isUpdating = false;

  let restaurant_info = {
    id: null,
    name: '',
    location: '',
    mobile_number: '',
    support_email: '',
    image_url: '',
    operating_status:'',
    kitchen_status:'',
    delivery_status:'',
  };
  // Quick actions (matching React structure, using Flowbite-Svelte Buttons)
  const quickActions = [
    {
      id: 1,
      label: "Add Cuisine",
      href: "/RCreateCuisine",
      classes:
        "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
    },
    {
      id: 2,
      label: "View Analytics",
      href: "/ROrderHistory",
      classes:
        " bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 "
    },
    {
      id: 3,
      label: "Edit Details",
      href: "/REditDetails",
      classes: "bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 "
    },
    {
      id: 4,
      label: "Manage Cuisine",
      href: "/RManageCuisine",
      classes: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
    },
    {
      id: 5,
      label: "Edit Status",
      href: "/RStatus",
      // spans two columns on small screens to mirror React’s layout nuance
      classes:
        "bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
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

  async function fetchRestaurantDetails() {
    loading = true;
    error = null;
    try {
      const token = localStorage.getItem('jwt_token');
      const res = await fetch(`${routesType.current_route}/restaurant/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch restaurant details.');
      }
      const data = await res.json();
      restaurant_info = {
        id: data.id,
        name: data.name || '',
        location: data.location || '',
        mobile_number: data.mobile_number || '',
        support_email: data.support_email || '',
        image_url: data.image_url || '',
        operating_status: data.operating_status || '',
        kitchen_status: data.kitchen_status || '',
        delivery_status: data.delivery_status || '',
      };
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
  onMount(fetchRestaurantDetails)

  function toggleDesign(info){
    if(info === "open" || info === "active" ){
      console.log(`\n\n in if...`)
      return "bg-green-600/10 dark:bg-green-500/10 text-green-400"
    }
    else{
      return "bg-red-600/10 dark:bg-red-500/10 text-red-400"
    }
  }
  
  $:os_des = toggleDesign(restaurant_info.operating_status?.toLowerCase())

  $:traffic_design = (() => {
    if (restaurant_info.operating_status?.toLowerCase() === "open" ){
      if(restaurant_info.kitchen_status?.toLowerCase() === "normal"){
        return "bg-orange-500 text-white";
      }
      else if(restaurant_info.kitchen_status?.toLowerCase() == "busy"){
        return "bg-yellow-500 text-white";
      }
      else if (restaurant_info.kitchen_status?.toLowerCase() === "emergency" ){
        return "bg-red-600 text-white";
      }
    }
    else{
      return "bg-gray-400 text-black";
    }
  })();

  $:ds_des = toggleDesign(restaurant_info.delivery_status?.toLocaleLowerCase())

</script>



<div class="min-h-screen dark:bg-[#0a101d] dark:text-white p-6 lg:p-8" >
  <div class="max-w-7xl mx-auto" >

    <!-- Intro Heading: -->
    <div class="mb-8 animate-fade-in ">
      {#if $isAuthorized}
        <h1 class="text-4xl md:text-5xl font-extrabold">
          Welcome to Home <span class=" text-red-500 dark:text-orange-500">{restaurant_info.name}</span>
        </h1>
      {:else}
        <h1 class="text-4xl md:text-5xl font-extrabold">
          Please Login :|
        </h1>
      {/if}
      <p class="text-slate-500 mt-2">
        Here's what's happening with your restaurant today.
      </p>
    </div>

    {#if !($isAuthorized)}
      
      <!-- skeleton for home  -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-10 md:gap-6 lg:grid-cols-12 lg:gap-10" >
        <!-- Left Col -->
        <div class="space-y-6 md:col-span-5 lg:col-span-8">
          <!-- top  -->
          <div role="status" class="w-full max-w-none bg-gray-50 rounded-lg animate-pulse dark:bg-gray-900">
            <div class="p-6">
              <div class="grid grid-cols-2 gap-4">
                {#each quickActions as action}
                  <div role="status" class="flex items-center justify-center h-20 max-w-sm bg-[#f1f1f2] rounded-lg animate-pulse dark:bg-[#0a101c]"> 
                  </div>
                {/each}
              </div>
            </div>
          </div>
          <!-- down  -->
          <div role="status" class="w-full max-w-none bg-gray-50 rounded-lg animate-pulse dark:bg-gray-900">
            <div class="p-6 space-y-6">
              <div class="grid grid-cols-1 gap-4">
                {#each topItems as item}
                <div class="space-y-2">
                  <div role="status" class=" w-[100%] h-20 bg-[#f1f1f2] rounded-lg animate-pulse dark:bg-[#0a101c]">
                  </div>
                </div>
                {/each}
              </div>
            </div>
          </div>

        </div>

        <!-- Right Col  -->
        <div class="space-y-6 md:col-span-5 lg:col-span-4">
          <!-- top  -->
          <div role="status" class="w-full max-w-none bg-gray-50 rounded-lg animate-pulse dark:bg-gray-900">
            <div class="p-6 space-y-6">
              <div class="grid grid-cols-1 gap-4">
                {#each topItems as item}
                <div class="space-y-2">
                  <div role="status" class=" w-[100%] h-20 bg-[#f1f1f2] rounded-lg animate-pulse dark:bg-[#0a101c]">
                  </div>
                </div>
                {/each}
              </div>
            </div>
          </div>

          <!-- bottom  -->
            <div role="status" class="w-full max-w-none bg-gray-50 rounded-lg animate-pulse dark:bg-gray-900">
              <div class="p-6 space-y-6">
                <div class="grid grid-cols-1 gap-4">
                  <div class="space-y-2">
                    <div role="status" class=" w-[100%] h-20 bg-[#f1f1f2] rounded-lg animate-pulse dark:bg-[#0a101c]">
                    </div>
                  </div>
                </div>
              </div>
          </div>

        </div>
      </div>

    {:else} 

    <!-- Main Content:  -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-10 md:gap-6 lg:grid-cols-12 lg:gap-6" >

      <!-- Left Side: -->

      <div class="space-y-6 md:col-span-5 lg:col-span-8" >
        <Card class="w-full max-w-none bg-gray-100 dark:bg-[#172135] rounded-3xl shadow-xl" >
          <div class="p-6">
            <h3 class="text-xl font-bold mb-1 flex items-center gap-5 "> <Settings size={50} color="#454644" strokeWidth={2} /> Quick Actions </h3>
            <p class="text-sm dark:text-slate-400 mb-5">Manage your restaurant efficiently</p>

            <div class="grid grid-cols-2 gap-4">
              {#each quickActions as action, index}
                <a use:link href={action.href} class="w-full {action.classes} rounded-3xl ">

                  <Button class="w-full h-14 dark:text-white font-semibold text-base shadow-md transition-all duration-200 hover:shadow-lg {action.classes} ">
                    
                    {#if action.id === 1}
                      <PizzaSliceSolid class="w-5 h-5 mr-2" />
                    {:else if action.id === 2}
                      <FileChartBarSolid class="w-5 h-5 mr-2" />
                    {:else if action.id === 3}
                      <CogSolid class="w-5 h-5 mr-2" />
                    {:else if action.id === 4}
                      <PenSolid class="w-5 h-5 mr-2" />
                    {:else if action.id === 5}
                    <CalendarEditSolid class=" h-5 w-5 mr-2 " />
                    {/if}
                    {action.label}
                  </Button>
                </a>
              {/each}
            </div>
          </div>
        </Card>

        <Card class="w-full max-w-none bg-gray-100 dark:bg-[#172135] rounded-3xl shadow-xl">
          <div class="p-6 space-y-6">
            <div>
              <h3 class="text-xl font-bold flex items-center gap-5 "> <ChartNoAxesCombined size={50} color="#408d02" strokeWidth={2} /> Top Performing Items</h3>
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

      <div class="space-y-6 md:col-span-5 lg:col-span-4">
        <Card class="w-full max-w-none bg-gray-100 dark:bg-[#172135] rounded-3xl shadow-xl">

          <div class="p-6 space-y-4" >
            <h3 class="text-xl font-bold flex items-center gap-5 "> <Rss size={50} color="#79df34" strokeWidth={2} /> Restaurant Status</h3>

            <div class="flex items-center justify-between py-3 border-b-[0.5px] dark:border-slate-700">
              <span class=" text-slate-800 dark:text-slate-400">Operating Hours</span>
              <span class="px-3 py-1 {os_des} text-green-400 rounded-full text-sm font-semibold">
                {restaurant_info.operating_status}
              </span>
            </div>

            <div class="flex items-center justify-between py-3 border-b-[0.5px] dark:border-slate-700">
              <span class=" text-slate-800 dark:text-slate-400">Kitchen Status</span>
              <span class="px-3 py-1 {traffic_design} rounded-full text-sm font-semibold">
                {#if restaurant_info.operating_status === "Open" }
                  Traffic: {restaurant_info.kitchen_status}
                  {:else}
                  Hotel Closed
                {/if}
              </span>
            </div>

            <div class="flex items-center justify-between py-3">
              <span class=" text-slate-800 dark:text-slate-400">Delivery</span>
              <span class="px-3 py-1 {ds_des} rounded-full text-sm font-semibold">
                {restaurant_info.delivery_status}
              </span>
            </div>

            <a use:link href="/RStatus" class=" flex items-center justify-center text-xs text-orange-500 font-bold ">
              Edit Status
            </a>
          </div>
        </Card>

        <Card class="w-full max-w-none bg-gray-100 dark:bg-[#172135] rounded-3xl shadow-xl">
          <div class="p-6">
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <h3 class="text-xl font-bold flex items-center gap-5 "> <BaggageClaim size={30} color="#" strokeWidth={2} /> Today's Orders</h3>
                <p class="text-4xl font-extrabold mt-2 ">127</p>
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

    {/if}
  </div>
</div>

