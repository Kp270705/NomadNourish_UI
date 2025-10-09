<script>
  import { onMount } from 'svelte';
  import { params, push } from 'svelte-spa-router';
  import { Card, Button, Badge } from 'flowbite-svelte';
  import { MapPinOutline, ShoppingBagSolid  } from 'flowbite-svelte-icons';
  import routesType from '../../config/backend_routes.js';

  // State variables
  let restaurant = { name: 'Loading...', location: '...' };
  let cuisines = [];
  let cart = {}; // Use an object for the cart for easier management
  let loading = true;
  let error = null;
  let restaurant_id = 0;
  
  // Reactive calculations for the cart summary
  $: cartItems = Object.values(cart);
  $: totalItemsInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  $: clientTotalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


  async function fetchMenuData(id) {
    try {
      const response = await fetch(`${routesType.current_route}/cuisine/cuisines_by_restaurant_id/${id}`);
      if (!response.ok) throw new Error('Failed to fetch menu.');
      const data = await response.json();
      restaurant = { name: data.restaurant_name, location: data.restaurant_location };
      cuisines = data.cuisines;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  // --- New Cart Logic ---
  function addToCart(cuisine, size) {
    const price = size === 'half' ? cuisine.price_half : cuisine.price_full;
    const cartKey = `${cuisine.id}-${size}`; // Unique key for item + size

    if (cart[cartKey]) {
      // If item is already in cart, increment quantity
      cart[cartKey].quantity++;
    } else {
      // Otherwise, add it to the cart
      cart[cartKey] = {
        id: cuisine.id,
        name: cuisine.cuisine_name,
        size,
        price,
        quantity: 1,
      };
    }
    cart = cart; // Trigger reactivity
  }

  function updateQuantity(cartKey, change) {
    if (cart[cartKey]) {
      cart[cartKey].quantity += change;
      if (cart[cartKey].quantity <= 0) {
        // Remove item if quantity is zero or less
        delete cart[cartKey];
      }
      cart = cart; // Trigger reactivity
    }
  }
  
  // --- New Submit Order Logic ---
  async function submitOrder() {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // 1. Prepare the payload in the new required format
    const orderPayload = {
      client_total_price: clientTotalPrice,
      items: cartItems.map(item => ({
        cuisine_id: item.id,
        quantity: item.quantity,
        size: item.size
      }))
    };
    
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${routesType.current_route}/order/create/${restaurant_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || 'Failed to place order.');
      }
      
      // On success, clear the cart and navigate to the orders page
      cart = {};
      push('/Cmy-orders');

    } catch (err) {
      console.error("Order submission failed:", err);
      alert(`Order Failed: ${err.message}`);
    }
  }

  
//   this not works for route parameters:
//     onMount(() => {
//     console.log($params)
//     if ($params && $params.id) {
//       restaurant_id = parseInt($params.id);
//       fetchMenuData($params.id);
//     }
//   });


$: if ($params && $params.id) {
    loading = true;
    error = null;
    restaurant_id = parseInt($params.id);
    fetchMenuData($params.id);
  }


</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <div class="bg-white dark:bg-gray-800 shadow-md p-6">
    <h1 class="text-4xl font-bold text-gray-800 dark:text-white">{restaurant.name}</h1>
    <p class="text-lg text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
      <MapPinOutline/> {restaurant.location}
    </p>
  </div>

  <div class="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2">
      <h2 class="text-2xl font-semibold mb-6 dark:text-white">Menu</h2>
      {#if loading}
        <p class="dark:text-white">Loading menu...</p>
      {:else if error}
        <p class="text-red-500">{error}</p>
      {:else}
        <div class="space-y-4">
          {#each cuisines as cuisine (cuisine.id)}
            <Card>
              <div class="flex justify-between items-center">
                <div>
                  <h5 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{cuisine.cuisine_name}</h5>
                  <Badge color={cuisine.category === 'Veg' ? 'green' : 'red'}>{cuisine.category}</Badge>
                </div>
                <div class="flex items-center gap-2">
                  {#if cuisine.price_half}
                    <Button size="sm" onclick={() => addToCart(cuisine, 'half')}>
                      Add Half (₹{cuisine.price_half})
                    </Button>
                  {/if}
                  <Button size="sm" color="blue" onclick={() => addToCart(cuisine, 'full')}>
                    Add Full (₹{cuisine.price_full})
                  </Button>
                </div>
              </div>
            </Card>
          {/each}
        </div>
      {/if}
    </div>

    <div class="lg:col-span-1">
      <div class="sticky top-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-6 dark:text-white flex items-center gap-3">
          <ShoppingBagSolid /> Your Cart
        </h2>
        {#if cartItems.length === 0}
          <p class="text-gray-500 dark:text-gray-400">Your cart is empty. Add items from the menu!</p>
        {:else}
          <div class="space-y-4">
            {#each cartItems as item, i (`${item.id}-${item.size}`)}
              <div class="flex justify-between items-center text-sm dark:text-gray-200">
                <div>
                  <p class="font-bold">{item.name} <span class="text-xs capitalize text-gray-500">({item.size})</span></p>
                  <p class="text-gray-600 dark:text-gray-400">₹{item.price.toFixed(2)}</p>
                </div>
                <div class="flex items-center gap-2">
                  <Button size="xs" onclick={() => updateQuantity(`${item.id}-${item.size}`, -1)}>-</Button>
                  <span>{item.quantity}</span>
                  <Button size="xs" onclick={() => updateQuantity(`${item.id}-${item.size}`, 1)}>+</Button>
                </div>
              </div>
            {/each}
          </div>
          <hr class="my-6 dark:border-gray-700"/>
          <div class="space-y-2 text-lg dark:text-white">
             <div class="flex justify-between font-bold">
              <span>Total:</span>
              <span>₹{clientTotalPrice.toFixed(2)}</span>
            </div>
          </div>
          <Button size="lg" class="w-full mt-6" onclick={submitOrder}>Place Order</Button>
        {/if}
      </div>
    </div>
  </div>
</div>