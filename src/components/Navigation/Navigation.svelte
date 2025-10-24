<script>
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, GradientButton, Dropdown, DropdownItem, Modal, DarkMode } from "flowbite-svelte";
  import { ChevronDownOutline} from "flowbite-svelte-icons";
  import { link, push } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { scale, blur } from "svelte/transition";

  // Import the auth store
  import { isAuthorized, checkAuth, logout } from '../../stores/authStore.js';

  // importing components: 
  import UserDetails from "../popover/UserDetails.svelte";  
  import CancelModal from "../alert/CancelModal.svelte";

  // import static content
  import nn from "../../assets/icons/diet.png";
  import UserColors from "../../utils/customers/colours.js";
  
  const user_type = localStorage.getItem("user_type");
  let pages = [
    { name: "Home", path: "/protectedHome" },
    { name: "About", path: "/about" }
  ];

  const colorStyle = new UserColors;
  let showCancelModal = false;


  function promptToCancel() {
    showCancelModal = true;
  }
  function confirmCancel() {
    logout();
    closeModal();
  }
  function closeModal() {
    showCancelModal = false;
  }

  onMount(async () => {
    await checkAuth()
  });


</script>

<CancelModal 
  bind:popupModal={showCancelModal}
  message="Are you sure you want to logout?"
  onConfirm={confirmCancel}
  onCancel={closeModal}
/>

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
      <DarkMode class=" {colorStyle.darkModeBtn()} " />

    <!-- More Dropdown -->
    <div class="relative">

      <Button class=" {colorStyle.navMoreBtn()} ">
        More 
        <ChevronDownOutline class="ml-2 h-4 w-4" />
      </Button>

      <Dropdown class=" {colorStyle.dropDownStyle()} " transition={scale} transitionParams={{ duration: 1 }}>
        {#if $isAuthorized}
          <DropdownItem class=" {colorStyle.dropDownItemStyle()} " >
            <Button class=" {colorStyle.signOutBtn} " onclick={() => promptToCancel() } >
              SignOut
            </Button>
          </DropdownItem>
          {#if user_type == 'user'}
            <DropdownItem class=" {colorStyle.dropDownItemStyle()} ">
              <a href="/CMy-orders" use:link class="w-full">
                <GradientButton color="tealToLime" class=" {colorStyle.myOrdrdGrdBtnStyle()} ">
                  My Orders
                </GradientButton>
              </a>
            </DropdownItem>
          {/if}

        {:else}
          <DropdownItem class=" {colorStyle.dropDownItemStyle()} " >
            <a href="/login" use:link class="w-full">
              <GradientButton color="cyanToBlue" class="w-full justify-center font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Sign In
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