<script>
  import { onMount } from 'svelte';
  import { link, push } from 'svelte-spa-router';
  import { Card, Button, Input, Label, Spinner, Fileupload } from "flowbite-svelte";
  import routesType from "../../config/backend_routes.js";

  let loading = true;
  let error = null;
  let isUpdating = false;

  // fetched state
  let restaurant = {
    id: null,
    name: '',
    location: '',
    mobile_number: '',
    support_email: '',
    image_url: '',
    status: 'Unknown'
  };

  // upload preview
  let newImageFile = null;
  let newImageUrl = '';

  function handleImageChange(e) {
    const f = e.target.files?.[0];
    if (f) {
      newImageFile = f;
      newImageUrl = URL.createObjectURL(f);
    } else {
      newImageFile = null;
      newImageUrl = '';
    }
  }

  // fetch details
  async function fetchRestaurantDetails() {
    loading = true;
    error = null;
    try {
      const token = localStorage.getItem('jwt_token');
      const res = await fetch(`${routesType.current_route}/restaurant/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch restaurant details.');
      }
      const data = await res.json();
      restaurant = {
        id: data.id,
        name: data.name || '',
        location: data.location || '',
        mobile_number: data.mobile_number || '',
        support_email: data.support_email || '',
        image_url: data.image_url || '',
        status: data.operating_status ? 'Active' : 'Inactive'
      };
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    isUpdating = true;
    error = null;

    try {
      const token = localStorage.getItem('jwt_token');
      const fd = new FormData();
      fd.append('name', restaurant.name);
      fd.append('location', restaurant.location);
      fd.append('contact_no', restaurant.mobile_number);
      fd.append('contact_email', restaurant.support_email);
      if (newImageFile) fd.append('image', newImageFile);

      const res = await fetch(`${routesType.current_route}/restaurant/update_details`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
          // NOTE: do NOT set Content-Type for FormData
        },
        body: fd
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to update details.');
      }

      const updated = await res.json();
      // keep UI in sync
      restaurant.name = updated.name || restaurant.name;
      restaurant.location = updated.location || restaurant.location;
      restaurant.image_url = updated.image_url || restaurant.image_url;
      newImageFile = null;
      newImageUrl = '';

      alert('Details updated successfully!');
    } catch (err) {
      error = err.message;
      console.error(err);
      alert(`Update failed: ${error}`);
    } finally {
      isUpdating = false;
    }
  }

  onMount(fetchRestaurantDetails);
  
</script>


<!-- Header -->
<div class=" bg-slate-900 p-2 md:p-2" >
  <div class="max-w-6xl mx-auto space-y-4">
  <a use:link href="/RCreateCuisine" class="inline-flex items-center text-sm text-gray-300 hover:text-white mb-2  bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow hover:opacity-95  ">← Back to Dashboard</a>
  <!-- <a use:link href="/RCreateCuisine">home</a> -->
  <h1 class="text-3xl md:text-4xl font-extrabold text-white">Edit Restaurant Details</h1>
  <p class="text-gray-400 mt-1">Update your restaurant information and contact details</p>
  </div>
</div>

<div class="min-h-screen bg-pink-50 dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center py-2 px-2 sm:py-[2vh] sm:pb-[10vh] sm:px-[10vw]">
  <div class="w-full">
    <div class="max-w-6xl mx-auto px-4 py-2">

      {#if loading}
        <div class="flex justify-center py-12">
          <Spinner size="8" color="red" />
        </div>
      {:else if error}
        <Card class="bg-red-800 text-red-100">
          <p class="font-semibold">Error</p>
          <p>{error}</p>
        </Card>
      {:else}
    
        <!-- Top row: Image card (left) + Info card (right) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-fr mb-6">

          <div class="w-full">
            <!-- Info Card -->
            <Card class="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 h-full w-full max-w-none">
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-white">Restaurant Info</h3>
    
                <div class="bg-gray-800/40 rounded-lg p-4">
                  <div class="text-sm text-gray-400">Current Name</div>
                  <div class="text-white font-medium mt-1">{restaurant.name}</div>
                </div>
    
                <div class="bg-gray-800/40 rounded-lg p-4">
                  <div class="text-sm text-gray-400">Location</div>
                  <div class="text-white font-medium mt-1">{restaurant.location}</div>
                </div>
    
                <div class="bg-gray-800/40 rounded-lg p-4">
                  <div class="text-sm text-gray-400">Status</div>
                  <div class="text-green-400 font-semibold mt-1">{restaurant.status}</div>
                </div>
              </div>
            </Card>
          </div>

            <div class="w-full">
            <!-- <Card class="bg-gray-800 rounded-2xl p-6"> -->
              <Card class="p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 h-full w-full max-w-none" >
              <div class="flex flex-col items-center">
                <div class="w-40 h-40 rounded-lg overflow-hidden bg-gray-700 ring-1 ring-gray-700 flex items-center justify-center mb-4">
                  <img src={newImageUrl || restaurant.image_url || 'https://via.placeholder.com/300x300?text=No+Image'} alt="restaurant" class="object-cover w-full h-full"/>
                </div>

              <div class="flex flex-col items-center mb-6">
                <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Restaurant Image</h2>
                <p class="text-sm text-gray-400 mb-4">Upload your restaurant's logo or photo</p>
                <Fileupload onchange={handleImageChange} accept="image/*" placeholder="select here" />
              </div>

              </div>
            </Card>
          </div>

        </div>

        <!-- Bottom: Contact & Location Details (spanning full width) -->
        <div class="grid grid-cols-1 lg:grid-cols-1 gap-8 auto-rows-fr">
          <div class="w-full">
            <Card class="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 h-full w-full max-w-none">
              <div class="mb-4">
                <h2 class="text-xl font-semibold text-white">Contact & Location Details</h2>
                <p class="text-gray-400">Update your restaurant's contact information</p>
              </div>

              <form on:submit|preventDefault={handleSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column -->
                <div class="space-y-4">
                  <div>
                    <Label class="text-sm text-gray-300">Restaurant Name</Label>
                    <Input type="text" bind:value={restaurant.name} class="mt-2 bg-gray-700/60 text-white" required />
                  </div>

                  <div>
                    <Label class="text-sm text-gray-300">Mobile Number</Label>
                    <Input type="tel" bind:value={restaurant.mobile_number} class="mt-2 bg-gray-700/60 text-white" required />
                  </div>
                </div>

                <!-- Right column -->
                <div class="space-y-4">
                  <div>
                    <Label class="text-sm text-gray-300">Location</Label>
                    <Input type="text" bind:value={restaurant.location} class="mt-2 bg-gray-700/60 text-white" required />
                  </div>

                  <div>
                    <Label class="text-sm text-gray-300">Support Email</Label>
                    <Input type="email" bind:value={restaurant.support_email} class="mt-2 bg-gray-700/60 text-white" required />
                  </div>
                </div>

                <!-- full-width actions row (span across both columns) -->
                <div class="md:col-span-2 flex items-center justify-end gap-4 mt-2">
                  <button type="button" class="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-700/50">Cancel</button>

                  <button type="submit" class="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow hover:opacity-95 disabled:opacity-60"
                    disabled={isUpdating}>
                    {#if isUpdating}Saving...{:else}Save Changes{/if}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </div>

      {/if}
    </div>
  </div>
</div>
