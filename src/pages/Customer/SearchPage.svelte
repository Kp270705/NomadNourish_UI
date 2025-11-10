<script>
  import { Spinner, Input, Button } from 'flowbite-svelte';
  import { SearchOutline, ArrowLeftOutline } from 'flowbite-svelte-icons';
  import { push, pop, link } from 'svelte-spa-router';
  import routesType from '../../config/backend_routes.js';
  import { user } from '../../stores/authStore.js';

  let searchTerm = "";
  let restaurants = [];
  let dishes = [];
  let isSearching = false;
  let debounceTimeout;

  $: {
    clearTimeout(debounceTimeout);    
    // Immediately clear results if search is too short
    if (searchTerm.length < 2) {
      restaurants = [];
      dishes = [];
      isSearching = false;
    }
    else if (searchTerm.length >= 2) {
      isSearching = true;
      debounceTimeout = setTimeout(() => {
        fetchSuggestions(searchTerm);
      }, 300); // 300ms debounce
    }
  }

async function fetchSuggestions(query) {
    try {
      let url = `${routesType.current_route}/search/suggestions?query=${encodeURIComponent(query)}`;
      if ($user && $user.current_location) {
        url += `&location=${encodeURIComponent($user.current_location)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      restaurants = data.restaurants;
      console.log(`res: ${restaurants}`)
      dishes = data.dishes;
      console.log(`dish: ${dishes}`)
      console.log(`\n\tdishes: ${dishes}`);
    } catch (err) {
      console.error(err);
      restaurants = [];
      dishes = [];
    } finally {
      isSearching = false;
    }
  }

</script>

<div class="p-4 min-h-screen bg-white dark:bg-gray-900">
  <!-- Search Bar Header -->
  <div class="flex items-center gap-2 mb-6">
    <Button color="light" class="!p-2" onclick={() => pop()}><ArrowLeftOutline class="w-6 h-6 dark:text-white" /></Button>
    <div class="relative w-full">
      <Input type="text" placeholder="Search for restaurants or dishes..." bind:value={searchTerm} class="pl-10" />
      <SearchOutline class="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
      {#if isSearching}
        <Spinner class="absolute right-3 top-2.5" size="4" />
      {/if}
    </div>
  </div>

  <!-- Results Area -->
  <div class="space-y-6">
    <!-- Restaurants Section -->
    {#if restaurants.length > 0}
      <section>
        <h3 class="font-bold text-lg mb-2 dark:text-white">Restaurants</h3>
        <ul class="flex flex-col gap-2">
          {#each restaurants as rest (rest.id)}
            <a class="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer" use:link href="/search-results/restaurant/{rest.id}" >
              <img src={rest.image_url || 'https://placehold.co/40x40/f1f1f1/c0c0c0?text=🍽️'} alt={rest.name} class="w-10 h-10 rounded-full mr-3"/>
              <span class="dark:text-white">{rest.name}</span>
            </a>
          {/each}
        </ul>
      </section>
    {/if}
    
    <!-- Dishes Section -->
    {#if dishes.length > 0}
      <section>
        <h3 class="font-bold text-lg my-2 dark:text-white">Dishes</h3>
        <ul class="flex flex-col gap-2">
          {#each dishes as dish (dish.name)}
            <a class="flex items-start p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer" use:link href="/search-results/dish/{dish.name}">
              <img src={'https://placehold.co/40x40/f1f1f1/c0c0c0?text=🍽️'} alt={dish.name} class="w-10 h-10 rounded-full mr-3"/>
              <span class="dark:text-white">{dish.name}</span>
            </a>
          {/each}
        </ul>
      </section>
    {/if}

    <!-- No results -->
    {#if !isSearching && searchTerm.length >= 2 && restaurants.length === 0 && dishes.length === 0}
      <p class="text-center text-gray-500">No results found for "{searchTerm}"</p>
    {/if}
  </div>
</div>