<script lang="ts">
  import { Section } from "flowbite-svelte-blocks";
  import { Label, Input, Button } from "flowbite-svelte";
  import { push } from "svelte-spa-router";

  import routesType from "../../config/backend_routes";
  
  async function handleSubmit(e){
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    const form = e.target;
    const formData = new FormData(form);
    
    // Create a JSON object with the correct keys
    const cuisineData = {
      cuisine_name: formData.get("cuisine_name") as string,
      cuisine_price: parseFloat(formData.get("cuisine_price") as string), // Convert to float
    };
    
    try{
      const response = await fetch(`${routesType.current_route}/cuisine/register`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", // Crucial for Pydantic
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(cuisineData),
          credentials:"include",
        }
      );
      if (!response.ok) {
        throw new Error('Failed to register cuisine');
      }
      alert("Cuisine added successfully.");

    }catch(err){
      const error = err.message;
      console.log(`Error: ${error}`);
      alert(`Error: ${error}`);
    } finally {
      push("/RHome");
    }
  };
</script>

<div class="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 flex items-center justify-center py-12">
  <div class="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
    <div class="text-center mb-8">
      <div class="text-6xl mb-4">
        🍕
      </div>
      <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white">
        Add a new cuisine
      </h2>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        Fill in the details for your delicious new dish.
      </p>
    </div>

    <form onsubmit={handleSubmit} class="space-y-6">
      <div>
        <Label for="cuisine_name" class="mb-2 text-gray-700 dark:text-gray-300">Cuisine Name</Label>
        <Input 
          type="text" 
          name="cuisine_name" 
          id="cuisine_name" 
          placeholder="e.g., Spicy Pizza" 
          required 
          class="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-red-400"
        />
      </div>
      <div>
        <Label for="cuisine_price" class="mb-2 text-gray-700 dark:text-gray-300">Price (₹)</Label>
        <Input 
          type="number" 
          name="cuisine_price" 
          id="cuisine_price" 
          placeholder="e.g., 250" 
          step="0.01" 
          required 
          class="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-red-400"
        />
      </div>
      <Button 
        type="submit" 
        class="w-full h-12 text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all duration-300 rounded-lg shadow-lg"
      >
        Add Cuisine
      </Button>
    </form>
  </div>
</div>