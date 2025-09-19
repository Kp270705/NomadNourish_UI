<script>
  import { HeroHeader } from "flowbite-svelte-blocks";
  import { Button, Card } from "flowbite-svelte";
  import { ArrowRightOutline, GithubSolid, LinkedinSolid, InstagramSolid, SearchOutline, RedditSolid, CartSolid, StarSolid } from "flowbite-svelte-icons";
  import { link } from 'svelte-spa-router';

  // Importing a food-related background image
  import heroBg from "../assets/Images/landing/pbm.jpg";
  import menuOrdering from "../assets/Images/landing/menuOrdering.jpg"
  import hotelSearch from "../assets/Images/landing/hotelSearch.png"

</script>

<div class="relative min-h-screen flex items-center justify-center bg-cover bg-center" style="background-image: url('{heroBg}')">
  <div class="absolute inset-0 bg-black/60 dark:bg-gray-900/70 backdrop-blur-sm transition-colors duration-300"></div>
  <div class="relative text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
    <HeroHeader h1Class="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 text-white drop-shadow-lg" pClass="text-xl sm:text-2xl text-gray-200 dark:text-gray-300 font-light max-w-2xl mx-auto">
      {#snippet h1()}Nomad Nourish{/snippet}
      {#snippet paragraph()}Your ultimate guide to local flavors. Find nearby restaurants, cafes, and dishes with just one click.{/snippet}
    </HeroHeader>
    <div class="mt-8 flex justify-center gap-4">
      <a use:link href="/login">
        <Button size="lg" color="amber" class="duration-600 hover:scale-110 font-semibold px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
          Get Started <ArrowRightOutline size="md" class="-mr-1 ml-2" />
        </Button>
      </a>
    </div>
  </div>
</div>

<div class="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <section class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
      <div class="order-2 md:order-1">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Discover Local Flavors Instantly
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-lg mb-6">
          Whether you're exploring a new city or just looking for a quick bite, Nomad Nourish helps you find the best restaurants and cafes near you in seconds.
        </p>
        <a use:link href="/CHome">
          <Button size="lg" color="light" class="transition duration-300 font-medium px-8 py-3 rounded-lg dark:text-gray-200">
            <SearchOutline size="sm" class="mr-2" />
            Explore Restaurants
          </Button>
        </a>
      </div>
      <div class="order-1 md:order-2">
        <img src={hotelSearch} height="300" width="500" alt="Restaurant Search" class="rounded-3xl shadow-2xl" />
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div>
        <img src={menuOrdering} height="300" width="500" alt="Menu & Ordering" class="rounded-3xl shadow-2xl" />
      </div>
      <div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Browse Menus and Place Orders
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-lg mb-6">
          Dive into detailed menus, customize your order, and get a total cost estimate. Your next delicious meal is just a few clicks away.
        </p>
        <a use:link href="/protectedHome">
          <Button size="lg" color="light" class="transition duration-300 font-medium px-8 py-3 rounded-lg dark:text-gray-200">
            <!-- <ShoppingCartSolid size="sm" class="mr-2" /> -->
             <CartSolid class="shrink-0 h-6 w-6" />
            View Your Orders
          </Button>
        </a>
      </div>
    </section>

  </div>
</div>

<div class="py-10 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
  <div class="max-w-7xl mx-auto text-center">
    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Connect with us</h3>
    <div class="flex justify-center gap-8 text-gray-500 dark:text-gray-400">
      <a href="https://github.com/Kp270705" target="_blank"><GithubSolid size="xl" class="duration-600 hover:scale-125 text-gray-700 dark:text-gray-300"/></a>
      <a href="https://www.linkedin.com/in/kunal-pathak-162929237" target="_blank"><LinkedinSolid size="xl" class="duration-600 hover:scale-125 text-blue-500 dark:text-blue-400" /></a>
      <a href="https://www.instagram.com/kunalpathak_847/" target="_blank"><InstagramSolid size="xl" class="duration-600 hover:scale-125 text-pink-500 dark:text-pink-400"/></a>
      <a href="https://www.reddit.com/user/Sudden_Complaint_837/" target="_blank"><RedditSolid size="xl" class="duration-600 hover:scale-125 text-orange-500 dark:text-orange-400" /></a>
    </div>
  </div>
</div>