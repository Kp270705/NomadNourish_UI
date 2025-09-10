<!-- 


<script>
  import { onMount } from 'svelte';
  import routesType from "../config/backend_routes.js";
  import { user, restaurant, userType } from '../stores/authStore';
  import { Card, Dropdown, DropdownItem, Avatar, Button } from "flowbite-svelte";
  import { DotsHorizontalOutline, SearchOutline } from "flowbite-svelte-icons";
  import food from  "../assets/icons/food1.png";

  let allRestaurants = [];
  let loading = true;
  let error = null;
  let searchLocation = ""; // 🔎 user input

  onMount(async () => {
    if ($userType === 'user') {
      try {
        const token = localStorage.getItem('jwt_token');
        console.log("Token retrieved from localStorage:", token);
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

  // ✅ filter restaurants by location
  $: filteredRestaurants = allRestaurants.filter(r =>
    r.location.toLowerCase().includes(searchLocation.toLowerCase())
  );
</script>

<div class="min-h-screen bg-gradient-to-br from-yellow-100 via-red-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

    <div class="p-4 py-5 rounded-lg dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur">

      <div class="mb-6 flex items-center gap-2">
        <div class="relative w-full">
          <input
            type="text"
            bind:value={searchLocation}
            placeholder="Search by location..."
            class="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-red-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <SearchOutline class="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {#if $userType === 'user'}
        {#if loading}
          <p>Loading restaurants...</p>
        {:else if error}
          <p>Error: {error}</p>
        {:else if filteredRestaurants.length > 0}

        <div class="grid grid-cols-1 justify-self-center sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {#each filteredRestaurants as restaurant (restaurant.id)}

          <Card class="flex flex-col items-center justify-between rounded-xl bg-yellow-100 dark:bg-yellow-700 p-4 shadow-md hover:shadow-lg transition-shadow">

            <div class="flex justify-end w-full ">
              <DotsHorizontalOutline />
              <Dropdown class="w-30">
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Export data</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </Dropdown>
            </div>


            <div class="flex flex-col items-center pb-4 text-center">
              <Avatar size="xl" src={food} />
              <h5 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                {restaurant.name}
              </h5>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {restaurant.location}
              </span>
            </div>

            <div class="mt-4 flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Button class="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white">See cuisine</Button>
              <Button color="light" class="w-full sm:w-auto dark:text-white">Contact</Button>
            </div>
          </Card>

          {/each}
        </div>

        {:else}
          <p>No restaurants found for "{searchLocation}".</p>
        {/if}
      {:else}
        <p>Welcome! You're logged in as a restaurant or are not authorized to view this page.</p>
      {/if}
    </div>
  </div>
</div> -->
