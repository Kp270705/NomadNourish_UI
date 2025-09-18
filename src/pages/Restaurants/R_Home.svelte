<script>
  import { push, link } from 'svelte-spa-router';
  import { Card, Button } from "flowbite-svelte";
  import { PizzaSliceSolid, FileChartBarSolid } from "flowbite-svelte-icons";
  import { restaurant } from "../../stores/authStore";

  $: restaurantName = $restaurant.name;
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 py-16">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <div class="text-5xl mb-4">
        🍕
      </div>
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
        Welcome, <span class="text-red-600 dark:text-red-400">{restaurantName}</span>!
      </h1>
      <p class="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Your dashboard for managing your restaurant's presence and growth.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

      <Card class="flex flex-col items-center p-8 text-center rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div class="text-6xl text-red-500 mb-4">
          <PizzaSliceSolid />
        </div>
        <h3 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Manage Your Menu
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Add new dishes and update your restaurant's offerings.
        </p>
        <a use:link href="/RCreateCuisine" class="w-full">
          <Button class="w-full h-12 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold transition-all duration-300 rounded-xl shadow-lg">
            Create Cuisine
          </Button>
        </a>
      </Card>

      <Card class="flex flex-col items-center p-8 text-center rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div class="text-6xl text-blue-500 mb-4">
           <FileChartBarSolid />
        </div>
        <h3 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          View Business Insights
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Track your sales and understand your business's performance.
        </p>
        <a use:link href="/ROrderHistory" class="w-full">
          <Button class="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold transition-all duration-300 rounded-xl shadow-lg">
            View Analytics
          </Button>
        </a>
      </Card>

      

    </div>
  </div>
</div>