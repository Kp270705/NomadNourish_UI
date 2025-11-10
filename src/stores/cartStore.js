import { writable, derived } from 'svelte/store';
import { push } from 'svelte-spa-router';

const CART_STORAGE_KEY = 'nomad_nourish_cart_multi';

const defaultState = {
  restaurants: {}
};

function getInitialState() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      if (parsed.restaurants) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse saved cart, resetting.", e);
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  return defaultState;
}

const _cart = writable(getInitialState());

_cart.subscribe(currentCart => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCart));
  } catch (e) {
    console.error("Failed to save cart to localStorage", e);
  }
});

// --- YEH FUNCTION REPLACE HO GAYA HAI ---
const updateQuantity = (cartKey, restaurantId, change) => {
  _cart.update(currentCart => {
    // 1. Get the specific restaurant (if it exists)
    const restaurantCart = currentCart.restaurants[restaurantId];
    if (!restaurantCart) return currentCart; // No change

    // 2. Get the specific item (if it exists)
    const itemToUpdate = restaurantCart.items[cartKey];
    if (!itemToUpdate) return currentCart; // No change

    const newQuantity = itemToUpdate.quantity + change;

    // 3. Create a new items object
    const newItems = { ...restaurantCart.items };

    if (newQuantity <= 0) {
      // Delete item
      delete newItems[cartKey];
    } else {
      // 4. Update item by creating a NEW object
      newItems[cartKey] = {
        ...itemToUpdate, // Copy old properties
        quantity: newQuantity // Set new quantity
      };
    }

    // 5. Create a new restaurants object
    const newRestaurants = { ...currentCart.restaurants };

    if (Object.keys(newItems).length === 0) {
      // Delete restaurant if it has no items
      delete newRestaurants[restaurantId];
    } else {
      // 6. Update restaurant with the new items list
      newRestaurants[restaurantId] = {
        ...restaurantCart, // Copy old properties (name, id)
        items: newItems // Set new items object
      };
    }
    
    // 7. Return the new top-level state
    return {
      restaurants: newRestaurants
    };
  });
};
// --- END OF REPLACEMENT ---

const addToCart = (cuisine, size, restaurantId, restaurantName) => {
  _cart.update(currentCart => {
    const cartKey = `${cuisine.id}-${size}`;

    if (!currentCart.restaurants[restaurantId]) {
      currentCart.restaurants[restaurantId] = {
        restaurantId: restaurantId,
        restaurantName: restaurantName,
        items: {}
      };
    }

    const restaurantCart = currentCart.restaurants[restaurantId];
    const price = size === 'half' ? cuisine.price_half : cuisine.price_full;

    if (restaurantCart.items[cartKey]) {
      restaurantCart.items[cartKey].quantity++;
    } else {
      restaurantCart.items[cartKey] = {
        id: cuisine.id,
        name: cuisine.cuisine_name,
        category: cuisine.category,
        image: cuisine.cuisine_image,
        size,
        price,
        quantity: 1,
        restaurantId: restaurantId 
      };
    }
    
    return { ...currentCart };
  });
};

const clearCart = () => {
  _cart.set(defaultState);
};

const clearCartForRestaurant = (restaurantId) => {
  _cart.update(currentCart => {
    if (currentCart.restaurants[restaurantId]) {
      delete currentCart.restaurants[restaurantId];
    }
    // Return a new object to trigger updates
    return { ...currentCart };
  });
};

export const cartStore = _cart;

export const cartRestaurants = derived(_cart, ($cart) => {
  return Object.values($cart.restaurants);
});

export const cartItems = derived(cartRestaurants, ($cartRestaurants) => {
  return $cartRestaurants.flatMap(resto => Object.values(resto.items));
});

export const totalItemsInCart = derived(cartItems, ($cartItems) => {
  return $cartItems.reduce((sum, item) => sum + item.quantity, 0);
});

export const cart = {
  subscribe: _cart.subscribe,
  addToCart,
  updateQuantity, // Ab yeh naya wala function use karega
  clearCart,
  clearCartForRestaurant
};