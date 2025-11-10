<script>
  import { onMount, onDestroy, } from 'svelte';
  import {  Alert, Button } from 'flowbite-svelte';
  import {  InfoCircleSolid, EyeSolid  } from 'flowbite-svelte-icons';
  import routesType from "../config/backend_routes.js";
  import { restaurant } from '../stores/authStore.js';
  import { link } from 'svelte-spa-router';

  let notifications = [];
  let eventSource = null;
  let index = null;
  let userType = localStorage.getItem('user_type')

  const orderState = {
    "Pending":      "bg-yellow-500 dark:bg-yellow-500", 
    "Preparing":    "bg-blue-400 dark:bg-blue-700", 
    "Ready":        "bg-purple-400 dark:bg-purple-500", 
    "Delivered":    "bg-green-200 dark:bg-green-700", 
    "Cancelled":    "bg-slate-400 dark:bg-slate-700"
    }
  const userTypeOrderRoute = {
    "user":"/CMy-orders",
    "restaurant":"/ROrderHistory",
  } 

  onMount(() => {
    const token = localStorage.getItem('jwt_token');
    
    // Connect to the new SSE endpoint. We pass the token as a query param.
    // The backend's authentication dependency needs to be able to read this.
    const url = `http://localhost:8000/order/notifications/stream?token=${token}`;
    eventSource = new EventSource(url);

    // This is called every time the server sends a message
    eventSource.onmessage = (event) => {
      const notificationObject = JSON.parse(event.data);
      notifications = [notificationObject, ...notifications];
    };

    // Handle connection errors (the browser will try to reconnect automatically!)
    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };
  });

  // Clean up the connection when the user leaves the page
  onDestroy(() => {
    if (eventSource) {
      eventSource.close();
    }
  });
</script>



{#if notifications.length > 0}
    <ul class="mt-2 space-y-2">
    {#each notifications as notification}
        <li >
            {#if notification.receiver === userType }
                <Alert class=" {orderState[`${notification.status}`]}" dismissable  >
                    <div class="flex items-center gap-3">
                        <InfoCircleSolid class="h-5 w-5" />
                        <span class="text-lg font-medium text-gray-600 dark:text-gray-200 ">ALERT Order is {notification.status} now </span>
                    </div>
                    <p class="mt-2 mb-4 text-sm text-gray-600 dark:text-gray-200 ">{notification.payload.message}</p>
                    <div class="flex gap-2">
                      <a a use:link href="{userTypeOrderRoute[`${notification.receiver}`]}">
                        <Button size="xs"><EyeSolid class="me-2 h-4 w-4" />See your Orders</Button>
                      </a>
                    </div>
                </Alert> 
            {/if}
        </li>
    {/each}
    </ul>
{/if}