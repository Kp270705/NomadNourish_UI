<!-- Register.svelte -->
<script>
  import routesType from "../config/backend_routes.js";
  
  // Flowbite components
  import { Card, Button, Label, Input, Checkbox, Helper } from "flowbite-svelte";
  
  // Router
  import { push, link } from "svelte-spa-router";
  
  // Error Card
  import Error from "../components/Card/AuthCard.svelte";
  
  // States
  let showError = $state(false);
  let errorMessage = $state("");
  let iconType = $state();
  
  // Checkbox state
  let isRestaurant = $state(false);
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const endpoint = isRestaurant 
        ? `${routesType.current_route}/restaurant/register` 
        : `${routesType.current_route}/user/register`;
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      const result = await response.json();
      
      if (response.status === 400) {
        setTimeout(() => {
          push("/register");
        }, 700);
        errorMessage = result.detail;
        showError = true;
        iconType = "userAlreadyFound";
        return;
      } else if (response.status === 200) {
        setTimeout(() => {
          push("/login");
        }, 700);
        errorMessage = "Registered successfully 🎉 🎉";
        showError = true;
        iconType = "registerSuccess";
        return;
      } else if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`);
      }
    } catch (err) {
      console.error("❌ Register error:", err);
      errorMessage = `${err.message}. Server unavailable.`;
      setTimeout(() => {
        push("/register");
      }, 700);
      showError = true;
      iconType = "serverNotAvailable";
      return;
    }
  }
</script>

<!-- Main container with proper spacing for fixed header/footer -->
<div class="flex items-center justify-center min-h-full py-8">
  <!-- Centering container -->
  <div class="w-full max-w-lg mx-4">
    <Card class="shadow-lg relative">
      <!-- Form content -->
      <div class={`p-6 transition-all duration-300 ${showError ? 'blur-md pointer-events-none' : ''}`}>
        <form class="space-y-4" onsubmit={handleSubmit}>
          <!-- Header -->
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Register Account</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Create your new account</p>
          </div>

          <!-- Restaurant Toggle -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <Checkbox bind:checked={isRestaurant} class="mb-2">
              Are you a restaurant?
            </Checkbox>
            <Helper class="text-xs text-gray-500">
              {isRestaurant ? 'Fill in restaurant details below' : 'Fill in personal details below'}
            </Helper>
          </div>

          <!-- Conditional Form Fields -->
          <div class="space-y-4">
            {#if isRestaurant}
              <!-- Restaurant Fields -->
              <div class="grid gap-4">
                <Label class="space-y-1">
                  <span class="text-sm font-medium">Hotel Name</span>
                  <Input 
                    type="text" 
                    name="name" 
                    placeholder="Enter your hotel name" 
                    class="focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </Label>

                <Label class="space-y-1">
                  <span class="text-sm font-medium">Hotel Password</span>
                  <Input 
                    type="password" 
                    name="password" 
                    placeholder="Create a secure password" 
                    class="focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </Label>

                <Label class="space-y-1">
                  <span class="text-sm font-medium">Hotel Location</span>
                  <Input 
                    type="text" 
                    name="location" 
                    placeholder="City, State, Country" 
                    class="focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </Label>

                <Label class="space-y-1">
                  <span class="text-sm font-medium">Owner Contact Number</span>
                  <Input 
                    type="tel" 
                    name="mobile_number" 
                    placeholder="+91 98765 43210" 
                    class="focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </Label>

                <Label class="space-y-1">
                  <span class="text-sm font-medium">GSTIN Number</span>
                  <Input 
                    type="text" 
                    name="gstIN" 
                    placeholder="22AAAAA0000A1Z5" 
                    class="focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </Label>
              </div>
            {:else}
              <!-- User Fields -->
              <div class="grid gap-4">
                <Label class="space-y-1">
                  <span class="text-sm font-medium">Username</span>
                  <Input 
                    type="text" 
                    name="username" 
                    placeholder="Choose a username" 
                    class="focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </Label>

                <Label class="space-y-1">
                  <span class="text-sm font-medium">Email Address</span>
                  <Input 
                    type="email" 
                    name="email" 
                    placeholder="your.email@example.com" 
                    class="focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </Label>

                <Label class="space-y-1">
                  <span class="text-sm font-medium">Password</span>
                  <Input 
                    type="password" 
                    name="password" 
                    placeholder="Create a secure password" 
                    class="focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </Label>
              </div>
            {/if}
          </div>

          <!-- Submit Button -->
          <Button 
            type="submit" 
            class="w-full mt-6 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3"
          >
            {isRestaurant ? 'Register Restaurant' : 'Create Account'}
          </Button>

          <!-- Login Link -->
          <div class="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?
              <a
                use:link
                href="/login"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline ml-1"
              >
                Sign in here
              </a>
            </span>
          </div>
        </form>
      </div>

      <!-- Error Modal -->
      {#if showError}
        <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <Error {errorMessage} {iconType} />
        </div>
      {/if}
    </Card>
  </div>
</div>