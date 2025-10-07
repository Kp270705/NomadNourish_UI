<script>
  import { onMount } from 'svelte';
  import { link, push } from 'svelte-spa-router';
  import { Card, Alert, Input, Label, Spinner, Fileupload } from "flowbite-svelte";
   import { InfoCircleSolid, EnvelopeSolid } from "flowbite-svelte-icons";
  import { fly } from "svelte/transition";

  import { Info, Image, Hotel } from 'lucide-svelte';
  import routesType from "../../config/backend_routes.js";
  // import { isAuthorized } from '../../stores/authStore.js';
  import Move from '../../utils/moveOsc.js';
  import HeaderAlongNav from '../../components/header/HeaderAlongNav.svelte';

  let loading = true;
  let error = null;
  let isUpdating = false;
  let headerRoute = false;
  let leftCardHeight = 0;

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
        if (res.status === 401){
          throw new Error("You are unauthorized")
        }
        else{
          throw new Error('Failed to fetch restaurant details.');
        }
      }
      const data = await res.json();
      restaurant = {
        id: data.id,
        name: data.name || '',
        location: data.location || '',
        mobile_number: data.mobile_number || '',
        support_email: data.support_email || '',
        image_url: data.image_url || '',
        status: data.operating_status || '',
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

  async function navBack() {
    const mvObj = new Move();
    let nvb = mvObj.goBack() 
    return nvb
      
  }

  onMount(fetchRestaurantDetails);
  
</script>



<div class="min-h-screen dark:bg-[#0a101d] dark:text-white p-6 lg:p-8" >
  <!-- <div class="w-full"> -->
    <div class="max-w-7xl mx-auto" >

    <!-- top -->
    <HeaderAlongNav heading="Edit your details" route={headerRoute} routeName="none" routeLink="none" />

      {#if loading}
        <div class="flex justify-center py-12">
          <Spinner size="8" color="red" />
        </div>
      {:else if error}
        <Alert color="red" dismissable transition={fly} params={{ x: 200 }} >
          {#snippet icon()}<InfoCircleSolid class="h-5 w-5" />{/snippet}
          Error
          {error}
          <a use:link href="/login" class="font-semibold underline hover:text-red-800 dark:hover:text-red-900">Click to sign-in</a>
        </Alert>

        <!-- skeleton  -->  
        <!-- top  -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-10 md:gap-6 lg:grid-cols-12 lg:gap-6 space-y-5 p-4 " >  
          <!-- here we give because of pulse effect -->

          <!-- info  -->
          <div class="space-y-6 md:col-span-5 lg:col-span-6" >
            <div class="w-full space-y-4 p-8 max-w-none bg-gray-50 rounded-lg animate-pulse dark:bg-gray-900 " bind:clientHeight={leftCardHeight} >
              {#each {length: 3} as _, i}
              <div role="status" class=" h-20 w-[100%] bg-[#f1f1f2] rounded-lg animate-pulse dark:bg-[#0a101c]"> 
              </div>
              {/each}
            </div>
          </div>

          <!-- image  -->
          <div class="space-y-6 md:col-span-5 lg:col-span-6" >
            <div class="w-full space-y-4 p-8 max-w-none bg-gray-50 rounded-lg animate-pulse dark:bg-gray-900 "  >
            <div role="status" class=" h-40 w-[100%] bg-[#f1f1f2] rounded-lg animate-pulse dark:bg-[#0a101c]"> 
            </div>
            <div role="status" class=" h-25 w-[100%] bg-[#f1f1f2] rounded-lg animate-pulse dark:bg-[#0a101c]"> 
            </div>
            </div>
          </div>
        </div>

        <!-- bottom  -->
        <div class="grid grid-cols-1 lg:grid-cols-1 gap-8 auto-rows-fr">
          <div class="w-full">
            <div class=" p-8 w-full max-w-none " >
              <div role="status" class=" space-y-7 h-70 bg-[#f1f1f2] rounded-lg animate-pulse dark:bg-gray-900  "> 
              </div> 
            </div>
          </div>

        </div>

      {:else}
    
        <!-- Top row: Info card (left) + Image card (right) -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-10 md:gap-6 lg:grid-cols-12 lg:gap-6 space-y-5 p-2 " >

          <!-- Info Card -->
          <div class="space-y-6 md:col-span-5 lg:col-span-6" >
            <Card class="w-full max-w-none dark:bg-[#172135] rounded-3xl shadow-xl p-8 space-y-4 " >
                <h2 class="text-2xl font-extrabold dark:text-white flex items-center gap-5 "><Info size={40} color="#a3a395" strokeWidth={3} /> Restaurant Info</h2>
    
                <div class=" bg-gray-100 dark:bg-[#0f1729] rounded-lg p-4">
                  <div class="text-sm dark:text-gray-400">Current Name</div>
                  <div class=" dark:text-white font-bold mt-1">{restaurant.name}</div>
                </div>
    
                <div class=" bg-gray-100 dark:bg-[#0f1729] rounded-lg p-4">
                  <div class="text-sm dark:text-gray-400">Location</div>
                  <div class=" dark:text-white font-bold mt-1">{restaurant.location}</div>
                </div>
                <a use:link href="/RStatus">
                  <div class=" bg-gray-100 dark:bg-[#0f1729] rounded-lg p-4">
                    <div class="text-sm dark:text-gray-400">Status</div>
                    <div class=" text-green-500 font-extrabold mt-1">{restaurant.status}</div>
                  </div>
                </a>

            </Card>
          </div>

          <!-- image  -->
          <div class="space-y-6 md:col-span-5 lg:col-span-6" >
              <Card class="w-full max-w-none dark:bg-[#172135] rounded-3xl shadow-xl p-8 space-y-4 " >
              <div class="flex flex-col items-center">
                <div class="w-40 h-40 rounded-lg overflow-hidden bg-gray-200 dark:bg-[#151e31] ring-1 ring-gray-200 flex items-center justify-center mb-4">
                  <img src={newImageUrl || restaurant.image_url || 'https://via.placeholder.com/300x300?text=No+Image'} alt="restaurant" class="object-cover w-full h-full"/>
                </div>

              <div class="flex flex-col items-center mb-6">
                <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-5 "><Image size={25} color="#e6970f" strokeWidth={3} /> Restaurant Image</h2>
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
            <Card class="p-8 bg-white dark:bg-[#131c2f] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 h-full w-full max-w-none">
              <div class="mb-4">
                <h2 class="text-2xl font-extrabold dark:text-white flex item-center gap-5 "><Hotel size={30} color="#e63a0f" strokeWidth={3} />Update Contact & Location Details</h2>
                <p class=" dark:text-gray-400">Update your restaurant's contact information</p>
              </div>

              <form on:submit|preventDefault={handleSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div class="space-y-4">
                  <div>
                    <Label class=" text-sm dark:text-gray-300">Restaurant Name</Label>
                    <Input type="text" bind:value={restaurant.name} class="mt-2 bg-gray-100 dark:bg-[#0f1729] border-none dark:text-white" required />
                  </div>

                  <div>
                    <Label class=" text-sm dark:text-gray-300">Mobile Number</Label>
                    <Input type="tel" bind:value={restaurant.mobile_number} class="mt-2 bg-gray-100 dark:bg-[#0f1729] border-none dark:text-white" required />
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <Label class=" text-sm dark:text-gray-300">Location</Label>
                    <Input type="text" bind:value={restaurant.location} class="mt-2 bg-gray-100 dark:bg-[#0f1729] border-none dark:text-white" required />
                  </div>

                  <div>
                    <Label class="text-sm dark:text-gray-300">Support Email</Label>
                    <Input type="email" bind:value={restaurant.support_email} class="mt-2 bg-gray-100 dark:bg-[#0f1729] border-none dark:text-white" required />
                  </div>
                </div>

                <div class="md:col-span-2 flex items-center justify-end gap-4 mt-2">
                  <button type="button" class="px-4 py-2 rounded-lg border border-gray-700 dark:text-gray-300 hover:bg-gray-700/50">Cancel</button>

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
  <!-- </div> -->
</div>
