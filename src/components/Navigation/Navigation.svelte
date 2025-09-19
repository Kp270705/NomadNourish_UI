<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from "flowbite-svelte";
  import {DarkMode} from "flowbite-svelte";
  import { link } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { UserCircleHero } from 'svelte-animated-icons';
  
  // Import the auth store
  import { isAuthorized, checkAuth } from '../../stores/authStore.js';

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



<Navbar>
  <NavBrand href="/">
    <img src={nn} class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
    <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">NomadNourish</span>
  </NavBrand>
  <div class="flex md:order-2">
    <Button size="sm" onclick={showOptionsDrawer} >Get started</Button>
    <NavHamburger />
  </div>
  <NavUl class="order-1">
    {#each pages as page}
    <NavLi>
      <a use:link href={page.path} class="block py-2 px-3 text-blue-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">{page.name}</a>
    </NavLi>
    {/each}

    <!-- Auth Section -->
    {#if !$isAuthorized}
      <NavLi>
        <a 
          use:link 
          href="/login" 
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200"
        >
          Sign In
        </a>
      </NavLi>
    {:else if user_type=="user"}
      <!-- Authenticated User Navigation -->
      <NavLi>
        <a href="/CMy-orders" use:link class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200" >
          My Orders
        </a>
      </NavLi>
      <NavLi class="relative">
        <div class="flex items-center space-x-2">
          <UserCircleHero
            size={28}
            color="#3b82f6"
            class="cursor-pointer transition-transform duration-200 hover:scale-110"
          />
          <UserDetails />
        </div>
      </NavLi>
    {/if}

    <NavLi>
      <DarkMode class="text-primary-500 dark:text-primary-600 border dark:border-gray-800" />
    </NavLi>


  </NavUl>
</Navbar>