<!-- Logic of All routes is here: -->

<script>
  // importing svelte essentials
  import Router from 'svelte-spa-router';

  // importing components
  import Login from '../auth/Login.svelte';
  import Register from '../auth/Register.svelte';
  
  // importing pages:
  import About from '../pages/About.svelte';
  import Acknowledgement from "../pages/Acknowledgement.svelte";
  import Landing from '../pages/Landing.svelte';
  import Protected from '../auth/Protected.svelte';
  import Texteditor from '../pages/Texteditor.svelte';
  import Cuisine from '../pages/Customer/C_Cuisine.svelte';
  import OrderHistory from '../pages/Customer/C_OrderHistory.svelte';
  import EditDetails from '../pages/Restaurants/EditDetails.svelte';

  // import Test1 from '../ui_Test/Test1.svelte';
  // import Test2 from '../ui_Test/Test2.svelte';

  // export let isLogin
  const routes = {
    '/CHome': Protected,
    '/CRestaurant/:id/cuisines': Cuisine,
    '/CMy-orders': OrderHistory,
    '/': Landing,
    '/about': About,
    '/register': Register,
    '/login': Login,
    '/acknowledgement': Acknowledgement, // <-- Route added
    '/textedit': Texteditor,
    'editDetails': EditDetails,
    

    // '/test1': Test1,
    // '/test2': Test2,

  };
</script>


<Router {routes} />
