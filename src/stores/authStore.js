import { writable } from 'svelte/store';
import routesType from '../config/backend_routes';
import {jwtDecode} from 'jwt-decode';
import { loc, push } from 'svelte-spa-router';

// Create the auth store
export const isAuthorized = writable(false);
export const dropdownButton = writable('Sign-In');
export const userData = writable(null);
export const showLoginToast = writable(false);
export const userType = writable(null);

// A single writable store for all user details.
// It holds a plain JavaScript object.
export const user = writable({
  name: '',
  email: '',
  image_url: '',
});

// A writable store for restaurant details
export const restaurant = writable({
  name: '',
  location: '',
  mobile_number: '',
  image_url: '',
  support_email:'',
  gstIN: ''
});


// Auth check function, now more efficient and correct
export async function checkAuth() {

  const token = localStorage.getItem("jwt_token");
  const userDetailsString = localStorage.getItem("user_details"); // Get the stored details

  if (!token || !userDetailsString) {
    isAuthorized.set(false);
    console.log("\n\tNo token found no detail");
    dropdownButton.set('Sign-In');
    userData.set(null);
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds

    if (decodedToken.exp < currentTime) {
      console.warn("❌ Token expired. Clearing local storage.");
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_details");
      isAuthorized.set(false);
      console.log("\n\tNo token found no detail");
      dropdownButton.set('Sign-In');
      userData.set(null);
      logout()
      return false;

    }

    // Parse the stored strings back into their respective types
    const userDetails = JSON.parse(userDetailsString);
    const user_type = localStorage.getItem("user_type");
    userType.set(user_type);

    if (user_type === 'restaurant') {
      restaurant.set({
        name: userDetails.name,
        location: userDetails.location,
        mobile_number: userDetails.mobile_number,
        image_url: userDetails.image_url,
        support_email:userDetails.support_email,
        gstIN: userDetails.gstIN,
      });
    }

    if (user_type === 'user') {
      user.set({
        name: userDetails.username,
        email: userDetails.email,
        image_url: userDetails.image_url,
      });
    }

    const username = decodedToken.sub;
    isAuthorized.set(true);
    dropdownButton.set('Sign-Out');
    console.log(`✅ User authenticated from client-side check.\n`);
    console.log(`✅ User type. ${user_type} \n`);
    return true;
    
  } catch (err) {
    console.error("Token decoding failed", err);
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_details"); // Clear stale data
    isAuthorized.set(false);
    dropdownButton.set('Sign-In');
    userData.set(null);
    return false;
  }
}


// Login function - FIXED for your API response format
export async function login(formData) {
  try {
    const credentials = new URLSearchParams(formData);
    const response = await fetch(`${routesType.current_route}/auth/token`, {
      method: 'POST',
       headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: credentials.toString(),
      credentials: 'include'
    });

    const data = await response.json();
    console.log(`\n\nresponse.status: ${response.status}`)

    // Handle different status codes
    if (response.status === 200 && data.access_token) {
      // console.log(`Token is: ${data.access_token}`);
      localStorage.setItem("jwt_token", data.access_token);
      
      const userDetails = data.user_details;
      const user_type = data.user_type;
      

      // Save user details and user type to localStorage as JSON strings
      localStorage.setItem("user_details", JSON.stringify(userDetails));
      localStorage.setItem("user_type", user_type);

      console.log("User details received:", userDetails);
      console.log("User name received:", userDetails[0]);

      await checkAuth(); // Update the global state
      return { 
        success: true, 
        status: response.status,
        message: data.message,
        user:data.user_type, 
      };

    } else {
      // Return error details for UI handling
      return { 
        success: false, 
        status: response.status,
        message: data.message || 'Login failed',
        error: data.error, 
        user:'not-authenticated'
      };
    }
    
  } catch (err) {
    return { 
      success: false, 
      status: 500,
      message: '❗ Login Failed',
      error: err.message,
      user:'not-authenticated'
    };
  }
}

// Logout function
export async function logout() {
  const token = localStorage.getItem("jwt_token");

  if (token) {
    try {
      await fetch(`${routesType.current_route}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Logout API call failed:", err);
    }
  }

  // Clear everything on the client side
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user_details"); // Also remove user details
  localStorage.removeItem("user_type");    // Also remove user type


  isAuthorized.set(false);
  userData.set(null);
  userType.set(null);

  // +++ ADD THESE LINES to clear user/restaurant specific data +++
  user.set({ name: '', email: '', image_url: '' });
  restaurant.set({ name: '', location: '', mobile_number: '', image_url: '', support_email: '', gstIN: '' });

  console.log("✅ User logged out");
  push('/'); // Redirect to the landing page
}

// This listener synchronizes the auth state across multiple browser tabs.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    // Define all the keys that are related to authentication
    const authKeys = ['jwt_token', 'user_details'];

    // If the key that changed is one of our auth keys...
    if (authKeys.includes(event.key)) {
      console.log(`Auth data ('${event.key}') changed in another tab, re-checking auth status...`);
      checkAuth();
    }

    // Debugging purpose only 
    // else{
    //   console.log(`testing..currently false for this`)
    // }
    
  });
}