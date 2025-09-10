<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from "flowbite-svelte";
  import { link } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { UserCircleHero } from 'svelte-animated-icons';
  
  // Import the auth store
  import { isAuthorized } from '../../stores/authStore.js';

  // importing components: 
  import Darkmode from "../../components/Darkmode/Darkmode.svelte";
  import NavDropdown from "../Dropdown/NavDropdown.svelte";
  import UserDetails from "../popover/UserDetails.svelte";
  
  // import static content
  import CertGen from "../../assets/Images/landing/nn.png";
  import nn from "../../assets/icons/diet.png";
  
  let pages = [
    { name: "Home", path: "/home" },
    { name: "About", path: "/about" }
  ];

  function showOptionsDrawer(){
    
  }

</script>



<Navbar>
  <NavBrand href="/">
    <img src={nn} class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
    <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
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
      <!-- Guest Navigation -->
      <NavLi>
        <a 
          use:link 
          href="/register" 
          class="block py-1 px-3 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Register
        </a>
      </NavLi>
      <NavLi>
        <a 
          use:link 
          href="/login" 
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200"
        >
          Sign In
        </a>
      </NavLi>
    {:else}
      <!-- Authenticated User Navigation -->
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

    




  </NavUl>
</Navbar>