<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, GradientButton, Dropdown, DropdownItem } from "flowbite-svelte";
  import { ChevronDownOutline} from "flowbite-svelte-icons";
  import {DarkMode} from "flowbite-svelte";
  import { link, push } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { UserCircleHero } from 'svelte-animated-icons';
  import { scale, blur } from "svelte/transition";

  // Import the auth store
  import { isAuthorized, checkAuth, logout } from '../../stores/authStore.js';

  // importing components: 
  import Darkmode from "../../components/Darkmode/Darkmode.svelte";
  import NavDropdown from "../Dropdown/NavDropdown.svelte";
  import UserDetails from "../popover/UserDetails.svelte";
  import OrderHistory from "../../pages/Customer/C_OrderHistory.svelte";
  
  // import static content
  import nn from "../../assets/icons/diet.png";
  
  const user_type = localStorage.getItem("user_type");
  let pages = [
    { name: "Home", path: "/protectedHome" },
    { name: "About", path: "/about" }
  ];
  

  function showOptionsDrawer(){
    
  }

  onMount(async () => {
    await checkAuth()
  });

</script>

<Navbar class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg sticky top-0 z-50 transition-all duration-300">
  <NavBrand href="/" class="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
    <div class="relative">
      <img src={nn} class="h-8 w-8 sm:h-10 sm:w-10 rounded-full shadow-md" alt="NomadNourish Logo" />
      <div class="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
    </div>
    <span class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent hover:from-pink-500 hover:to-orange-500 transition-all duration-300">
      NomadNourish
    </span>
  </NavBrand>

  <div class="flex md:order-2 items-center space-x-2">
    <!-- Dark Mode Toggle -->
    <div class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
      <DarkMode class="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200" />
    </div>

    <!-- More Dropdown -->
    <div class="relative">
      <Button class="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
        More 
        <ChevronDownOutline class="ml-2 h-4 w-4" />
      </Button>
      <Dropdown class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 mt-2 min-w-48" transition={scale} transitionParams={{ duration: 200 }}>
        {#if $isAuthorized}
          <DropdownItem class="hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg m-1 transition-colors duration-200">
            <Button 
            color="red" 
            class="w-full justify-center font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onclick={logout}
            >
              SignOut
            </Button>
          </DropdownItem>
        {:else}
          <DropdownItem class="hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg m-1 transition-colors duration-200">
            <a href="/login" use:link class="w-full">
              <GradientButton color="cyanToBlue" class="w-full justify-center font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Sign In
              </GradientButton>
            </a>
          </DropdownItem>
        {/if}
        
        {#if user_type == 'user'}
          <DropdownItem class="hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg m-1 transition-colors duration-200">
            <a href="/CMy-orders" use:link class="w-full">
              <GradientButton color="tealToLime" class="w-full justify-center font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                My Orders
              </GradientButton>
            </a>
          </DropdownItem>
        {/if}
      </Dropdown>
    </div>

    <!-- Mobile Hamburger -->
    <NavHamburger class="md:hidden text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200" />
  </div>

  <NavUl class="order-1 md:flex md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent">
    {#each pages as page}
      <NavLi class="group">
        <a 
          use:link 
          href={page.path} 
          class="block py-3 px-4 text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-all duration-300 relative overflow-hidden rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
        >
          {page.name}
          <span class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
        </a>
      </NavLi>
    {/each}
    {#if !$isAuthorized}
    <NavLi>
      <a use:link href="/test-credentials">
        <GradientButton color="purpleToPink">Test Data</GradientButton>
      </a>
    </NavLi>
    {/if}
  </NavUl>
</Navbar>

<style>
  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    :global(.navbar-brand span) {
      font-size: 1.25rem;
    }
    
    :global(.navbar-brand img) {
      height: 2rem;
      width: 2rem;
    }
  }
  
  /* Smooth scrollbar for dropdown on mobile */
  @media (max-width: 640px) {
    :global(.dropdown-content) {
      max-height: 60vh;
      overflow-y: auto;
    }
  }
</style>