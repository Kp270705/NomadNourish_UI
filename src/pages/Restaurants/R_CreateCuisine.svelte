<script lang="ts">
  import { Label, Input, Button, Card, Spinner, Radio } from "flowbite-svelte";
  import { SearchOutline } from "flowbite-svelte-icons";
  import { push } from "svelte-spa-router";
  import { onMount } from 'svelte';
  
  import routesType from "../../config/backend_routes";
  import { get } from 'svelte/store';
  import { isAuthorized } from '../../stores/authStore.js';

  let newCuisine = { cuisine_name: '', price_half: undefined, price_full: 0, category:"" };
  let cuisines = [];
  let loading = false;
  let error = null;
  let isSubmitting = false;
  const dietaryOptions = ["Veg", "Non-Veg", "Egg"];
  let searchCuisine = "";

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
      console.log(cuisines)
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
      cuisines = [...cuisines, addedCuisine];
      newCuisine = { cuisine_name: '', price_half: undefined, price_full: 0, category:"" };

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

  $: filteredCuisines = cuisines.filter(r =>
    r.cuisine_name.toLowerCase().includes(searchCuisine.toLowerCase())
  );


</script>


<!-- outer wrapper (keep your existing outer min-h-screen etc) -->
<div class="min-h-screen bg-pink-50 dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center py-2 px-2 sm:py-[5vh] sm:pb-[10vh] sm:px-[10vw]">

  <!-- center & constrain width -->
  <div class="w-full">
    <div class="max-w-6xl mx-auto px-4 py-8">                  <!-- <-- center & constrain -->
      <!-- two equal columns; auto-rows-fr ensures equal height cells -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-fr">
        
        <!-- Left column wrapper -->
        <div class="w-full">
          <Card class="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 h-full w-full max-w-none" >

            <div class="flex flex-col items-center text-center mb-8">
              <div class="w-20 h-20 mb-4 flex items-center justify-center text-6xl">
                🍕
              </div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Add a new cuisine
              </h1>
              <p class="text-gray-500 dark:text-gray-400">
                Fill in the details for your new dish.
              </p>
            </div>

            <form onsubmit={handleSubmit} class="space-y-6">
              <div class="space-y-2">
                <Label for="cuisine_name" class="text-gray-700 dark:text-gray-300">
                  Cuisine Name
                </Label>
                <Input 
                  type="text" 
                  name="cuisine_name" 
                  id="cuisine_name" 
                  bind:value={newCuisine.cuisine_name} 
                  placeholder="e.g., Spicy Pizza" 
                  required 
                  class="bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div class="space-y-2">
                <Label for="price_half" class="text-gray-700 dark:text-gray-300">
                  Half Price (₹)
                </Label>
                <Input 
                  type="number" 
                  name="price_half" 
                  id="price_half" 
                  bind:value={newCuisine.price_half} 
                  placeholder="it can be empty" 
                  step="1"
                  class="bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div class="space-y-2">
                <Label for="price_full" class="text-gray-700 dark:text-gray-300">
                  Full Price (₹)
                </Label>
                <Input 
                  type="number" 
                  name="price_full" 
                  id="price_full" 
                  bind:value={newCuisine.price_full} 
                  placeholder="0" 
                  step="1" 
                  required 
                  class="bg-gray-100 dark:bg-gray-700"
                />
              </div>

              <div class="space-y-3">
                <Label class="text-gray-700 dark:text-gray-300">Dietary Category</Label>
                <div class="flex gap-3 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                  {#each dietaryOptions as opt}
                    <button
                      type="button"
                      onclick={() => newCuisine.category = opt}
                      class={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                        newCuisine.category === opt
                          ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                          : "bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  {/each}
                </div>
              </div>

              <Button
                type="submit"
                class="w-full h-12 text-base font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                disabled={isSubmitting}
              >
                {#if isSubmitting}
                  Adding...
                {:else}
                  Add Cuisine
                {/if}
              </Button>
            </form>
          </Card>
        </div>

        <!-- Right column wrapper -->
        <div class="w-full">
          <Card class="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 h-full w-full max-w-none" >
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Your Current Existing Menu
            </h2>
            <!-- search bar:  -->
            <div class="max-w-2xl mx-auto mb-12">
              <div class="relative group">
                <input
                  type="text"
                  bind:value={searchCuisine}
                  placeholder="Search by cuisine..."
                  class="w-full h-16 rounded-2xl border-2 border-gray-200 dark:border-gray-600 px-6 pl-16 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-4 focus:ring-red-500/25 focus:border-red-500 dark:text-white transition-all duration-300 shadow-lg hover:shadow-xl group-hover:border-red-400"
                />
                <SearchOutline class="absolute left-5 top-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" size="lg" />
                <div class="absolute right-4 top-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg">
                  Search
                </div>
              </div>
            </div>

            {#if loading}
              <div class="text-center py-8">
                <Spinner size="8" color="red" />
              </div>
              {:else}
                {#if filteredCuisines.length>0}
                  <div class="mb-8">
                    <div class="flex items-center justify-between mb-6">
                      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                        {searchCuisine ? `Cuisine in "${searchCuisine}"` : 'All Cuisine'}
                      </h2>
                      <span class="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                        {filteredCuisines.length} found
                      </span>
                    </div> 
                  </div> 
                {/if}
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-gray-200 dark:border-gray-700">
                        <th class="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Dish Name
                        </th>
                        <th class="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Half Price
                        </th>
                        <th class="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Full Price
                        </th>
                        <th class="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {#if cuisines.length === 0}
                        <tr>
                          <td colspan="4" class="text-center py-8 text-gray-500 dark:text-gray-400">
                            You have no cuisines added yet.
                          </td>
                        </tr>
                      {:else}
                        {#each filteredCuisines as cuisine (cuisine.id)}
                          <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td class="py-4 px-2 text-gray-900 dark:text-white font-medium">
                              {cuisine.cuisine_name}
                            </td>
                            <td class="py-4 px-2 text-gray-900 dark:text-white">
                              {cuisine.price_half ? `₹${cuisine.price_half}` : '-'}
                            </td>
                            <td class="py-4 px-2 text-gray-900 dark:text-white">
                              ₹{cuisine.price_full.toFixed(2)}
                            </td>
                            <td class="py-4 px-2">
                              <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                cuisine.category === 'Veg' 
                                  ? 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400' 
                                  : cuisine.category === 'Non-Veg'
                                  ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400'
                                  : 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400'
                              }`}>
                                {cuisine.category}
                              </span>
                            </td>
                          </tr>
                        {/each}
                      {/if}
                    </tbody>
                  </table>
                </div>
            {/if}
          </Card>
        </div>

      </div>
    </div>
  </div>
</div>



