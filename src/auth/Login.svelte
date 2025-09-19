<!-- Login.svelte -->
<script>
  import { login } from "../stores/authStore.js";
  import { Button, Input, Label, Checkbox, Helper } from "flowbite-svelte";
  import { push } from "svelte-spa-router";
  import { link } from "svelte-spa-router";
  import Error from "../components/Card/AuthCard.svelte";
  import burger from "../assets/icons/burger.png";

  let showError = $state(false);
  let errorMessage = $state("");
  let iconType = $state();
  let isRestaurant = $state(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const loginData = new FormData();

    if (isRestaurant) {
      loginData.append("username", formData.get("gstIN"));
      loginData.append("password", formData.get("password"));
    } else {
      loginData.append("username", formData.get("email"));
      loginData.append("password", formData.get("password"));
    }

    const result = await login(loginData);

    if (result.success) {
      errorMessage = result.message;
      showError = true;
      iconType = "loginSuccess";
      setTimeout(() => push("/protectedHome"), 700);
    } else {
      errorMessage = result.message;
      showError = true;
      iconType = "wrongDetails";
      setTimeout(() => push("/register"), 700);
    }
  }
</script>

<!-- Login.svelte -->
<div class="h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 via-yellow-50 to-orange-200">
  <div class="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-6 px-4">
    
    <!-- Left Side (Login Card) -->
    <div class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 md:p-8 relative z-10">
      <!-- Logo -->
      <h1 class="text-2xl font-extrabold text-orange-600 text-center mb-1">🍴 Foodle</h1>
      <p class="text-center text-gray-500 mb-3">Made with ❤️ for food lovers</p>

      <!-- Toggle -->
      <div class="flex items-center justify-center mb-3">
        <Checkbox bind:checked={isRestaurant} class="text-orange-600">
          Login as restaurant ?
        </Checkbox>
      </div>

      <!-- Form -->
      <form onsubmit={handleSubmit} class="space-y-4">
        {#if isRestaurant}
          <!-- Restaurant Fields -->
          <Label class="block">
            <span class="text-sm font-medium text-gray-700">GSTIN</span>
            <Input type="text" name="gstIN" placeholder="Enter GSTIN" class="mt-1 block w-full rounded-xl" required />
          </Label>

          <Label class="block">
            <span class="text-sm font-medium text-gray-700">Password</span>
            <Input type="password" name="password" placeholder="••••••" class="mt-1 block w-full rounded-xl" required />
          </Label>
        {:else}
          <!-- User Fields -->
          <Label class="block">
            <span class="text-sm font-medium text-gray-700">Email</span>
            <Input type="email" name="email" placeholder="your@email.com" class="mt-1 block w-full rounded-xl" required />
          </Label>

          <Label class="block">
            <span class="text-sm font-medium text-gray-700">Password</span>
            <Input type="password" name="password" placeholder="••••••" class="mt-1 block w-full rounded-xl" required />
          </Label>
        {/if}

        <!-- Submit Button -->
        <Button type="submit" class="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2 text-base">
          {isRestaurant ? "Restaurant Login" : "Login"}
        </Button>
      </form>

      <!-- Register link -->
      <p class="mt-4 text-center text-sm text-gray-600">
        Don’t have an account? 
        <a use:link href="/register" class="text-orange-600 font-semibold hover:underline">Register</a>
      </p>
    </div>

    <!-- Right Side (Food Image) -->
    <div class="hidden md:flex justify-center items-center">
      <img 
        src={burger}
        alt="Delicious Burger" 
        class="w-3/4 drop-shadow-2xl"
      />
    </div>
  </div>

  <!-- Error Modal -->
  {#if showError}
    <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <Error {errorMessage} {iconType} />
    </div>
  {/if}
</div>


