
<script>
  import { Button, Modal } from "flowbite-svelte";

  // PROPS the parent will provide
  export let popupModal = false;
  export let message = 'Are you sure? This action cannot be undone.';
  
  // These are functions passed down from the parent
  export let onConfirm = () => {};
  export let onCancel = () => {};
</script>

<Modal title="" bind:open={popupModal} onclose={onCancel} autoclose={false} size="sm" class="w-full">
  <svg class="mx-auto mb-4 h-12 w-12 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>

  <p class="mb-5 text-center text-lg font-normal text-gray-500 dark:text-gray-400">{message}</p>
  
  <div class="flex items-center justify-center space-x-4">
    <Button color="light" onclick={onCancel}>No, go back</Button>
    <Button color="red" onclick={onConfirm}>Yes, I'm sure</Button>
  </div>
</Modal>