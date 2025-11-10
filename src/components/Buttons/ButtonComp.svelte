<script lang="ts">
  import { Button } from "flowbite-svelte";

  // Props
  export let btnType: "button" | "submit" | "reset" = "button"; // valid flowbite button types
  export let btnClass = null;
  export let btnDisable: true | false = false; 
  export let btnName =null;
</script>

<!-- Use proper prop binding -->
<Button type={btnType} class={btnClass} disabled={btnDisable} >
  {btnName}
</Button>
