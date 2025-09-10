<script>
  import { params } from 'svelte-spa-router';
  import { Card, Button } from "flowbite-svelte";
  import routesType from "../config/backend_routes.js";

  // State variables
  let cuisines = [];
  let loading = false;
  let error = null;

  // Reactive statement: fetch menu when restaurant id changes
  $: if ($params && $params.id) {
    loading = true;
    error = null;
    fetchCuisines($params.id);
  }

  async function fetchCuisines(restaurantId) {
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
</script>

<div class="min-h-screen p-4 pt-8 bg-gradient-to-br from-yellow-100 via-red-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white text-center">
      Menu
    </h2>

    {#if loading}
      <p class="text-center text-lg text-gray-700 dark:text-gray-300">
        Loading delicious dishes...
      </p>
    {:else if error}
      <p class="text-center text-xl font-semibold text-red-600 dark:text-red-400">
        Error: {error}
      </p>
    {:else if cuisines.length > 0}
      <div class="p-6 grid-cols-1 space-y-6 mb-20 bg-amber-100 ">
        {#each cuisines as cuisine, i (cuisine.id)}
          <Card class="flex items-center justify-between p-4 shadow-lg rounded-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-200 justify-self-center ">
            <div class="flex-1 min-w-0 pr-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white truncate">
                {cuisine.cuisine_name}
              </h3>
              <p class="text-lg text-gray-700 dark:text-gray-300 mt-1">
                ₹{cuisine.cuisine_price.toFixed(2)}
              </p>
              <p class="text-sm text-gray-500">ID: {cuisine.id}</p>
            </div>

            <div class="flex items-center gap-3">
              {#if cuisine.count === 0}
                <!-- Select button -->
                <Button color="green" onclick={() => selectOrder(i)}>Select</Button>
              {:else}
                <!-- Unselect + Counter -->
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

      <!-- Bottom sticky cart bar -->
      {#if selectedCount > 0}
        <div
          class="
            fixed bottom-0 left-0 w-full
            bg-blue-600 text-white px-6 py-4 shadow-lg flex justify-between items-center gap-12
            md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:rounded-lg md:px-6 md:py-3
            z-50
          "
        >
          <div class="font-medium">
            {selectedCount} item{selectedCount > 1 ? "s" : ""}
          </div>
          <div class="font-semibold">Total: ₹{selectedTotal}</div>
          <Button color="light" size="xs" onclick={() => {
            cuisines = cuisines.map(c => ({ ...c, count: 0 }));
          }}>Clear</Button>
        </div>
      {/if}
    {:else}
      <p class="text-center text-lg text-gray-600 dark:text-gray-400">
        This restaurant has no menu items yet.
      </p>
    {/if}
  </div>
</div>
