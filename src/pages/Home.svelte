<script>
  import { onMount } from 'svelte';
  import { SearchOutline, StarSolid, MapPinOutline, FireOutline } from "flowbite-svelte-icons";
  import { Spinner } from "flowbite-svelte";
  import routesType from "../config/backend_routes.js";
  import { user, restaurant, userType } from '../stores/authStore';
  import RestaurantCard from "../components/Card/RestaurantCard.svelte";

  let allRestaurants = [];
  let loading = true;
  let error = null;
  let searchLocation = "";

  onMount(async () => {
    if ($userType === 'user') {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`${routesType.current_route}/restaurant/get_all`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }

        allRestaurants = await response.json();
      } catch (err) {
        error = err.message;
      } finally {
        loading = false;
      }
    } else {
      loading = false;
    }
  });

  $: filteredRestaurants = allRestaurants.filter(r =>
    r.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  // Stats for display
  $: totalRestaurants = allRestaurants.length;
  $: uniqueLocations = [...new Set(allRestaurants.map(r => r.location))].length;
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-500">
  
  <!-- Hero Section -->
  <div class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 dark:from-red-600/30 dark:to-orange-600/30"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-6">
          Discover Amazing Restaurants
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          "Great food is not just about taste, it's about the experience, the memories, and the stories shared around every table."
        </p>
      </div>

      <!-- Search Section -->
      <div class="max-w-2xl mx-auto mb-12">
        <div class="relative group">
          <input
            type="text"
            bind:value={searchLocation}
            placeholder="Search by location... (e.g., Mumbai, Delhi, Bangalore)"
            class="w-full h-16 rounded-2xl border-2 border-gray-200 dark:border-gray-600 px-6 pl-16 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-4 focus:ring-red-500/25 focus:border-red-500 dark:text-white transition-all duration-300 shadow-lg hover:shadow-xl group-hover:border-red-400"
          />
          <SearchOutline class="absolute left-5 top-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" size="lg" />
          <div class="absolute right-4 top-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg">
            Search
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      {#if !loading && $userType === 'user'}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Restaurants</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{totalRestaurants}</p>
              </div>
              <div class="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <FireOutline class="text-white" size="lg" />
              </div>
            </div>
          </div>
          
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Cities Available</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">{uniqueLocations}</p>
              </div>
              <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <MapPinOutline class="text-white" size="lg" />
              </div>
            </div>
          </div>
          
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">4.8</p>
              </div>
              <div class="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                <StarSolid class="text-white" size="lg" />
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
    {#if $userType === 'user'}
      {#if loading}
        <div class="flex justify-center items-center h-64">
          <div class="text-center">
            <Spinner size="12" color="red" />
            <p class="mt-4 text-gray-600 dark:text-gray-400 text-lg">Loading amazing restaurants...</p>
          </div>
        </div>
      {:else if error}
        <div class="text-center py-16">
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto">
            <p class="text-red-600 dark:text-red-400 text-lg font-medium">Oops! Something went wrong</p>
            <p class="text-red-500 dark:text-red-300 mt-2">{error}</p>
          </div>
        </div>
      {:else if filteredRestaurants.length > 0}
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              {searchLocation ? `Restaurants in "${searchLocation}"` : 'All Restaurants'}
            </h2>
            <span class="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              {filteredRestaurants.length} found
            </span>
          </div>
          
          <!-- Fancy Quote -->
          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-12 border border-indigo-100 dark:border-indigo-800">
            <blockquote class="text-center">
              <p class="text-2xl md:text-3xl font-light text-gray-800 dark:text-gray-200 italic leading-relaxed">
                "Food is our common ground, a universal experience that brings people together."
              </p>
              <footer class="mt-4 text-gray-600 dark:text-gray-400 font-medium">
                — James Beard
              </footer>
            </blockquote>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {#each filteredRestaurants as restaurant, index (restaurant.id)}
            <div class="transform hover:scale-105 transition-all duration-300" style="animation-delay: {index * 100}ms">
              <RestaurantCard {restaurant} />
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-16">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="text-6xl mb-6">🔍</div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">No restaurants found</h3>
            <p class="text-gray-600 dark:text-gray-400 text-lg">
              We couldn't find any restaurants in "{searchLocation}". Try searching for a different location!
            </p>
          </div>
        </div>
      {/if}
    {:else}
      <div class="text-center py-16">
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
          <div class="text-6xl mb-6">👋</div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to FlowBite!</h3>
          <p class="text-gray-600 dark:text-gray-400 text-lg">
            You're logged in as a restaurant owner. Visit your dashboard to manage your restaurant details.
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .grid > div {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
  }
</style>