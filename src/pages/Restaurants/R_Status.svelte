<script>
  import { push, link } from "svelte-spa-router";
  import { Card, Button, Badge, Spinner, Label, Toggle, Alert } from "flowbite-svelte";
  import {
    ArrowLeftOutline,
    CookieSolid,
    TruckSolid,
    BuildingSolid,
    AnnotationSolid,
  } from "flowbite-svelte-icons";
  import HeaderAlongNav from "../../components/header/HeaderAlongNav.svelte";

  // 1. Import the new store
  import { restaurantStatusStore } from "../../stores/restaurantStatusStore.js";
  import GeneralStyle from "../../utils/restaurants/generalStyle";
  const cardDarkBg = new GeneralStyle().CardDarkBg();
  const hoverCardDarkBg = new GeneralStyle().HoverCardDarkBg();
  const labelDarkBg = new GeneralStyle().LabelDarkBg();
  const hoverLabelDarkBg = new GeneralStyle().HoverLabelDarkBg();


  // --- 2. Use Svelte Runes for state ---
  let isUpdating = $state(false);
  let lastUpdateMessage = $state("");
  let lastUpdateType = $state("default"); // 'default', 'destructive'
  let headerRoute = $state(false);

  const kitchenOptions = ["Normal", "Busy", "Emergency"];

  // --- 3. Use $derived for reactive UI ---
  let isOpen = $derived($restaurantStatusStore.operating_status === "Open");
  let deliveryActive = $derived(
    $restaurantStatusStore.delivery_status === "Active"
  );
  let kitchenStatus = $derived($restaurantStatusStore.kitchen_status);

  // --- 4. Handlers now call the store ---
  async function handleStatusUpdate(field, newValue) {
    if ($restaurantStatusStore[field] === newValue) return;

    isUpdating = true;
    lastUpdateMessage = "";

    const result = await restaurantStatusStore.updateStatus(field, newValue);

    if (result.success) {
      lastUpdateMessage = `${field.replace("_", " ")} updated to ${newValue.toUpperCase()}!`;
      if (field === "operating_status" || field === "delivery_status") {
        lastUpdateType =
          newValue.toLowerCase() === "open" ||
          newValue.toLowerCase() === "active"
            ? "default"
            : "destructive";
      } else {
        lastUpdateType = "default";
      }
    } else {
      lastUpdateMessage = `Update failed: ${result.error}`;
      lastUpdateType = "destructive";
    }
    isUpdating = false;
  }

  const handleOperatingHoursChange = (e) => {
    handleStatusUpdate(
      "operating_status",
      e.target.checked ? "Open" : "Closed"
    );
  };

  const handleDeliveryChange = (e) => {
    handleStatusUpdate(
      "delivery_status",
      e.target.checked ? "Active" : "Inactive"
    );
  };

  $effect(() => {
    restaurantStatusStore.fetchStatus();
  });

</script>

<div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-12" >
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <HeaderAlongNav
      heading="Edit your status"
      route={headerRoute}
      routeName="None"
      routeLink="none"
    />

    <!-- Main content: Centered and responsive -->
    <div class="max-w-2xl mx-auto px-0 md:px-4 py-2">
      
      <!-- Notification Toast -->
      {#if lastUpdateMessage}
        <Alert color={lastUpdateType === "destructive" ? "red" : "blue"} class="mb-6" dismissable >
          {lastUpdateMessage}
        </Alert>
      {/if}

      <!-- Loading Spinner -->
      {#if $restaurantStatusStore.operating_status === "Loading..."}
        <div class="flex justify-center py-12">
          <Spinner size="8" color="red" />
        </div>
      {:else}
        <!-- Main Control Card -->
        <Card class="p-4 sm:p-8 bg-white {cardDarkBg} rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 h-full w-full max-w-none" >
          <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white" >
            Change your status
          </h1>
          <p class="dark:text-slate-400 text-base mb-6">
            Control all operational aspects of your restaurant
          </p>

          <!-- Operating Hours -->
          <div class="my-2 p-4 rounded-xl {labelDarkBg} {hoverLabelDarkBg} transition-all duration-300 group border border-gray-200 dark:border-slate-600" >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <BuildingSolid class="w-6 h-6 text-red-500" />
                <div>
                  <Label
                    for="operating-hours"
                    class="text-lg font-bold dark:text-white text-gray-800"
                    >Operating Hours</Label
                  >
                  <p class="text-sm dark:text-slate-400">
                    Toggle your restaurant status
                  </p>
                </div>
              </div>
              <Toggle
                id="operating-hours"
                checked={isOpen}
                onchange={handleOperatingHoursChange}
                disabled={isUpdating}
                class="scale-125"
              />
            </div>

            <div class="flex gap-4 mt-3 pl-10">
              <Badge color={isOpen ? "green" : "gray"}>Open</Badge>
              <Badge color={!isOpen ? "red" : "gray"}>Closed</Badge>
            </div>
          </div>

          <!-- Kitchen Status -->
          <div class="my-4 p-4 rounded-xl {labelDarkBg} {hoverLabelDarkBg} transition-all duration-300 border border-gray-200 dark:border-slate-600" >
            <div class="flex items-center gap-3 mb-4">
              <CookieSolid class="w-6 h-6 text-yellow-500" />
              <div>
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">
                  Kitchen Status
                </h3>
                <p class="text-sm dark:text-slate-400">
                  Set your kitchen's current workload
                </p>
              </div>
            </div>
            <!-- Responsive Button Group -->
            <div class="flex flex-col sm:flex-row gap-3 ml-0 sm:ml-[45px]">
              {#each kitchenOptions as option}
                <Button
                  size="sm"
                  onclick={() => handleStatusUpdate("kitchen_status", option)}
                  disabled={isUpdating}
                  class="flex-1 min-w-[100px] transition-all duration-200 text-sm font-medium rounded-lg shadow-md {kitchenStatus.toLowerCase() ===
                  option.toLowerCase()
                    ? 'bg-orange-600 text-white hover:bg-orange-700 scale-105 dark:bg-green-600 dark:text-white dark:hover:bg-green-700 dark:scale-1button'
                    : ' bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500'}"
                >
                  {#if option === "Emergency"}
                    <AnnotationSolid class="h-4 w-4 mr-1" />
                  {/if}
                  {option}
                </Button>
              {/each}
            </div>
          </div>

          <!-- Delivery Status -->
          <div class="my-2 p-4 rounded-xl {labelDarkBg} {hoverLabelDarkBg} transition-all duration-300 border border-gray-200 dark:border-slate-600"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <TruckSolid class="w-6 h-6 text-blue-500" />
                <div>
                  <Label
                    for="delivery-status"
                    class="text-lg font-bold text-gray-800 dark:text-white"
                    >Delivery Status</Label
                  >
                  <p class="text-sm text-slate-400">
                    Enable or disable delivery service
                  </p>
                </div>
              </div>
              <Toggle
                id="delivery-status"
                checked={deliveryActive}
                onchange={handleDeliveryChange}
                disabled={isUpdating}
                class="scale-125"
              />
            </div>
            <div class="flex gap-4 mt-3 pl-10">
              <Badge color={deliveryActive ? "blue" : "gray"}>Active</Badge>
              <Badge color={!deliveryActive ? "red" : "gray"}>Inactive</Badge>
            </div>
          </div>
        </Card>

        <!-- Responsive Stats Cards -->
        <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card
            class="text-center bg-white dark:bg-slate-800/80 hover:shadow-lg transition-all duration-300 hover:scale-105 border-none w-full"
          >
            <div class="p-3">
              <div
                class={`text-2xl font-bold ${isOpen ? "text-green-500" : "text-red-500"}`}
              >
                {isOpen ? "OPEN" : "CLOSED"}
              </div>
              <div class="text-xs text-slate-400">Restaurant</div>
            </div>
          </Card>

          <Card
            class="text-center bg-white dark:bg-slate-800/80 hover:shadow-lg transition-all duration-300 hover:scale-105 border-none w-full"
          >
            <div class="p-3">
              <div class="text-2xl font-bold text-yellow-500">
                {kitchenStatus.toUpperCase()}
              </div>
              <div class="text-xs text-slate-400">Kitchen</div>
            </div>
          </Card>

          <Card
            class="text-center bg-white dark:bg-slate-800/80 hover:shadow-lg transition-all duration-300 hover:scale-105 border-none w-full"
          >
            <div class="p-3">
              <div
                class={`text-2xl font-bold ${deliveryActive ? "text-blue-500" : "text-slate-400"}`}
              >
                {deliveryActive ? "ON" : "OFF"}
              </div>
              <div class="text-xs text-slate-400">Delivery</div>
            </div>
          </Card>
        </div>
      {/if}
    </div>

  </div>
</div>
