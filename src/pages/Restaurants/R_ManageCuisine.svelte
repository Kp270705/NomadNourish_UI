<script>
  import { onMount } from 'svelte';
  import { Card, Button, Modal, Label, Input, Spinner } from "flowbite-svelte";
  import { PenSolid, TrashBinOutline, CirclePlusSolid, ArrowLeftOutline } from "flowbite-svelte-icons";
  import routesType from "../../config/backend_routes.js";
  import { link, push } from 'svelte-spa-router';
  import HeaderAlongNav from '../../components/header/HeaderAlongNav.svelte';

  // State variables
  let cuisines = [];
  let loading = false;
  let error = null;

  // State for the modals and forms
  let showEditModal = false;
  let showDeleteModal = false;
  let editingCuisine = null;
  let cuisineToDelete = null;
  let headerRoute = true

  // --- Fetching Cuisines ---
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

  // --- Actions ---
  function openEditModal(cuisine) {
    editingCuisine = { ...cuisine }; // Copy the object to avoid direct mutation
    showEditModal = true;
  }
  function openDeleteModal(cuisine) {
    cuisineToDelete = cuisine;
    showDeleteModal = true;
  }
  
  async function handleUpdate() {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`${routesType.current_route}/cuisine/${editingCuisine.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            cuisine_name: editingCuisine.cuisine_name,
            price_half: parseFloat(editingCuisine.price_half),
            price_full: parseFloat(editingCuisine.price_full),
        })
      });
      if (!response.ok) {
        throw new Error('Failed to update cuisine.');
      }
      // Refresh the list after a successful update
      await fetchMyCuisines();
      showEditModal = false;
    } catch (err) {
      error = err.message;
      alert(`Update failed: ${error}`);
    }
  }

  async function handleDelete() {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`${routesType.current_route}/cuisine/${cuisineToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to delete cuisine.');
      }
      // Refresh the list after a successful delete
      await fetchMyCuisines();
      showDeleteModal = false;
    } catch (err) {
      error = err.message;
      alert(`Delete failed: ${error}`);
    }
  }

  onMount(() => {
    fetchMyCuisines();
  });


</script>

<div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- top -->
    <HeaderAlongNav heading="Edit your cuisine" route={headerRoute} routeName="Add cuisine" routeLink="/RCreateCuisine" />

    {#if loading}
      <div class="text-center py-10">
        <Spinner size="8" color="red" />
      </div>
    {:else if error}

      <!-- skeleton -->
      <div class=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-6 max-w-6xl mx-auto" >

        {#each {length: 12} as _, i}
          <div role="status" class="lg:col-span-3 space-y-7 h-70 bg-[#f1f1f2] rounded-lg animate-pulse dark:bg-[#0e1930] "> 
          </div> 
        {/each}

      </div>

        
      <!-- </div> -->
    {:else if cuisines.length > 0}

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-6 max-w-6xl mx-auto" >
        {#each cuisines as cuisine (cuisine.id)}
          <Card class=" border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-fade-in

           bg-gray-100 dark:bg-[#131c30] border-gray-300 dark:hover:border-red-400 
           lg:col-span-3 justify-self-center py-5 space-y-7  ">

            <!-- name  -->
            <div class="flex items-center justify-center " >
              <h3 class="text-xl font-bold text-gray-900 dark:text-white truncate">
                {cuisine.cuisine_name}
              </h3>
            </div>
            
            <!-- price -->
            <div class="flex items-center gap-8 justify-center ">
              {#if cuisine.price_half}
                <div>
                  <h1 class=" font-bold text-xl text-amber-400 dark:text-amber-200 " >Half Price</h1>
                  <p class="text-lg text-gray-600 dark:text-gray-400 mt-1 flex items-center justify-center ">
                    ₹{cuisine.price_half}
                  </p>
                </div>
              {/if}

              <div>
                <h1 class=" font-bold text-xl text-amber-400 dark:text-amber-200 " >Full Price</h1>
                <p class="text-lg text-gray-600 dark:text-gray-400 mt-1 flex items-center justify-center">
                  ₹{cuisine.price_full}
                </p>
              </div>

            </div>

            <!-- buttons -->
            <div class="flex items-center gap-6 justify-center">
              <Button onclick={() => openEditModal(cuisine)} color="yellow">
                 <PenSolid class="shrink-0 h-6 w-6" />
              </Button>
              <Button onclick={() => openDeleteModal(cuisine)} color="red">
                <TrashBinOutline class="w-5 h-5"/>
              </Button>
            </div>

          </Card>
        {/each}
      </div>

    {:else}
      <p class="text-center text-gray-600 dark:text-gray-400">
        You have no cuisines added yet.
      </p>
    {/if}
  </div>
</div>

{#if editingCuisine}
<Modal title="Edit Cuisine" bind:open={showEditModal}>
    <form on:submit|preventDefault={handleUpdate}>
        <div class="space-y-4 p-4">
            <Label>
                Cuisine Name
                <Input type="text" bind:value={editingCuisine.cuisine_name}/>
            </Label>
            <Label>
                Half Price
                <Input type="number" bind:value={editingCuisine.price_half} step="0.01"/>
            </Label>
            <Label>
                Full Price
                <Input type="number" bind:value={editingCuisine.price_full} step="0.01"/>
            </Label>
        </div>
        <div class="flex justify-end p-4 border-t dark:border-gray-700">
            <Button type="submit" color="green">Save Changes</Button>
        </div>
    </form>
</Modal>
{/if}

{#if cuisineToDelete}
<Modal title="Delete Cuisine" bind:open={showDeleteModal} size="sm">
    <div class="p-4 space-y-4 text-center">
        <p class="text-gray-500 dark:text-gray-400">
            Are you sure you want to delete **{cuisineToDelete.cuisine_name}**?
        </p>
        <div class="flex justify-center space-x-4">
            <Button onclick={() => showDeleteModal = false} color="light">Cancel</Button>
            <Button onclick={handleDelete} color="red">Delete</Button>
        </div>
    </div>
</Modal>
{/if}