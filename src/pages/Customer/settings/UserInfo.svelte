<script>
  import { onMount } from 'svelte';
  import { Input, Label, Button, Spinner, Alert } from 'flowbite-svelte';
  // Import the user store and our new update function
  import { user, updateUserDetails } from '../../../stores/authStore.js';
  import routesType from '../../../config/backend_routes.js';
  
  let formUsername = '';
  let formLocation = '';
  let formFile = null;
  let imagePreview = null;
  
  let isLoading = false;
  let error = null;
  let success = null;

  // Pre-fill the form with data from the user store
  onMount(() => {
    formUsername = $user.name || '';
    formLocation = $user.current_location || '';
    imagePreview = $user.image_url || null;
    console.log(`location is: ${$user.current_location} `)
  });

  // Create an image preview when a file is selected
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      formFile = file;
      imagePreview = URL.createObjectURL(file);
    }
  }

  async function handleSubmit() {
    isLoading = true;
    error = null;
    success = null;
    
    const token = localStorage.getItem('jwt_token');

    // We must use FormData because we are sending a file
    const formData = new FormData();
    formData.append('username', formUsername);
    formData.append('current_location', formLocation);
    if (formFile) {
      formData.append('image', formFile);
    }

    try {
      const response = await fetch(`${routesType.current_route}/user/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
          // No 'Content-Type', browser sets it for FormData
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to update profile.');
      }

      // Update the global store and localStorage
      updateUserDetails(data);
      success = "Profile updated successfully!";
      
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
    
  }
</script>


<div class="max-w-2xl mx-auto p-4 sm:p-8">
  {#if success}
    <Alert color="green" dismissable class=" mb-10 " >{success}</Alert>
  {/if}
  {#if error}
    <Alert color="red" dismissable class=" mb-10 " >{error}</Alert>
  {/if}
  <h1 class="text-3xl font-bold mb-6 dark:text-white">Your Info</h1>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
    
    <div class="flex flex-col items-center space-y-4">
      <img 
        src={imagePreview || 'https://placehold.co/128x128/f1f1f1/c0c0c0?text=Profile'} 
        alt="Profile preview" 
        class="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 shadow-sm"
      />
      <Label for="file-upload" class="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">
        Change Photo
      </Label>
      <input id="file-upload" type="file" class="hidden" on:change={handleFileChange} accept="image/*" />
    </div>

    <div>
      <Label for="username" class="mb-2 dark:text-white">Your Name</Label>
      <Input id="username" type="text" bind:value={formUsername} placeholder="e.g., Rudra Pathak" required />
    </div>

    <div>
      <Label for="location" class="mb-2 dark:text-white">Current Location</Label>
      <Input id="location" type="text" bind:value={formLocation}  />
    </div>

    <hr class="dark:border-gray-700"/>

    <Button type="submit" class="w-full" disabled={isLoading}>
      {#if isLoading}
        <Spinner class="mr-2" size="4" /> Saving...
      {:else}
        Save Changes
      {/if}
    </Button>


  </form>
</div>