import { writable } from 'svelte/store';
import routesType from '../config/backend_routes.js';

const STORAGE_KEY = 'restaurant_status_data';

// Helper function to load initial state from localStorage
function getInitialState() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (e) {
      console.error("Failed to parse restaurant status from localStorage", e);
    }
  }
  // Default empty state
  return {
    name: '',
    operating_status: 'Loading...',
    kitchen_status: 'Loading...',
    delivery_status: 'Loading...',
  };
}

// Create the writable store
const restaurantStatus = writable(getInitialState());

// Function to fetch the current status from the API
async function fetchRestaurantStatus() {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    console.warn("No token, can't fetch restaurant status.");
    return;
  }
  
  try {
    const response = await fetch(`${routesType.current_route}/restaurant/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch restaurant status.');
    
    const data = await response.json();
    
    const newStatus = {
      name: data.name,
      operating_status: data.operating_status,
      kitchen_status: data.kitchen_status,
      delivery_status: data.delivery_status,
    };

    // Update the store and localStorage
    restaurantStatus.set(newStatus);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));

  } catch (err) {
    console.error(err.message);
  }
}

// Function to update a specific status field
async function updateRestaurantStatus(field, newValue) {
  const token = localStorage.getItem('jwt_token');
  if (!token) throw new Error("Not authorized.");

  const payload = { [field]: newValue };
  
  try {
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
    const updatedData = await response.json();
    const newStatus = {
      name: updatedData.name,
      operating_status: updatedData.operating_status,
      kitchen_status: updatedData.kitchen_status,
      delivery_status: updatedData.delivery_status,
    };
    
    restaurantStatus.set(newStatus);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));
    return { success: true, data: newStatus };

  } catch (err) {
    console.error("Update failed:", err.message);
    return { success: false, error: err.message };
  }
}

// Export the store and the functions
export const restaurantStatusStore = {
  subscribe: restaurantStatus.subscribe,
  fetchStatus: fetchRestaurantStatus,
  updateStatus: updateRestaurantStatus,
};