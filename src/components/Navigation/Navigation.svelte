<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, GradientButton, Dropdown, DropdownItem, Modal } from "flowbite-svelte";
  import { ChevronDownOutline, UserRemoveOutline} from "flowbite-svelte-icons";
  import {DarkMode} from "flowbite-svelte";
  import { link, push } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { UserCircleHero } from 'svelte-animated-icons';
  import { scale, blur } from "svelte/transition";

  // Import the auth store
  import { isAuthorized, checkAuth, logout } from '../../stores/authStore.js';

  // importing components: 
  import UserDetails from "../popover/UserDetails.svelte";  

  // import static content
  import nn from "../../assets/icons/diet.png";
  import UserColors from "../../utils/customers/colours.js";
  
  const user_type = localStorage.getItem("user_type");
  let pages = [
    { name: "Home", path: "/protectedHome" },
    { name: "About", path: "/about" }
  ];
  
  let defaultModal = false;
  const handleCancel = () => { 
  };
  const handleDelete = () => {
    logout()
  };

  function showOptionsDrawer(){
  }

  const colorStyle = new UserColors;

  onMount(async () => {
    await checkAuth()
  });

</script>

<Navbar class=" {colorStyle.navbarStyle()} ">
  <NavBrand href="/" class=" {colorStyle.navBrandStyle()} ">
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

      <DarkMode class=" {colorStyle.darkModeBtn()} " />

    <!-- More Dropdown -->
    <div class="relative">

      <Button class=" {colorStyle.navMoreBtn()} ">
        More 
        <ChevronDownOutline class="ml-2 h-4 w-4" />
      </Button>

      <Dropdown class=" {colorStyle.dropDownStyle()} " transition={scale} transitionParams={{ duration: 200 }}>
        {#if $isAuthorized}
          <DropdownItem class=" {colorStyle.dropDownItemStyle()} ">
            <Button class=" {colorStyle.signOutBtn} " onclick={() => (defaultModal = true)} >
              SignOut
            </Button>

            <Modal title="" bind:open={defaultModal} autoclose size="sm" class="w-full">
              <svg
                class="mx-auto mb-3.5 h-11 w-11 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>


              <p class="mb-4 text-center text-gray-500 dark:text-gray-300">Are you sure you want to signout?</p>
              <div class="flex items-center justify-center space-x-4">
                <Button color="light" onclick={handleCancel}>No, cancel</Button>
                <Button color="red" onclick={handleDelete}>Yes, I'm sure</Button>
              </div>
            </Modal>

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
          <DropdownItem class=" {colorStyle.dropDownItemStyle()} ">
            <a href="/CMy-orders" use:link class="w-full">
              <GradientButton color="tealToLime" class=" {colorStyle.myOrdrdGrdBtnStyle()} ">
                My Orders
              </GradientButton>
            </a>
          </DropdownItem>
        {/if}
      </Dropdown>
    </div>

    <!-- Mobile Hamburger -->
    <NavHamburger class=" {colorStyle.navHamburgerStyle()} " />
  </div>

  <NavUl class=" {colorStyle.navUlStyle() } ">
    {#each pages as page}
      <NavLi class="group">
        <a use:link href={page.path} class=" {colorStyle.navLiLinkStyle()} " >
          {page.name}
        </a>
      </NavLi>
    {/each}
    {#if !$isAuthorized}
      <NavLi>
        <a use:link href="/test-credentials">
          <GradientButton color="purpleToPink">Test Data</GradientButton>
        </a>
      </NavLi>
    {:else}
      <NavLi>
        <UserDetails />
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