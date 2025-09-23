<script lang="ts">
  import { Section } from "flowbite-svelte-blocks";
  import { Label, Input, Button, Card, Spinner } from "flowbite-svelte";
  import { push } from "svelte-spa-router";
  import { onMount } from 'svelte';
  
  import routesType from "../../config/backend_routes";
  import { get } from 'svelte/store';
  import { isAuthorized } from '../../stores/authStore.js';


  let newCuisine = { cuisine_name: '', cuisine_price: 0 };
  let cuisines = [];
  let loading = false;
  let error = null;
  let isSubmitting = false;

  async function fetchMyCuisines() {
    loading = true;
    error = null;
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`${routesType.current_route}/cuisine/my-cuisines`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cuisines.');
      }
      cuisines = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    isSubmitting = true;
    const token = localStorage.getItem("jwt_token");
    
    try {
      const response = await fetch(`${routesType.current_route}/cuisine/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCuisine),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to register cuisine');
      }
      
      const addedCuisine = await response.json();
      cuisines = [...cuisines, addedCuisine]; // Update the list
      newCuisine = { cuisine_name: '', cuisine_price: 0 }; // Clear form

    } catch (err) {
      error = err.message;
      alert(`Error: ${error}`);
    } finally {
      isSubmitting = false;
    }
  };

  onMount(() => {
    if (get(isAuthorized)) {
      fetchMyCuisines();
    }
  });

</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card class="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🍕</div>
          <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white">Add a new cuisine</h2>
          <p class="mt-2 text-gray-500 dark:text-gray-400">Fill in the details for your new dish.</p>
        </div>
        <form onsubmit={handleSubmit} class="space-y-6">
          <div>
            <Label for="cuisine_name" class="mb-2 text-gray-700 dark:text-gray-300">Cuisine Name</Label>
            <Input type="text" name="cuisine_name" id="cuisine_name" bind:value={newCuisine.cuisine_name} placeholder="e.g., Spicy Pizza" required />
          </div>
          <div>
            <Label for="cuisine_price" class="mb-2 text-gray-700 dark:text-gray-300">Price (₹)</Label>
            <Input type="number" name="cuisine_price" id="cuisine_price" bind:value={newCuisine.cuisine_price} placeholder="e.g., 250" step="0.01" required />
          </div>
          <Button type="submit" class="w-full h-12 text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600" disabled={isSubmitting}>
            {#if isSubmitting}
              Adding...
            {:else}
              Add Cuisine
            {/if}
          </Button>
        </form>
      </Card>
      
      <Card class="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your Menu
        </h2>
        {#if loading}
          <div class="text-center">
            <Spinner size="8" color="red" />
          </div>
        {:else if cuisines.length > 0}
          <ul class="space-y-3">
            {#each cuisines as cuisine (cuisine.id)}
              <li class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span class="font-medium text-gray-900 dark:text-white">{cuisine.cuisine_name}</span>
                <span class="text-gray-600 dark:text-gray-300">₹{cuisine.cuisine_price.toFixed(2)}</span>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-gray-500 dark:text-gray-400">You have no cuisines added yet.</p>
        {/if}
      </Card>
    </div>
  </div>
</div>