<script>
  import { onMount } from 'svelte';
  import { Card, Button, Label, Input, Fileupload } from "flowbite-svelte";
  import { push } from 'svelte-spa-router';
  import { isAuthorized } from '../../stores/authStore.js';
  import routesType from "../../config/backend_routes.js";

  // State variables for the form
  let restaurantName = '';
  let restaurantLocation = '';
  let restaurantImageUrl = ''; // To show the current image
  let newImageFile = null; // The file to be uploaded
  let newImageUrl = ''; // For image preview
  
  // State variables for page status
  let loading = true;
  let error = null;
  let isUpdating = false;

  // --- Functions ---
  
  // 1. Fetch current restaurant details on component mount
  async function fetchRestaurantDetails() {
    loading = true;
    error = null;
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${routesType.current_route}/restaurant/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant details.');
      }
      const data = await response.json();
      restaurantName = data.name;
      restaurantLocation = data.location;
      restaurantImageUrl = data.image_url;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  // 2. Handle image file selection
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      newImageFile = file;
      newImageUrl = URL.createObjectURL(file); // Create a preview URL
    } else {
      newImageFile = null;
      newImageUrl = '';
    }
  }

  // 3. Handle form submission
  async function handleSubmit() {
    isUpdating = true;
    error = null;
    
    // Create a FormData object to send multipart/form-data
    const formData = new FormData();
    formData.append('name', restaurantName);
    formData.append('location', restaurantLocation);
    if (newImageFile) {
      formData.append('image', newImageFile);
    }

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${routesType.current_route}/restaurant/update_details`, {
        method: 'PATCH',
        headers: {
          // NOTE: Do NOT set Content-Type header when using FormData
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update details.');
      }

      // Update local state with the new data from the response
      const updatedData = await response.json();
      restaurantName = updatedData.name;
      restaurantLocation = updatedData.location;
      restaurantImageUrl = updatedData.image_url;
      alert("Details updated successfully!");
    } catch (err) {
      error = err.message;
      console.error("Update failed:", err);
    } finally {
      isUpdating = false;
    }
  }

  onMount(fetchRestaurantDetails);
</script>

<div class="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
  <div class="max-w-xl mx-auto">
    <h1 class="text-4xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">Edit Restaurant Details</h1>

    {#if loading}
      <p class="text-center">Loading current details...</p>
    {:else if error}
      <Card class="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        <p class="font-semibold">{error}</p>
      </Card>
    {:else}
      <Card class="space-y-6 shadow-lg bg-white dark:bg-gray-800 p-6 rounded-lg">
        <form on:submit|preventDefault={handleSubmit}>
          
          <div class="flex flex-col items-center mb-6">
            <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Restaurant Image</h2>
            <img 
              src={newImageUrl || restaurantImageUrl || 'https://via.placeholder.com/200'} 
              alt="Restaurant" 
              class="w-48 h-48 object-cover rounded-lg mb-4 shadow-md"
            />
            <Fileupload onchange={handleImageChange} accept="image/*" />
          </div>

          <Label class="mb-4">
            <span>Restaurant Name</span>
            <Input type="text" bind:value={restaurantName} required />
          </Label>

          <Label class="mb-4">
            <span>Location</span>
            <Input type="text" bind:value={restaurantLocation} required />
          </Label>

          <Button type="submit" class="w-full mt-6" disabled={isUpdating}>
            {#if isUpdating}
              Saving...
            {:else}
              Save Changes
            {/if}
          </Button>
        </form>
      </Card>
    {/if}
  </div>
</div>