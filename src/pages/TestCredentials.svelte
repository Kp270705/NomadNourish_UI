<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { Card, Button } from "flowbite-svelte";
  import { UserSolid, StoreSolid, ArrowLeftOutline } from "flowbite-svelte-icons";

  // Test data for the page
  const testUsers = [
    { email: "sd@sd.com.com", password: "sd" },
    { email: "shreya@example.com", password: "spass1" }
  ];

  const testRestaurants = [
    { name: "1qa5", password: "qa" },
    { name: "1qa2", password: "hpass1" }
  ];
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center mb-8 gap-4">
      <Button onclick={() => push('/')} class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
        <ArrowLeftOutline class="w-5 h-5 mr-2" /> Back
      </Button>
      <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white">Test Credentials</h1>
    </div>

    <p class="text-gray-600 dark:text-gray-400 text-lg mb-8">
      Use the following credentials to quickly test the application without needing to register.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Customer Credentials Card -->
      <Card class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-4 mb-4">
          <UserSolid class="w-8 h-8 text-blue-500" />
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Customers</h2>
        </div>
        <div class="space-y-4">
          {#each testUsers as user}
            <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p class="font-medium text-gray-700 dark:text-gray-300">Email: <span class="font-normal">{user.email}</span></p>
              <p class="font-medium text-gray-700 dark:text-gray-300">Password: <span class="font-normal">{user.password}</span></p>
            </div>
          {/each}
        </div>
      </Card>

      <!-- Restaurant Credentials Card -->
      <Card class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-4 mb-4">
          <StoreSolid class="w-8 h-8 text-green-500" />
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Restaurants</h2>
        </div>
        <div class="space-y-4">
          {#each testRestaurants as restaurant}
            <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p class="font-medium text-gray-700 dark:text-gray-300">Name: <span class="font-normal">{restaurant.name}</span></p>
              <p class="font-medium text-gray-700 dark:text-gray-300">Password: <span class="font-normal">{restaurant.password}</span></p>
            </div>
          {/each}
        </div>
      </Card>
    </div>
  </div>
</div>