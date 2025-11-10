<script>
  import { cart, cartStore, cartRestaurants, totalItemsInCart } from '../../stores/cartStore.js';
  import { link, push } from 'svelte-spa-router';
  import { ArrowLeftOutline, ShoppingBagSolid, TrashBinOutline } from 'flowbite-svelte-icons';
  import { Button, Badge, Spinner } from 'flowbite-svelte';
  import nn from "../../assets/Images/Home/nn.png";
  import routesType from '../../config/backend_routes.js';


  let isSubmitting = $state(false);
  let submittingRestaurantId = $state(null); 
  let hasItems = $derived($totalItemsInCart > 0);
  
  function updateQuantity(key, restaurantId, change) {
    cart.updateQuantity(key, restaurantId, change);
  }

  function goBack() {
    window.history.back();
  }

  async function handleSubmitOrder(restaurantId) {
    if (!restaurantId || isSubmitting) return;

    isSubmitting = true;
    submittingRestaurantId = restaurantId;

    const restaurantCart = $cartStore.restaurants[restaurantId]; 
    if (!restaurantCart) {
      alert("Error: Restaurant not found in cart.");
      isSubmitting = false;
      submittingRestaurantId = null;
      return;
    }

    const cartItems = Object.values(restaurantCart.items);
    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderPayload = {
      client_total_price: subTotal,
      items: cartItems.map(item => ({
        cuisine_id: item.id,
        quantity: item.quantity,
        size: item.size
      }))
    };
    
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${routesType.current_route}/order/create/${restaurantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(orderPayload)
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || 'Failed to place order.');
      }
      cart.clearCartForRestaurant(restaurantId); 
      push('/Cmy-orders');

    } catch (err) {
      console.error("Order submission failed:", err);
      alert(`Order Failed: ${err.message}`);
    } finally {
      isSubmitting = false;
      submittingRestaurantId = null;
    }
  }

</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
  <div class="max-w-6xl mx-auto">
    
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <button onclick={goBack} class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <ArrowLeftOutline class="w-6 h-6 text-gray-700 dark:text-gray-200" />
      </button>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Your Carts ({$cartRestaurants.length})
      </h1>
    </div>

    {#if !hasItems}
      <div class="text-center bg-white dark:bg-gray-800 rounded-lg shadow p-16">
        <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <ShoppingBagSolid size="xl" class="text-gray-400 dark:text-gray-500" />
        </div>
        <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <a use:link href="/CHome">
        <Button color="light" class="bg-orange-500 hover:bg-orange-600 text-white">
          Start Browsing
        </Button>
        </a>
      </div>

    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">        
        <div class="lg:col-span-2 space-y-6">
          
          {#each $cartRestaurants as restaurant (restaurant.restaurantId)} 
            {@const items = Object.values(restaurant.items)}
            {@const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            {@const deliveryFee = 30.00}
            {@const taxes = subTotal * 0.05}
            {@const grandTotal = subTotal + deliveryFee + taxes}
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Order from: <a use:link href={`/CRestaurant/${restaurant.restaurantId}/cuisines`} class="text-orange-500 hover:underline">{restaurant.restaurantName}</a>
                </h2>
              </div>
              
              <!-- Item List -->
              <div class="space-y-4 p-4">
                {#each items as item (`${item.id}-${item.size}`)}
                  <div class="flex gap-4">
                    <img src={item.image || nn} alt={item.name} class="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                    <div class="flex-1 flex flex-col justify-between">
                      <div>
                        <Badge color={item.category === 'Veg' ? 'green' : (item.category === 'Non-Veg' ? 'red' : 'yellow')} class="text-xs px-2 py-1 mb-1">{item.category}</Badge>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">{item.size}</p>
                      </div>
                      <p class="font-semibold text-orange-600 dark:text-orange-400 sm:hidden mt-2">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div class="flex flex-col items-end justify-between ml-auto">
                      <p class="font-semibold text-lg text-orange-600 dark:text-orange-400 hidden sm:block">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-md p-1 border border-gray-200 dark:border-gray-600 mt-2">
                        <Button size="sm" color="light" class="w-7 h-7 p-0 flex items-center justify-center text-lg" onclick={() => updateQuantity(`${item.id}-${item.size}`, restaurant.restaurantId, -1)}>−</Button>
                        <span class="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button size="sm" color="light" class="w-7 h-7 p-0 flex items-center justify-center text-lg" onclick={() => updateQuantity(`${item.id}-${item.size}`, restaurant.restaurantId, 1)}>+</Button>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>

              <!-- Bill Summary & Order Button -->
              <div class="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <div class="space-y-3 text-gray-700 dark:text-gray-300">
                  <div class="flex justify-between"><span>Item Total</span><span class="font-medium">₹{subTotal.toFixed(2)}</span></div>
                  <div class="flex justify-between"><span>Delivery Fee</span><span class="font-medium">₹{deliveryFee.toFixed(2)}</span></div>
                  <div class="flex justify-between"><span>Taxes & Charges (5%)</span><span class="font-medium">₹{taxes.toFixed(2)}</span></div>
                </div>
                <hr class="my-4 border-gray-200 dark:border-gray-700" />
                <div class="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white mb-6">
                  <span>To Pay</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
                
                <Button 
                  size="lg" 
                  class="w-full font-medium py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                  onclick={() => handleSubmitOrder(restaurant.restaurantId)}
                  disabled={isSubmitting}
                >
                  {#if isSubmitting && submittingRestaurantId === restaurant.restaurantId}
                    <Spinner class="mr-3" size="6" color="gray" />
                    Placing Order...
                  {:else}
                    Place Order from {restaurant.restaurantName}
                  {/if}
                </Button>
              </div>
            </div>
          {/each}
        </div>

        <!-- Right Side: Summary -->
        <div class="lg:col-span-1">
          <div class="lg:sticky lg:top-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-3 mb-4">
                Checkout
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                You have items from <strong>{$cartRestaurants.length}</strong> {$cartRestaurants.length > 1 ? 'restaurants' : 'restaurant'}.
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Please place your orders separately for each restaurant from the list on the left.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    {/if}

  </div>
</div>

<style>
  .space-y-4 > div {
    animation: fadeIn 0.3s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Minimal scrollbar for cart items */
  .space-y-4::-webkit-scrollbar {
    width: 6px;
  }
  
  .space-y-4::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .space-y-4::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
  
  .space-y-4::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
</style>