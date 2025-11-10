<!-- Protected.svelte:  -->

<script>

  import { push } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { CardPlaceholder, ImagePlaceholder, VideoPlaceholder, TextPlaceholder } from "flowbite-svelte";
  import { Toast } from "flowbite-svelte";
  import { CheckCircleSolid } from "flowbite-svelte-icons";
  import { Heading } from "flowbite-svelte";

  import C_Home from "../pages/Customer/C_Home.svelte";
  import RHome from '../pages/Restaurants/R_Home.svelte';
  import EditDetails from '../pages/Restaurants/R_EditDetails.svelte';
  import { isAuthorized, checkAuth } from "../stores/authStore.js";
  

  let successToast = false; // whether toast is visible
  let toastShown = false;   // prevent showing twice in same session
  const user_type = localStorage.getItem("user_type");

  $: currentIsAuthorized = $isAuthorized;
  // Check if we should show toast
  if (sessionStorage.getItem('showLoginToast') === 'true') {
    toastShown = true;
    sessionStorage.removeItem('showLoginToast'); // remove so it won't show again
  }


  const AuthErrors = {
    TOKEN_EXPIRED: 401,
    MISSING_TOKEN:401,
    INVALID_TOKEN: 422,
  };
    onMount(async () => {
    await checkAuth()
    });

</script>


{#if !currentIsAuthorized}
      <Heading  tag="h6" class="mt-0 mb-10 text-blue-400 dark:text-yellow-300 uppercase italic underline text-center font-semibold bg-gray-50 dark:bg-gray-700 p-4" >
       Please login first ...
     </Heading>
      <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
       {#each {length: 6} as _, i}
        <div class="justify-self-center">
          <CardPlaceholder />
        </div>
       {/each}
      </div>
    {:else}
  <div class={!currentIsAuthorized ? "blur-sm pointer-events-none select-none transition-all duration-300" : ""}>
    {#if $isAuthorized}

    <!-- successToast: -->
      {#if successToast}
      <div class="fixed top-4 left-1/2 transform -translate-x-1/2  z-50">
        <Toast color="green">
          {#snippet icon()}
            <CheckCircleSolid class="h-15 w-15" />
            <span class="sr-only">Check icon</span>
          {/snippet}
          Logged-in successfully.
        </Toast>
      </div>
      {/if}
      {#if user_type == "user"}
        <C_Home />
      {/if}
      {#if user_type == "restaurant"}
        <!-- <EditDetails /> -->
        <RHome />
      {/if}
    {/if}
  </div>

{/if}