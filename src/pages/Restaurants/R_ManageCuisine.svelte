<script>
  import { onMount } from 'svelte';
  import { Card, Button, Modal, Label, Input, Spinner } from "flowbite-svelte";
  import { PenSolid, TrashBinOutline, CirclePlusSolid, ArrowLeftOutline } from "flowbite-svelte-icons";
  import routesType from "../../config/backend_routes.js";
  import { link, push } from 'svelte-spa-router';

  // State variables
  let cuisines = [];
  let loading = false;
  let error = null;

  // State for the modals and forms
  let showEditModal = false;
  let showDeleteModal = false;
  let editingCuisine = null;
  let cuisineToDelete = null;

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
            cuisine_price: parseFloat(editingCuisine.cuisine_price)
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

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-8 gap-4">
      <Button onclick={() => push('/RHome')} class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
        <ArrowLeftOutline class="w-5 h-5 mr-2" /> Back
      </Button>
      <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white text-center sm:text-left">
        Manage Your Menu
      </h1>
      <a use:link href="/RCreateCuisine" class="w-auto">
        <Button class="bg-red-500 hover:bg-red-600 font-bold">
          <!-- <PlusSolid class="w-5 h-5 mr-2"/> -->
           <CirclePlusSolid class="shrink-0 h-6 w-6" />
          Add New
        </Button>
      </a>
    </div>

    {#if loading}
      <div class="text-center py-10">
        <Spinner size="8" color="red" />
      </div>
    {:else if error}
      <p class="text-red-500 text-center">{error}</p>
    {:else if cuisines.length > 0}
      <div class="space-y-4">
        {#each cuisines as cuisine (cuisine.id)}
          <Card class="flex items-center justify-between p-4 shadow-lg rounded-lg bg-white dark:bg-gray-800">
            <div class="flex-1 min-w-0 pr-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white truncate">
                {cuisine.cuisine_name}
              </h3>
              <p class="text-lg text-gray-600 dark:text-gray-400 mt-1">
                ₹{cuisine.cuisine_price.toFixed(2)}
              </p>
            </div>
            <div class="flex items-center gap-2">
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
                <Input type="text" bind:value={editingCuisine.cuisine_name} required/>
            </Label>
            <Label>
                Cuisine Price
                <Input type="number" bind:value={editingCuisine.cuisine_price} step="0.01" required/>
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