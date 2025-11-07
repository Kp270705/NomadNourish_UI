<script>
  import { onMount } from 'svelte';
  import { params, pop } from 'svelte-spa-router';
  import { Spinner, Button } from 'flowbite-svelte';
  import { ArrowLeftOutline } from 'flowbite-svelte-icons';
  import routesType from '../../config/backend_routes.js';
  import RestaurantCard from '../../components/Card/C_RestaurantCard.svelte';
  import { user } from '../../stores/authStore.js';

  let restaurants = [];
  let loading = true;
  let title = "Results";

  $: if ($params && $params.type && $params.query) {
    const { type, query } = $params;
    restaurants = [];
    loading = true;

    if (type === 'dish') {
      title = `Restaurants serving "${decodeURIComponent(query)}"`;
      fetchByDish(decodeURIComponent(query));
    } else if (type === 'restaurant') {
      title = `Showing restaurant result`;
      fetchByRestaurantId(query);
    }
  }

  // --- FETCHING LOGIC ---

  // Fetches a LIST of restaurants
  async function fetchByDish(dishQuery) {
    try {
      const response = await fetch(`${routesType.current_route}/search/results?query=${encodeURIComponent(dishQuery)}&location=${$user.current_location}`);
      if (!response.ok) throw new Error("Failed to fetch results");
      restaurants = await response.json();
    } catch (err) {
      console.error(err);
      restaurants = [];
    } finally {
      loading = false;
    }
  }

  // Fetches a SINGLE restaurant
  async function fetchByRestaurantId(restId) {
    try {
      const response = await fetch(`${routesType.current_route}/restaurant/get_by_id/${restId}`);
      if (!response.ok) throw new Error("Failed to fetch restaurant");
      const singleRestaurant = await response.json();
      restaurants = [singleRestaurant]; // Put the single object into a list
    } catch (err) {
      console.error(err);
      restaurants = [];
    } finally {
      loading = false;
    }
  }

</script>

<div class="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
  <div class="flex items-center gap-2 mb-6">
    <Button color="light" class="!p-2" onclick={() => pop()}><ArrowLeftOutline class="w-6 h-6 dark:text-white" /></Button>
    <h1 class="text-2xl font-bold dark:text-white">{title}</h1>
  </div>
  
  {#if loading}
    <div class="text-center py-10 "><Spinner size="8" /></div>
  {:else if restaurants.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ">
      {#each restaurants as restaurant (restaurant.id)}
        <div class="justify-self-center lg:justify-self-center " >
          <RestaurantCard {restaurant} />
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-center text-lg dark:text-gray-300">No results found.</p>
  {/if}
</div>