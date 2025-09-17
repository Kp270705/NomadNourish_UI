<script>
  import { DotsHorizontalOutline, StarSolid, MapPinOutline, PhoneOutline } from "flowbite-svelte-icons";
  import { Card, Dropdown, DropdownItem, Avatar, Button } from "flowbite-svelte";
  import { link } from 'svelte-spa-router';
  import food from "../../assets/icons/food1.png";

  let icon = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTbrOFGnPo_bZ3PCSXX8QmG3dsktjLi0VdHmtASGZWtENLA_wRM1XfK9x5KPiel6jFrOyO7XVSA4_dd8jB95M0xyK73RpdrifrrrcWcgXG6sA"

  export let restaurant;
  
  // Mock data for enhanced card (you can replace with real data from your API)
  const rating = 4.2 + Math.random() * 0.8; // Random rating between 4.2-5.0
  const reviewCount = Math.floor(Math.random() * 500) + 100; // Random review count
  const cuisineTypes = ['Italian', 'Indian', 'Chinese', 'Mexican', 'Thai'];
  const randomCuisine = cuisineTypes[Math.floor(Math.random() * cuisineTypes.length)];
  console.log(`restaurant url is: ${restaurant.image_url}`)

</script>

<div class="group">
  <Card class="relative flex flex-col items-center justify-between rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 overflow-hidden">
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 dark:from-red-600/10 dark:to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    
    <!-- Menu Dots -->
    <div class="flex justify-end w-full relative z-10">
      <button class="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white dark:hover:bg-gray-700">
        <DotsHorizontalOutline class="text-gray-600 dark:text-gray-400 hover:text-red-500" />
      </button>
      <Dropdown class="w-40 mt-2">
        <DropdownItem class="hover:bg-red-50 dark:hover:bg-red-900/20">
          <span class="text-gray-700 dark:text-gray-300">Edit</span>
        </DropdownItem>
        <DropdownItem class="hover:bg-blue-50 dark:hover:bg-blue-900/20">
          <span class="text-gray-700 dark:text-gray-300">Export data</span>
        </DropdownItem>
        <DropdownItem class="hover:bg-red-50 dark:hover:bg-red-900/20">
          <span class="text-red-600 dark:text-red-400">Delete</span>
        </DropdownItem>
      </Dropdown>
    </div>

    <!-- Restaurant Avatar with Glow Effect -->
    <div class="flex justify-center mb-6 relative z-10">
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 scale-110"></div>

        {#if restaurant.image_url}
        <Avatar 
          size="xl" 
          src={restaurant.image_url} 
          class="relative bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-red-500 dark:to-orange-600 transition-all duration-500 group-hover:scale-110 shadow-lg ring-4 ring-white dark:ring-gray-800" 
        />
        {:else}
        <Avatar 
          size="xl" 
          src={food} 
          class="relative bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-red-500 dark:to-orange-600 transition-all duration-500 group-hover:scale-110 shadow-lg ring-4 ring-white dark:ring-gray-800" 
        />
        {/if}


        
        <!-- <Avatar 
          size="xl" 
          src={icon} 
          class="relative bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-red-500 dark:to-orange-600 transition-all duration-500 group-hover:scale-110 shadow-lg ring-4 ring-white dark:ring-gray-800" 
        /> -->

      </div>
    </div>

    <!-- Restaurant Info -->
    <div class="text-center mb-6 relative z-10">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
        {restaurant.name}
      </h3>
      
      <!-- Location with Icon -->
      <div class="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-3">
        <MapPinOutline class="mr-2 text-red-500" size="sm" />
        <span class="text-lg">{restaurant.location}</span>
      </div>
      
      <!-- Cuisine Type Badge -->
      <div class="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-800 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-indigo-200 dark:border-indigo-700">
        {randomCuisine} Cuisine
      </div>

      <!-- Rating and Reviews -->
      <div class="flex items-center justify-center mb-6">
        <div class="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full shadow-lg">
          <StarSolid class="mr-2" size="sm" />
          <span class="font-bold">{rating.toFixed(1)}</span>
          <span class="ml-2 text-yellow-100">({reviewCount} reviews)</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-4 flex flex-col sm:flex-row gap-4 w-full justify-center relative z-10">
      <a use:link href={`/CRestaurant/${restaurant.id}/cuisines`} class="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-center py-3 px-6 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
        See cuisine
      </a>
      <Button color="light" class="w-full sm:w-auto dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 py-3 px-6 rounded-2xl font-medium transition-all duration-300">
        <PhoneOutline class="mr-2" size="sm" />
        Contact
      </Button>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-400/20 to-orange-400/20 dark:from-red-600/20 dark:to-orange-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    <div class="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
  </Card>
</div>