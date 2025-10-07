<script>
  import { onMount } from 'svelte';
  import { push, link } from 'svelte-spa-router';
  import { Card, Button, Badge, Spinner, Label, Toggle } from "flowbite-svelte";
  import { ArrowLeftOutline, CookieSolid, TruckSolid, BuildingSolid, CirclePlusSolid, AnnotationSolid } from "flowbite-svelte-icons";
  import routesType from "../../config/backend_routes.js";
  import Move from '../../utils/moveOsc.js';
  import HeaderAlongNav from '../../components/header/HeaderAlongNav.svelte';

  // --- STATE ---
  let restaurant = {
    name: 'Loading...',
    operating_status: 'Loading...',
    kitchen_status: 'Loading...',
    delivery_status: 'Loading...',
  };

  let loading = true;
  let isUpdating = false;
  let errorMessage=''
  let headerRoute = false
  
  // TOAST STATE: Controlled by API responses
  let lastUpdateMessage = '';
  let lastUpdateType = 'default'; // 'default' (blue/active), 'destructive' (red/inactive)


  // --- OPTIONS ---
  const kitchenOptions = ["Normal", "Busy", "Emergency"];
  
  // --- DERIVED STATE (for binding and display) ---
  $: isOpen = restaurant.operating_status === 'Open';
  $: deliveryActive = restaurant.delivery_status === 'Active';
  $: kitchenStatus = restaurant.kitchen_status; // Used for visual comparison in the template


  // --- HELPERS ---
  function getBadgeColor(status) {
    status = status.toLowerCase();
    if (status === 'open' || status === 'active' || status === 'normal') return 'green';
    if (status === 'busy') return 'yellow';
    if (status === 'closed' || status === 'emergency' || status === 'inactive') return 'red';
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
      // Ensure local state is updated with database values
      restaurant = {
        operating_status: data.operating_status,
        kitchen_status: data.kitchen_status,
        delivery_status: data.delivery_status,
        name: data.name,
      };

    } catch (err) {
      // ... (error handling)
    } finally {
      loading = false;
    }
  }

  async function updateStatus(field, newValue) {
    // Only update if the value is actually changing
    if (restaurant[field] === newValue) return;

    isUpdating = true;
    lastUpdateMessage = '';
    
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
      
      const updatedRestaurant = await response.json();
      
      // Update the local state
      restaurant[field] = newValue;

      // Set TOAST message and type
      lastUpdateMessage = `${field.replace('_', ' ')} updated to ${newValue.toUpperCase()}!`;
      
      if (field === 'operating_status' || field === 'delivery_status') {
          // Toggles use red for CLOSED/INACTIVE (destructive) and blue for OPEN/ACTIVE (default)
          lastUpdateType = newValue.toLowerCase() === 'open' || newValue.toLowerCase() === 'active' ? 'default' : 'destructive';
      } else {
          // Kitchen uses default (blue) for any change
          lastUpdateType = 'default';
      }


    } catch (err) {
      lastUpdateMessage = `Update failed: ${err.message}`;
      lastUpdateType = 'destructive';
    } finally {
      isUpdating = false;
    }
  }
  
  // --- HANDLERS (Mirroring React's onChange/onClick) ---

  const handleOperatingHoursChange = (e) => {
    const checked = e.target.checked;
    const newStatus = checked ? 'Open' : 'Closed';
    updateStatus('operating_status', newStatus);
  };
  
  const handleDeliveryChange = (e) => {
    const checked = e.target.checked;
    const newStatus = checked ? 'Active' : 'Inactive';
    updateStatus('delivery_status', newStatus);
  };

  const handleKitchenStatusChange = (status) => {
    updateStatus('kitchen_status', status);
  };

  async function navBack() {
    const mvObj = new Move();
    let nvb = mvObj.goBack() 
    return nvb
      
  }

  onMount(fetchCurrentStatus);
</script>


<div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-12" >
  <div class=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 " >

    <!-- Intro: -->
    <!-- <div class="relative pt-12 pb-8 text-center">
      <Button 
          onclick={navBack} 
          class="absolute top-0 left-0 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white" >
          <ArrowLeftOutline class="w-5 h-5 mr-2" /> Back
      </Button>

      <h1 class="text-4xl font-extrabold text-orange-500">
        Edit Your Status
      </h1> 
    </div> -->

    <HeaderAlongNav heading="Edit your status" route={headerRoute} routeName="None" routeLink="none" />
    
    <!-- Main content:  -->
    <div class=" mx-auto px-4 py-2 w-[70%] ">

      {#if lastUpdateMessage}
        <div 
          class="p-4 rounded-lg text-center font-semibold mb-6 transition-all duration-300"
          class:bg-blue-600={lastUpdateType === 'default'} 
          class:bg-red-600={lastUpdateType === 'destructive'} 
          class:text-white={true} >
          {lastUpdateMessage}
        </div>
      {/if}

      {#if loading}
        <div class="flex justify-center py-12"><Spinner size="8" color="red" />
        </div>
      {:else}

      <div class="grid grid-cols-1 lg:grid-cols-1 gap-8 " >
          <Card class="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 h-full w-full max-w-none" >
            <h1 class=" text-4xl font-extrabold " >Change your restaurant status</h1>
            <p class="dark:text-slate-400 text-base" >Control all operational aspects of your restaurant</p>

            <div class=" my-2 p-4 rounded-xl dark:bg-[#182338] dark:hover:bg-[#1a273e] transition-all duration-300 group border border-slate-600">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <BuildingSolid class="w-6 h-6 text-red-500" />
                  <div>
                    <Label for="operating-hours" class="text-lg  dark:font-bold font-extrabold dark:text-white text-green-600 ">Operating Hours</Label>
                    <p class="text-sm dark:text-slate-400">Toggle your restaurant status</p>
                  </div>
                </div>
                <Toggle id="operating-hours" checked={isOpen} onchange={handleOperatingHoursChange} disabled={isUpdating} class="scale-125" />
              </div>
              <div class="flex gap-4 mt-3 pl-10">
                <Badge color={isOpen ? 'green' : 'gray'}>Open</Badge>
                <Badge color={!isOpen ? 'red' : 'gray'}>Closed</Badge>
              </div>
            </div>

            <div class=" my-2 p-4 rounded-xl dark:bg-[#182338] dark:hover:bg-[#1a273e] transition-all duration-300 border border-slate-600">
              <div class="flex items-center gap-3 mb-4">
                <CookieSolid class="w-6 h-6 text-yellow-500" />
                <div>
                  <h3 class="text-lg dark:font-bold font-extrabold text-red-500 dark:text-white">Kitchen Status</h3>
                  <p class="text-sm dark:text-slate-400">Set your kitchen's current workload</p>
                </div>
              </div>
              <div class="flex gap-3 ml-[45px] flex-wrap">
                {#each kitchenOptions as option}
                  <Button size="sm" 
                      onclick={() => handleKitchenStatusChange(option)}
                      disabled={isUpdating}
                      class="flex-1 min-w-[100px] transition-all duration-200 text-sm font-medium rounded-lg shadow-md {
                        kitchenStatus.toLowerCase() === option.toLowerCase()
                          ? 'bg-orange-600 text-white hover:bg-orange-700 scale-105 dark:bg-green-600 dark:text-white dark:hover:bg-green-700 dark:scale-105'
                          : ' bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500'
                      }" >
                      {#if option === 'Emergency'}
                        <AnnotationSolid class="h-4 w-4 mr-1" />
                      {/if}
                      {option}
                  </Button>
                {/each}
              </div>
            </div>

            <div class=" my-2 p-4 rounded-xl dark:bg-[#182338] dark:hover:bg-[#1a273e] transition-all duration-300 border border-slate-600">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <TruckSolid class="w-6 h-6 text-blue-500" />
                  <div>
                    <Label for="delivery-status" class="text-lg fdark:font-bold font-extrabold text-blue-500 dark:text-white">Delivery Status</Label>
                    <p class="text-sm text-slate-400">Enable or disable delivery service</p>
                  </div>
                </div>
                <Toggle id="delivery-status" checked={deliveryActive} onchange={handleDeliveryChange} disabled={isUpdating} class="scale-125" />
              </div>
              <div class="flex gap-4 mt-3 pl-10">
                <Badge color={deliveryActive ? 'blue' : 'gray'}>Active</Badge>
                <Badge color={!deliveryActive ? 'red' : 'gray'}>Inactive</Badge>
              </div>
            </div>

          </Card>
      </div>

      <div class=" mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 my-6">
        <Card class="text-center bg-white dark:bg-slate-800/80 hover:shadow-lg transition-all duration-300 hover:scale-105 border-none w-[100%] ">
          <div class="p-3">
            <div class={`text-2xl font-bold ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
              {isOpen ? 'OPEN' : 'CLOSED'}
            </div>
            <div class="text-xs text-slate-400">Restaurant</div>
          </div>
        </Card>
          
        <Card class="text-center bg-white dark:bg-slate-800/80 hover:shadow-lg transition-all duration-300 hover:scale-105 border-none w-[100%] ">
          <div class="p-3">
            <div class="text-2xl font-bold text-yellow-500">
              {kitchenStatus.toUpperCase()}
            </div>
            <div class="text-xs text-slate-400">Kitchen</div>
          </div>
        </Card>
          
        <Card class="text-center bg-white dark:bg-slate-800/80 hover:shadow-lg transition-all duration-300 hover:scale-105 border-none w-[100%] ">
          <div class="p-3">
            <div class={`text-2xl font-bold ${deliveryActive ? 'text-blue-500' : 'text-slate-400'}`}>
              {deliveryActive ? 'ON' : 'OFF'}
            </div>
            <div class="text-xs text-slate-400">Delivery</div>
          </div>
        </Card>
      </div>
      {/if}

    </div>
  </div>
</div>

