
<script>
  import { Popover, Button, Avatar } from "flowbite-svelte";
  import routesType from "../../config/backend_routes";
  import { FaceExplodeSolid } from "flowbite-svelte-icons";
  
  import { user, userType } from "../../stores/authStore";
  import FormDrawer from "../Drawer/FormDrawer.svelte";
  
  import usericon from "../../assets/icons/user2.png";
  
  let open1 = false;
  $: userName = $user.name;
  $: userEmail = $user.email;
  $: userImageUrl = $user.image_url;

  console.log(`user name: ${$user.name}`);
  console.log(`user email: ${$user.email}`);
  console.log(`user image url: ${$user.image_url}`);
  console.log(`user type from store: ${$userType}`);


</script>


<Popover class="w-64 bg-white text-sm font-light text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
  <div class="p-3">
    <div class="mb-2 flex items-center justify-between">
      {#if userImageUrl}
        <Avatar href="/" src={userImageUrl} alt="User Avatar" class="duration-600 hover:scale-250"/>
      {:else}
        <Avatar href="/" src={usericon} alt="Default Avatar" class="duration-600 hover:scale-250"/>
      {/if}
      <Button size="xs" onclick={()=>{open1=true}}>Edit Details</Button>
    </div>
    <div class="text-base leading-none font-semibold text-gray-900 dark:text-white">
      <a href="/">{userName}</a>
    </div>
    <div class="mb-3 text-sm font-normal">
      <a href="/" class="hover:underline">{userEmail}</a>
    </div>
    <ul class="flex text-sm font-light">
      <li class="me-2">
        <a href="/" class="hover:underline">
          <span class="font-semibold text-gray-900 dark:text-white">799</span>
          <span>Following</span>
        </a>
      </li>
      <li>
        <a href="/" class="hover:underline">
          <span class="font-semibold text-gray-900 dark:text-white">3,758</span>
          <span>Followers</span>
        </a>
      </li>
    </ul>
  </div>
</Popover>

<FormDrawer bind:open1 />