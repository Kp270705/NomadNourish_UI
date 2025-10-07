<script>
    import { Button } from "flowbite-svelte";
    import { ArrowLeftOutline, ArrowRightOutline } from "flowbite-svelte-icons";
    import Move from "../../utils/moveOsc";
    import { link } from "svelte-spa-router";

    export let heading;
    export let route;
    export let routeName;
    export let routeLink;

    async function navBack() {
        const mvObj = new Move();
        let nvb = mvObj.goBack() 
        return nvb  
    }


</script>    
    
<div class="relative pt-12 pb-8 text-center">
    <Button 
        onclick={navBack} 
        class="absolute top-0 left-0 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white" >
        <ArrowLeftOutline class="w-5 h-5 mr-2" /> Back
    </Button>

    <h1 class="text-4xl font-extrabold text-orange-500">
    {heading}
    </h1>
    {#if route}
    <a use:link href="{routeLink}" class="absolute top-0 right-0">
        <Button class=" hover:bg-orange-600 font-bold flex items-center gap-2">
            <!-- <PencilOff size={20} color="#d4ddf2" />
          <CirclePlusSolid class="shrink-0 h-6 w-6" /> -->
          {routeName} <ArrowRightOutline class="w-5 h-5 mr-2" />
        </Button>
      </a>
    {/if }
  
</div>