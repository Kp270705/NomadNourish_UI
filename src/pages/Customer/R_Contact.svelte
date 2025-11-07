<script>
  import { onMount } from 'svelte';
  import { params } from 'svelte-spa-router';
  import { Card, Spinner, Button } from 'flowbite-svelte';
  import { MapPinOutline, PhoneOutline, EnvelopeOutline, ArrowLeftOutline } from 'flowbite-svelte-icons';
  import routesType from '../../config/backend_routes.js';
  import { push } from 'svelte-spa-router';
  import food from "../../assets/icons/food1.png";

  let restaurant = null;
  let loading = true;
  let error = null;
  let restaurantId = null;

  $: {
    if ($params && $params.id) {
      const currentId = $params.id;
      if (currentId !== restaurantId) {
        restaurantId = currentId;
        fetchRestaurantDetails(restaurantId);
      }
    } else {
      error = "Restaurant ID not found in URL.";
      loading = false;
      restaurant = null;
      restaurantId = null;
    }
  }

  async function fetchRestaurantDetails(id) {
    loading = true;
    error = null;
    restaurant = null;
    try {
      const response = await fetch(`${routesType.current_route}/restaurant/get_by_id/${id}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to fetch restaurant details.');
      }
      restaurant = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function goBack() {
    window.history.back();
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto">
    <Button color="alternative" onclick={goBack} class="mb-6">
      <ArrowLeftOutline class="w-4 h-4 mr-2"/> Back to Restaurants
    </Button>

    {#if loading}
      <Card class="shadow-lg">
        <div class="text-center py-16"><Spinner size="10" /></div>
      </Card>
    {:else if error}
      <Card class="shadow-lg">
        <div class="text-center py-12">
          <p class="text-red-600 dark:text-red-400 text-lg">{error}</p>
        </div>
      </Card>
    {:else if restaurant}
      <!-- Restaurant Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div class="flex items-center gap-4">
          <img src={food} alt={restaurant.name} class="w-20 h-20 rounded-lg object-cover shadow-md"/>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{restaurant.name}</h1>
            <div class="flex items-center text-gray-600 dark:text-gray-300">
              <MapPinOutline class="w-4 h-4 mr-2"/>
              <span>{restaurant.location}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h2>
        
        <div class="space-y-4">
          <!-- Phone -->
          <a href="tel:{restaurant.mobile_number}" 
             class="flex items-center p-5 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 group">
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-500 transition-colors duration-200">
              <PhoneOutline class="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white"/>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{restaurant.mobile_number}</p>
            </div>
          </a>

          <!-- Email -->
          <a href="mailto:{restaurant.support_email}" 
             class="flex items-center p-5 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition-all duration-200 group">
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 group-hover:bg-red-500 transition-colors duration-200">
              <EnvelopeOutline class="w-6 h-6 text-red-600 dark:text-red-400 group-hover:text-white"/>
            </div>
            <div class="ml-4 overflow-hidden">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Support Email</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white truncate">{restaurant.support_email}</p>
            </div>
          </a>
        </div>
      </div>
    {:else}
      <Card class="shadow-lg">
        <div class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">Restaurant details could not be loaded.</p>
        </div>
      </Card>
    {/if}
  </div>
</div>