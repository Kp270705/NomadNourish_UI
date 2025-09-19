<script>
  import { P, Heading, Hr, Button } from "flowbite-svelte";
  import { link } from 'svelte-spa-router';
  import { onMount } from 'svelte';

  let observedElements = [];
  let observer;

  onMount(() => {
    // Create intersection observer for scroll animations
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with 'scroll-animate' class
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => {
      observer.observe(el);
    });

    return () => {
      if (observer) observer.disconnect();
    };
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <div class="max-w-6xl mx-auto px-6 py-16">
    
    <!-- Hero Section -->
    <div class="text-center mb-20 scroll-animate opacity-0 translate-y-10 transition-all duration-700 ease-out">
      <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
        About <span class="text-orange-600 dark:text-orange-500">NomadNourish</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Connecting food lovers with amazing restaurants. Where culinary dreams meet hungry souls, 
        creating a perfect ecosystem for dining experiences.
      </p>
    </div>

    <!-- Introduction & Mission Section -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-16 border border-orange-100 dark:border-gray-700 scroll-animate opacity-0 translate-y-10 transition-all duration-700 ease-out">
      <div class="flex items-center mb-8">
        <div class="w-2 h-16 bg-gradient-to-b from-orange-500 to-red-600 rounded-full mr-6"></div>
        <Heading tag="h2" class="text-3xl font-bold text-gray-900 dark:text-white">
          Bridging Hunger & Hospitality
        </Heading>
      </div>
      
      <P size="lg" class="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        In today's fast-paced world, finding the perfect restaurant that matches your cravings can be challenging. 
        Similarly, restaurants struggle to reach the right customers who appreciate their culinary offerings.
      </P>
      
      <P size="lg" class="text-gray-700 dark:text-gray-300 leading-relaxed">
        NomadNourish was born to solve this dual challenge by creating a vibrant marketplace where food enthusiasts 
        discover incredible dining experiences while restaurants showcase their unique cuisines to genuinely interested customers. 
        It's not just about listing restaurants - it's about creating meaningful connections between diners and dining establishments.
      </P>
    </div>

    <!-- Dual Platform Benefits -->
    <div class="grid md:grid-cols-2 gap-8 mb-16">
      <!-- For Food Lovers -->
      <div class="bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 rounded-2xl shadow-xl p-8 text-white scroll-animate opacity-0 translate-y-10 transition-all duration-700 ease-out">
        <div class="flex items-center mb-6">
          <div class="text-4xl mr-4">🍽️</div>
          <Heading tag="h3" class="text-2xl font-bold text-white">
            For Food Lovers
          </Heading>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
            <p class="text-white/90 leading-relaxed">Discover restaurants based on cuisine preferences</p>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
            <p class="text-white/90 leading-relaxed">Read authentic reviews and ratings</p>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
            <p class="text-white/90 leading-relaxed">Explore menus and pricing before visiting</p>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
            <p class="text-white/90 leading-relaxed">Get location and contact information instantly</p>
          </div>
        </div>
      </div>

      <!-- For Restaurants -->
      <div class="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-2xl shadow-xl p-8 text-white scroll-animate opacity-0 translate-y-10 transition-all duration-700 ease-out">
        <div class="flex items-center mb-6">
          <div class="text-4xl mr-4">🏪</div>
          <Heading tag="h3" class="text-2xl font-bold text-white">
            For Restaurants
          </Heading>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
            <p class="text-white/90 leading-relaxed">Showcase your restaurant and signature dishes</p>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
            <p class="text-white/90 leading-relaxed">Reach targeted customers interested in your cuisine</p>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
            <p class="text-white/90 leading-relaxed">Manage your menu and restaurant information</p>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
            <p class="text-white/90 leading-relaxed">Build your customer base and brand presence</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Features Section -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-16 border border-orange-100 dark:border-gray-700 scroll-animate opacity-0 translate-y-10 transition-all duration-700 ease-out">
      <div class="flex items-center mb-8">
        <div class="w-2 h-16 bg-gradient-to-b from-orange-500 to-red-600 rounded-full mr-6"></div>
        <Heading tag="h2" class="text-3xl font-bold text-gray-900 dark:text-white">
          Platform Highlights
        </Heading>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8 mb-8">
        <div class="text-center p-6 bg-orange-50 dark:bg-gray-700 rounded-xl">
          <div class="text-4xl mb-4">🔍</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Smart Discovery</h3>
          <p class="text-gray-700 dark:text-gray-300 text-sm">Advanced search and filtering by cuisine, location, and preferences</p>
        </div>
        <div class="text-center p-6 bg-orange-50 dark:bg-gray-700 rounded-xl">
          <div class="text-4xl mb-4">⭐</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">Review System</h3>
          <p class="text-gray-700 dark:text-gray-300 text-sm">Authentic reviews and ratings from verified customers</p>
        </div>
        <div class="text-center p-6 bg-orange-50 dark:bg-gray-700 rounded-xl">
          <div class="text-4xl mb-4">📱</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">User-Friendly</h3>
          <p class="text-gray-700 dark:text-gray-300 text-sm">Intuitive interface designed for both diners and restaurant owners</p>
        </div>
      </div>
      
      <P size="lg" class="text-gray-700 dark:text-gray-300 leading-relaxed">
        Our platform streamlines the dining discovery process while providing restaurants with powerful tools to attract 
        and engage with their ideal customers. By focusing on quality connections over quantity, we ensure that every 
        interaction on NomadNourish leads to satisfied diners and successful restaurants.
      </P>
    </div>

    <!-- Success Stories Section -->
    <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl shadow-xl p-8 md:p-12 mb-16 border border-orange-100 dark:border-gray-700 scroll-animate opacity-0 translate-y-10 transition-all duration-700 ease-out">
      <div class="flex items-center mb-8">
        <div class="w-2 h-16 bg-gradient-to-b from-orange-500 to-red-600 rounded-full mr-6"></div>
        <Heading tag="h2" class="text-3xl font-bold text-gray-900 dark:text-white">
          Making Connections That Matter
        </Heading>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8 mb-8">
        <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-orange-100 dark:border-gray-700">
          <div class="text-3xl font-bold text-orange-600 dark:text-orange-500 mb-2">500+</div>
          <p class="text-gray-700 dark:text-gray-300 text-sm font-medium">Registered Restaurants</p>
        </div>
        <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-orange-100 dark:border-gray-700">
          <div class="text-3xl font-bold text-orange-600 dark:text-orange-500 mb-2">10K+</div>
          <p class="text-gray-700 dark:text-gray-300 text-sm font-medium">Happy Food Lovers</p>
        </div>
        <div class="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-orange-100 dark:border-gray-700">
          <div class="text-3xl font-bold text-orange-600 dark:text-orange-500 mb-2">50+</div>
          <p class="text-gray-700 dark:text-gray-300 text-sm font-medium">Cuisine Types</p>
        </div>
      </div>
      
      <P size="lg" class="text-gray-700 dark:text-gray-300 leading-relaxed text-center">
        Every day, we help food enthusiasts discover their next favorite restaurant while helping local businesses 
        thrive by connecting them with customers who truly appreciate their culinary artistry.
      </P>
    </div>

    <!-- Perfect For Section -->
    <div class="bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 rounded-2xl shadow-xl p-8 md:p-12 mb-16 text-white scroll-animate opacity-0 translate-y-10 transition-all duration-700 ease-out">
      <div class="flex items-center mb-8">
        <div class="w-2 h-16 bg-white/30 rounded-full mr-6"></div>
        <Heading tag="h2" class="text-3xl font-bold text-white">
          Who Benefits Most?
        </Heading>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center">
          <div class="text-white text-2xl mb-3">🍕</div>
          <h3 class="font-semibold text-white mb-2">Food Enthusiasts</h3>
          <p class="text-sm text-white/80">Adventurous eaters seeking new experiences</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center">
          <div class="text-white text-2xl mb-3">👥</div>
          <h3 class="font-semibold text-white mb-2">Local Businesses</h3>
          <p class="text-sm text-white/80">Restaurants wanting to grow their customer base</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center">
          <div class="text-white text-2xl mb-3">✈️</div>
          <h3 class="font-semibold text-white mb-2">Travelers</h3>
          <p class="text-sm text-white/80">Tourists exploring local dining scenes</p>
        </div>
        <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center">
          <div class="text-white text-2xl mb-3">👨‍👩‍👧‍👦</div>
          <h3 class="font-semibold text-white mb-2">Families</h3>
          <p class="text-sm text-white/80">Finding family-friendly dining options</p>
        </div>
      </div>
    </div>

    <!-- Call to Action Section -->
    <div class="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 md:p-12 mb-16 border border-orange-100 dark:border-gray-700 scroll-animate opacity-0 translate-y-10 transition-all duration-700 ease-out">
      <div class="flex items-center mb-8">
        <div class="w-2 h-16 bg-gradient-to-b from-orange-500 to-red-600 rounded-full mr-6"></div>
        <Heading tag="h2" class="text-3xl font-bold text-white">
          Join the NomadNourish Community
        </Heading>
      </div>
      
      <P size="lg" class="text-gray-300 leading-relaxed mb-8">
        Whether you're a food lover looking for your next great meal or a restaurant owner ready to showcase your 
        culinary creations, NomadNourish provides the perfect platform to connect, discover, and grow. 
        Join thousands of satisfied users who have already found their perfect dining matches.
      </P>
      
      <div class="flex flex-col sm:flex-row gap-4">
        <a use:link href="/register">
          <Button 
            size="lg" 
            class="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Your Journey
          </Button>
        </a>
        <a use:link href="/CHome">
          <Button size="lg" class="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-xl font-semibold transition-all duration-200">
            Explore Restaurants
          </Button>
        </a>
      </div>
    </div>

    <!-- Decorative separator -->
    <div class="flex justify-center mt-16 scroll-animate opacity-0 translate-y-10 transition-all duration-700 ease-out">
      <div class="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full"></div>
    </div>

  </div>
</div>

<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.7s ease-out forwards;
  }

  /* Stagger animation delay for child elements */
  .scroll-animate:nth-child(odd) {
    transition-delay: 0.1s;
  }
  
  .scroll-animate:nth-child(even) {
    transition-delay: 0.2s;
  }

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    .scroll-animate {
      transition-duration: 0.5s;
    }
  }
</style>