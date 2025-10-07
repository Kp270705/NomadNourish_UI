<script>
  import { DotsHorizontalOutline, StarSolid, MapPinOutline, PhoneOutline, ClockOutline } from "flowbite-svelte-icons";
  import { Card, Dropdown, DropdownItem, Avatar, Button,Badge } from "flowbite-svelte";
  import { link } from 'svelte-spa-router';
  import food from "../../assets/icons/food1.png";

  export let restaurant;
  


  $: change_color = restaurant.operating_status?.toLowerCase() === "open" ? "bg-green-600 text-white" : "bg-red-500 text-white";
  
  $: cardStyle = restaurant.operating_status?.toLowerCase() === "open" 
  ? "bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-gray-100 dark:border-gray-700 hover:border-slate-400 dark:hover:border-slate-900 hover:shadow-2xl transition-all duration-500 shadow-lg " 
  : "bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-gray-50 dark:border-gray-500 hover:border-gray-200 dark:hover:border-gray-500";
  
  $: change_card_hover = restaurant.operating_status?.toLowerCase() === "open" ? "from-gray-400/5 to-gray-400/5 dark:from-slate-600/10 dark:to-slate-600/10 opacity-0 group-hover:opacity-100" : "from-gray-400/5 to-gray-400/5 dark:from-gray-500/10 dark:to-gray-300/10 opacity-0 group-hover:opacity-100";

  $: change_avatar_style = restaurant.operating_status?.toLowerCase() === "open" ? "from-red-500 to-orange-500 scale-110 opacity-20 " : "from-gray-300 to-orange-300 opacity-20 ";
  $:image_url= restaurant.image_url? restaurant.image_url : food

  $:name_decor = restaurant.operating_status?.toLowerCase() === "open" ? "text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-500" : "text-gray-300 dark:text-gray-600 mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-200 ";

  $:traffic_design = (() => {
    if (restaurant.operating_status === "Open" ){
      if(restaurant.kitchen_status === "Normal"){
        return "bg-orange-500 text-white";
      }
      else if(restaurant.kitchen_status == "Busy"){
        return "bg-yellow-500 text-white";
      }
      else if (restaurant.kitchen_status === "Emergency" ){
        return "bg-red-600 text-white";
      }
    }
    else{
      return "bg-gray-400 text-black";
    }
  })();

  $:see_cuisine_button = restaurant.operating_status?.toLowerCase() === "open" ? "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" : "from-red-400 to-red-500 hover:from-red-400 hover:to-red-600"
  $:contact_button = restaurant.operating_status?.toLowerCase() === "open" ? "dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400" : "dark:text-white bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 opacity-50 cursor-not-allowed "

  console.log(`color is:${change_color}`)

</script>

<div class="group w-96">
  <Card class="relative flex flex-col items-center justify-between rounded-3xl p-8 {cardStyle} border overflow-hidden h-full">
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br {change_card_hover} transition-opacity duration-500 pointer-events-none"></div>

    <!-- Restaurant Avatar with Glow Effect -->
    <div class="flex justify-center mb-6 relative z-10">
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r {change_avatar_style} rounded-full transition-opacity duration-500 "></div>
        <Avatar 
          size="xl" 
          src={image_url} 
          class="relative bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-red-500 dark:to-orange-600 transition-all duration-500 group-hover:scale-110 shadow-lg ring-4 ring-white dark:ring-gray-800" 
        />
      </div>
    </div>

    <!-- Restaurant Info -->
    <div class="text-center mb-6 relative z-10 w-full">
      <h3 class="text-2xl font-bold {name_decor} transition-colors duration-300">
        {restaurant.name}
      </h3>
      
      <!-- Location with Icon -->
      <div class="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-3 min-h-[4rem]">
        <MapPinOutline class="mr-2 text-red-500 flex-shrink-0" size="sm" />
        <span class="text-lg line-clamp-2">{restaurant.location}</span>
      </div>

      <div class="inline-block {traffic_design} px-4 py-2 rounded-full font-bold mb-4 border border-indigo-200 dark:border-indigo-700">
         {#if restaurant.operating_status === "Open" }
          Traffic: {restaurant.kitchen_status}
          {:else}
          Hotel Closed
         {/if}

      </div>

      <!-- Status check -->
      <div class="flex items-center justify-center mb-6">
        <div class="flex items-center {change_color} px-4 py-2 rounded-full shadow-lg">
           <ClockOutline class="w-6 h-6 text-gray-900 dark:text-slate-800" />
          <span class="ml-2 font-bold ">{restaurant.operating_status}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-4 flex flex-col sm:flex-row gap-4 w-full justify-center relative z-10">
      <a use:link href={`/CRestaurant/${restaurant.id}/cuisines`} class="w-full sm:w-auto bg-gradient-to-r {see_cuisine_button} text-white text-center py-3 px-6 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
        See cuisine
      </a>
      <Button color="light" class="w-full sm:w-auto {contact_button} py-3 px-6 rounded-2xl font-medium transition-all duration-300">
        <PhoneOutline class="mr-2" size="sm" />
        Contact
      </Button>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-400/20 to-orange-400/20 dark:from-red-600/20 dark:to-orange-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    <div class="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 dark:from-blue-600/20 dark:to-indigo-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
  </Card>
</div>