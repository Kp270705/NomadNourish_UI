<!-- # cuisine.svelte:  -->

<script>
  import { params } from 'svelte-spa-router';
  import { Card, Button } from "flowbite-svelte";
  import { CheckCircleSolid, CircleMinusSolid } from 'flowbite-svelte-icons';
  import routesType from "../config/backend_routes.js";

  // State variables
  let cuisines = [];
  let loading = false;
  let error = null;
  let restaurant_id = 0

  // Reactive statement: fetch menu when restaurant id changes
  $: if ($params && $params.id) {
    loading = true;
    error = null;
    restaurant_id= parseInt($params.id)
    fetchCuisines($params.id);
  }

  async function fetchCuisines(restaurantId) {
    console.log(`\n\n\ttype of res_id: ${typeof(restaurantId)}`)
    try {
      if (!restaurantId || isNaN(restaurantId)) {
        throw new Error('Invalid restaurant ID.');
      }

      const response = await fetch(
        `${routesType.current_route}/cuisine/cuisines_by_restaurant_id/${restaurantId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch cuisines.');
      }

      const data = await response.json();

      // ✅ add count field for cart functionality
      cuisines = data.map(c => ({ ...c, count: 0 }));

    } catch (err) {
      console.error("Error fetching cuisines:", err);
      error = err.message;
    } finally {
      loading = false;
    }
  }

  // === CART LOGIC ===
  function selectOrder(index) {
    cuisines = cuisines.map((c, i) =>
      i === index ? { ...c, count: 1 } : c
    );
  }

  function increment(index) {
    cuisines = cuisines.map((c, i) =>
      i === index ? { ...c, count: c.count + 1 } : c
    );
  }

  function decrement(index) {
    cuisines = cuisines.map((c, i) => {
      if (i === index) {
        const newCount = c.count - 1;
        return { ...c, count: newCount < 0 ? 0 : newCount };
      }
      return c;
    });
  }

  function unselect(index) {
    cuisines = cuisines.map((c, i) =>
      i === index ? { ...c, count: 0 } : c
    );
  }

  // Derived values for cart bar
  $: selectedItems = cuisines.filter(c => c.count > 0);
  $: selectedCount = selectedItems.length;
  $: selectedTotal = selectedItems.reduce(
    (sum, c) => sum + c.cuisine_price * c.count,
    0
  );

  // =======================================

  // You need access to the user's ID from the store
  import { userData } from '../stores/authStore';

  // Function to handle order submission
  async function submitOrder() {
    // 1. Check if the user is a normal user
    if ($userData && $userData.is_restaurant) {
      alert("Restaurant owners cannot place orders.");
      return;
    }
    
    // 2. Format the order items into the required list of strings
    const orderItems = selectedItems.map(c => `${c.cuisine_name}: ${c.count}`);
    const orderTotal = selectedTotal;

    const orderPayload = {
      items: orderItems,
      total_price: orderTotal
    };

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${routesType.current_route}/order/orders/${restaurant_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to place order.');
      }

      alert("Order placed successfully!");
      // Optionally, clear the cart or navigate to a new page
      selectedItems = []; // This will also hide the "Order Now" button
    } catch (err) {
      console.error("Order submission failed:", err);
      alert(err.message);
    }
  }


</script>


<div class="min-h-screen p-4 pt-8 bg-gradient-to-br from-yellow-100 via-red-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <div class=" max-w-6xl mx-auto">
    <h2 class="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white text-center">
      Menu
    </h2>

    {#if loading}
      <p class="text-center text-lg text-gray-700 dark:text-gray-300">Loading delicious dishes...</p>
    {:else if error}
      <p class="text-center text-xl font-semibold text-red-600 dark:text-red-400">Error: {error}</p>
    {:else if cuisines.length > 0}
      <div class="space-y-4 grid-cols-1 mb-25">
        {#each cuisines as cuisine, i (cuisine.id)}
          <Card class="flex items-center justify-between p-4 shadow-lg rounded-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-200 justify-self-center">
            <div class="flex-1 min-w-0 pr-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white truncate">
                {cuisine.cuisine_name}
              </h3>
              <p class="text-lg text-gray-700 dark:text-gray-300 mt-1">
                ₹{cuisine.cuisine_price.toFixed(2)}
              </p>
            </div>
            
            <div class="flex items-center">
              {#if cuisine.count === 0}
                <Button onclick={() => selectOrder(i)} 
                  class="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-green-500 hover:bg-green-600 transition-colors duration-200">
                  <CheckCircleSolid class="w-5 h-5" />
                  Select
                </Button>
              {:else}
                <div class="flex items-center gap-3">
                  <Button color="gray" size="xs" onclick={() => unselect(i)}>Unselect</Button>
                  <div class="flex items-center gap-2">
                    <Button color="light" size="xs" onclick={() => decrement(i)}>-</Button>
                    <span class="font-semibold">{cuisine.count}</span>
                    <Button color="light" size="xs" onclick={() => increment(i)}>+</Button>
                  </div>
                </div>
              {/if}
            </div>
          </Card>
        {/each}
      </div>

      {#if selectedCount > 0}
        <div class="fixed bottom-0 left-0 right-0 p-4 bg-blue-600 text-white shadow-lg z-50 mt-20">
          <div class="max-w-4xl mx-auto flex items-center justify-between gap-12">
            <div class="flex-1 min-w-0 font-medium">
              {selectedCount} item{selectedCount > 1 ? "s" : ""}
            </div>
            <div class="font-semibold">Total: ₹{selectedTotal}</div>
            <Button color="light" size="xs" onclick={() => {
              cuisines = cuisines.map(c => ({ ...c, count: 0 }));
            }}>Clear</Button>
            <Button color="red" onclick={submitOrder} class="ml-4">
              Order Now
            </Button>
          </div>
        </div>
      {/if}
    {:else}
      <p class="text-center text-lg text-gray-600 dark:text-gray-400">This restaurant has no menu items yet.</p>
    {/if}
  </div>
</div>
