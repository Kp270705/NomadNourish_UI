

<script lang="ts">
  import { Section } from "flowbite-svelte-blocks";
  import { Label, Input, Button, Select, Textarea } from "flowbite-svelte";
  import { push, link, loc } from "svelte-spa-router";

  import routesType from "../../config/backend_routes";

  async function handleSubmit(e){
    e.preventDefault();
    const token = localStorage.getItem("jwt_token")
    const form = e.target;
    const formData = new FormData(form);
    const cuisineData = Object.fromEntries(formData.entries());
    try{
      const response = await fetch(`${routesType.current_route}/cuisine/register`,
        {
          method:"POST",
          // headers:{"Content-Type":"application/json"},
          headers: { Authorization: `Bearer ${token}` },
          body:JSON.stringify(cuisineData),
          credentials:"include",
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      alert("Form submited successfully.");

    }catch(err){
      const error = err.message;
      console.log(`Error: ${error}`)
      alert(`Error: ${error}`)
    }
    finally{
      push("/RHome")
    }
    
  };

  let selected = $state();
  let countries = [
    { value: "tv", name: "TV/Monitors" },
    { value: "pc", name: "PC" },
    { value: "phone", name: "Phones" }
  ];

</script>

<Section name="crudcreateform">
  <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new cuisine</h2>
  <form onsubmit={handleSubmit}>
    <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
      <div class="sm:col-span-2">
        <Label for="name" class="mb-2">Cuisine Name</Label>
        <Input type="text" id="name" placeholder="Type cuisine name" required />
      </div>
      <div class="w-full">
        <Label for="price" class="mb-2">Price</Label>
        <Input type="text" id="price" placeholder="$10" required />
      </div>
      <div class="w-full lg:col-span-2 ">
          <Button type="submit" class="w-32 lg:w-35">Add Cuisine</Button>
      </div>
    </div>
  </form>
</Section>

