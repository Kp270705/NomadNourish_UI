<script>
  import { onMount } from 'svelte';
  import { push, link } from 'svelte-spa-router';
  import { Card, Button, Badge, Spinner, Radio } from "flowbite-svelte";
  import { ArrowLeftOutline, CookieSolid, TruckSolid, BuildingSolid } from "flowbite-svelte-icons";
  import routesType from "../../config/backend_routes.js";

  // --- STATE ---
  let restaurant = {
    operating_status: 'Loading...',
    kitchen_status: 'Loading...',
    delivery_status: 'Loading...',
    name: 'Restaurant'
  };

  let loading = true;
  let isUpdating = false;
  let successMessage = '';
  let errorMessage = '';

  // --- OPTIONS ---
  const operatingOptions = ["Open", "Closed"];
  const kitchenOptions = ["Normal", "Busy", "Emergency"];
  const deliveryOptions = ["Active", "Inactive"];

  // --- HELPERS ---
  function getBadgeColor(status) {
    if (status === 'Open' || status === 'Active' || status === 'Normal') return 'green';
    if (status === 'Busy') return 'yellow';
    if (status === 'Closed' || status === 'Inactive' || status === 'Emergency') return 'red';
    return 'gray';
  }

  // --- API CALLS ---
  async function fetchCurrentStatus() {
    loading = true;
    errorMessage = '';
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${routesType.current_route}/restaurant/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch restaurant status.');
      
      const data = await response.json();
      restaurant.operating_status = data.operating_status;
      restaurant.kitchen_status = data.kitchen_status;
      restaurant.delivery_status = data.delivery_status;
      restaurant.name = data.name;

    } catch (err) {
      errorMessage = err.message;
    } finally {
      loading = false;
    }
  }

  // --- The Core Update Logic ---
  async function updateStatus(field, newValue) {
    // newValue is guaranteed to be one of the radio button values
    if (restaurant[field] === newValue) return; // Prevent unnecessary calls
    
    isUpdating = true;
    successMessage = '';
    errorMessage = '';
    
    try {
      const token = localStorage.getItem('jwt_token');
      const payload = { [field]: newValue };

      const response = await fetch(`${routesType.current_route}/restaurant/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update status.');
      }
      
      // Update the local state with the new status
      restaurant[field] = newValue; 
      successMessage = `${field.replace('_', ' ')} updated to ${newValue}!`;

    } catch (err) {
      errorMessage = `Update failed: ${err.message}`;
    } finally {
      isUpdating = false;
    }
  }

  onMount(fetchCurrentStatus);
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 py-12">
  <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-8 gap-4">
      <Button onclick={() => push('/RHome')} class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
        <ArrowLeftOutline class="w-5 h-5 mr-2" /> Back
      </Button>
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
        {restaurant.name} Status Control ⚙️
      </h1>
      <div class="w-20"></div>
    </div>

    {#if loading}
      <div class="flex justify-center py-12"><Spinner size="8" color="red" /></div>
    {:else}
      <Card class="p-6 rounded-2xl shadow-xl dark:bg-gray-800 space-y-6">
        <p class="text-gray-600 dark:text-gray-400">
          Instantly update your restaurant's operational status and availability.
        </p>

        {#if successMessage}
          <div class="p-3 text-sm text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 rounded-lg font-semibold">{successMessage}</div>
        {:else if errorMessage}
          <div class="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 rounded-lg font-semibold">{errorMessage}</div>
        {/if}

        <div class="space-y-4">
          
          <div class="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <span class="font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <!-- <PowerSolid class="w-5 h-5 text-red-500" /> Operating Hours -->
              <BuildingSolid class="w-5 h-5 text-red-500" /> Operating Hours
            </span>
            <div class="flex flex-wrap gap-2">
              {#each operatingOptions as option}
                <Button size="sm" 
                    class="{restaurant.operating_status === option ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:dark:bg-gray-600'}"
                    disabled={isUpdating}
                    onclick={() => updateStatus('operating_status', option)}
                >
                  {option}
                </Button>
              {/each}
            </div>
          </div>

          <div class="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <span class="font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <CookieSolid class="w-5 h-5 text-yellow-500" /> Kitchen Status
            </span>
            <div class="flex flex-wrap gap-2">
              {#each kitchenOptions as option}
                <Button size="sm" 
                    class="{restaurant.kitchen_status === option ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:dark:bg-gray-600'}"
                    disabled={isUpdating}
                    onclick={() => updateStatus('kitchen_status', option)}
                >
                  {option}
                </Button>
              {/each}
            </div>
          </div>

          <div class="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <span class="font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <TruckSolid class="w-5 h-5 text-blue-500" /> Delivery Status
            </span>
            <div class="flex flex-wrap gap-2">
              {#each deliveryOptions as option}
                <Button size="sm" 
                    class="{restaurant.delivery_status === option ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:dark:bg-gray-600'}"
                    disabled={isUpdating}
                    onclick={() => updateStatus('delivery_status', option)}
                >
                  {option}
                </Button>
              {/each}
            </div>
          </div>
        </div>
      </Card>
    {/if}
  </div>
</div>