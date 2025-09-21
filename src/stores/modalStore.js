import { writable } from 'svelte/store';

export const isSignoutModalOpen = writable(false);
isSignoutModalOpen.subscribe(value => {
  console.log("Signout modal is now", value ? "open" : "closed");
});