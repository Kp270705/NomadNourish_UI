<script>
  import { onMount } from 'svelte';
  import { SearchOutline, StarSolid, MapPinOutline, FireOutline, CircleMinusSolid } from "flowbite-svelte-icons";
  import { link } from 'svelte-spa-router';
  import { Spinner, Button } from "flowbite-svelte";
  import routesType from "../../config/backend_routes.js";
  import { user, isAuthorized } from "../../stores/authStore.js";
  import RestaurantCard from "../../components/Card/C_RestaurantCard.svelte";

  // Restaurant State
  let allRestaurants = []; // Master list
  let displayedRestaurants = []; // Filtered list to show
  let loading = true;
  let error = null;
  let err_msg = null;
  // highestRatedRestaurant ki ab zaroorat nahi hai
  
  // --- NEW Category State ---
  /**
   * @typedef {Object} CuisineCategory
   * @property {string} id
   * @property {string} name
   * @property {string} image
   */
  /** @type {CuisineCategory[]} */
  let categories = [];
  let categoriesLoading = true;
  let categoriesError = null;
  let selectedCategory = null; // e.g., "Momos"

  // --- Initial Fetch (All Restaurants) ---
  async function fetchInitialRestaurants() {
    loading = true;
    error = null;
    try {
      const userLocation = $user?.current_location;
      let fetchUrl = `${routesType.current_route}/restaurant/get_all`;
      if (userLocation) {
        fetchUrl += `?location=${encodeURIComponent(userLocation)}`;
      }
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error(`Failed to fetch restaurants (Status: ${response.status})`);
      
      const data = await response.json();
      allRestaurants = data; // Store in master list
      displayedRestaurants = data; // Initially, display all
      
    } catch (err) {
      handleFetchError(err);
    } finally {
      loading = false;
    }
  }

  // --- NEW: Fetch Categories ---
  async function fetchCategories() {
    categoriesLoading = true;
    categoriesError = null;
    try {
      const fetchUrl = `${routesType.current_route}/cuisine/categories`;
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error(`Failed to fetch categories (Status: ${response.status})`);
      categories = await response.json();
      console.log(`\n\tCategories are: ${JSON.stringify(categories)}`);
    } catch (err) {
      if (err instanceof Error) {
        categoriesError = err.message;
      } else {
        categoriesError = 'Unknown error fetching categories';
      }
      console.error("Category fetch error:", categoriesError);
    } finally {
      categoriesLoading = false;
    }
  }

  // --- Load BOTH on mount ---
  onMount(async () => {
    // Run both fetches at the same time
    await Promise.all([
      fetchInitialRestaurants(),
      fetchCategories()
    ]);
  });

  // --- NEW: Handle Category Click ---
  async function handleCategorySelect(categoryName) {
    if (selectedCategory === categoryName) return; // Already selected

    selectedCategory = categoryName;
    loading = true; // Show main spinner
    error = null;
    err_msg = null;
    
    // Yahan hum ek naye API endpoint ko call kar rahe hain.
    // Yeh aapko backend (FastAPI) mein banana hoga.
    const fetchUrl = `${routesType.current_route}/restaurant/by_category/${encodeURIComponent(categoryName)}`;
    console.log(`Fetching from new endpoint: ${fetchUrl}`);

    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
         if (response.status === 404) {
           throw new Error(`No restaurants found for ${categoryName}. (API 404)`);
         }
         throw new Error(`Failed to fetch restaurants for ${categoryName} (Status: ${response.status})`);
      }
      displayedRestaurants = await response.json();
      if (displayedRestaurants.length === 0) {
        // Handle case where API returns 200 OK but empty list
        err_msg = `No restaurants found serving ${categoryName}.`;
      }
    } catch (err) {
      handleFetchError(err);
      displayedRestaurants = []; // Clear list on error
    } finally {
      loading = false;
    }
  }

  // --- NEW: Clear category filter ---
  function showAllRestaurants() {
    selectedCategory = null;
    displayedRestaurants = allRestaurants; // Use the master list
    error = null;
    err_msg = null;
  }

  // --- Helper for errors (remains the same) ---
  function handleFetchError(err) {
     if (err instanceof Error) {
       error = err;
       err_msg = err.message;
     } else {
       error = new Error(String(err));
       err_msg = String(err);
     }
     
     if(err_msg?.toLowerCase().includes("failed to fetch")){
        err_msg="Check your connection and try again :)";
     }
     console.error(`Error: ${err_msg}`);
  }

  // Stats for display (remain the same)
  $: totalRestaurants = displayedRestaurants.length;
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-500">

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
    
    <!-- Search Section (Moved to top) -->
    <div class="max-w-2xl mx-auto py-12">
      <div class="relative flex items-center group">
        <SearchOutline class="absolute left-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300 z-10" size="lg" />
        <a use:link href="/searchpage" class=" w-full h-16 rounded-2xl flex items-center border-2 border-gray-200 dark:border-gray-600 pl-16 pr-4 text-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-4 focus:ring-red-500/25 focus:border-red-500 text-gray-400 dark:text-gray-500 transition-all duration-300 shadow-lg focus:z-10  " >
          Search by cuisine or restaurant
        </a>
      </div>
    </div>

    {#if $isAuthorized}
      
      <!-- === CATEGORY SCROLLER SECTION === -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          What's on your mind?
        </h2>
        
        {#if categoriesLoading}
          <div class="text-center text-gray-500">Categories load ho rahi hain...</div>
        {:else if categoriesError}
          <div class="text-center text-red-500 bg-red-100 p-4 rounded-lg">
            <strong>Error:</strong> {categoriesError}
          </div>
        {:else if categories.length > 0}
          <div class="flex items-center space-x-4 overflow-x-auto pb-4 horizontal-scroller">
            
            <!-- "Show All" Button -->
            <button
              onclick={showAllRestaurants}
              class="category-item flex-shrink-0 w-32 text-center cursor-pointer group"
              class:active-category={!selectedCategory}
            >
              <div class="w-32 h-32 rounded-full shadow-lg group-hover:shadow-xl transition-all bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 { !selectedCategory ? 'border-red-500' : 'border-transparent'}">
                 <FireOutline class="w-12 h-12 text-gray-600 dark:text-gray-300" />
              </div>
              <h3 class="mt-3 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-red-600">
                Show All
              </h3>
            </button>

            <!-- Categories from API -->
            {#each categories as category (category.id)}
                <div
                    onclick={() => handleCategorySelect(category.name)}
                    class="category-item flex-shrink-0 w-32 text-center cursor-pointer group"
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === 'Enter' && handleCategorySelect(category.name)}
                >
                    <img
                        src={category.image}
                        alt={category.name}
                        class="w-32 h-32 object-cover rounded-full shadow-lg group-hover:shadow-xl transition-shadow border-2 { selectedCategory === category.name ? 'border-red-500' : 'border-transparent'}"
                    />
                    <h3 class="mt-3 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-red-600 { selectedCategory === category.name ? 'text-red-600' : ''}">
                        {category.name}
                    </h3>
                </div>
            {/each}
          </div>
        {:else}
          <div class="text-center text-gray-500">No categories found... </div>
        {/if}
      </section>
      <!-- === END OF NEW SECTION === -->


      {#if loading}
        <div class="flex justify-center items-center h-64">
          <div class="text-center">
            <Spinner size="12" color="red" />
            <p class="mt-4 text-gray-600 dark:text-gray-400 text-lg">Loading amazing restaurants...</p>
          </div>
        </div>
      {:else if error && displayedRestaurants.length === 0}
        <div class="text-center py-16">
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto">
            <p class="text-red-600 dark:text-red-400 text-lg font-medium">Oops! Something went wrong </p>
            <p class="text-red-500 dark:text-red-300 mt-2"> {err_msg} </p>
          </div>
        </div>
      {:else if displayedRestaurants.length > 0}
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              <!-- This title is now dynamic -->
              {selectedCategory ? `Restaurants serving ${selectedCategory}` : 'All Restaurants'}
            </h2>
            <span class="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              {displayedRestaurants.length} found
            </span>
          </div>          
          <!-- Fancy Quote (REMOVED) -->
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {#each displayedRestaurants as restaurant, index (restaurant.id)}
            <div class="transform hover:scale-105 transition-all duration-300 justify-self-center" style="animation-delay: {index * 100}ms">
              <!-- 
                IMPORTANT: We pass 'selectedCategory' to the card.
              -->
              <RestaurantCard {restaurant} categoryQueryParam={selectedCategory} />
            </div>
          {/each}
        </div>
      {:else}
        <!-- No restaurants card -->
        <div class="text-center py-16">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="text-6xl mb-6">🔍</div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">No restaurants found</h3>
            <p class="text-gray-600 dark:text-gray-400 text-lg">
              {#if selectedCategory}
                We couldn't find any restaurants serving "{selectedCategory}".
              {:else if err_msg}
                {err_msg}
              {:else}
                We couldn't find any restaurants.
              {/if}
            </p>
          </div>
        </div>
      {/if}

    {:else}
      <!-- Not Authorized (No Changes) -->
      <div class="text-center py-16">
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
          <div class="text-6xl mb-6">👋</div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Nomad Nourish!</h3>
          <span class="text-red-600 dark:text-red-400 text-lg" >Please login</span>
          <span class="text-gray-600 dark:text-gray-400 text-lg" >for better experience. 😋 🤩</span>
          <span>
            <p class="text-gray-900 dark:text-gray-400 text-lg">
              <strong>After login you get access to check all available hotels. </strong>
            </p>
          </span>
        </div>
      </div>

    {/if}
  </div>
</div>

<style>
  /* --- ADDED STYLES for Category Scroller --- */
  .horizontal-scroller {
      -webkit-overflow-scrolling: touch;
  }
  .horizontal-scroller::-webkit-scrollbar {
      height: 6px;
  }
  .horizontal-scroller::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
  }
  .horizontal-scroller::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 10px;
  }
  .horizontal-scroller::-webkit-scrollbar-thumb:hover {
      background: #aaa;
  }
  .category-item {
      transition: all 0.2s ease-in-out;
  }
  .category-item:hover {
       transform: scale(1.05);
  }
  .category-item img, .category-item div {
    /* For the active border */
    transition: border-color 0.2s ease;
  }
  /* --- END OF ADDED STYLES --- */

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .grid > div {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
  }
</style>