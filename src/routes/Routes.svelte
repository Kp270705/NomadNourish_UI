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
  import EditDetails from '../pages/Restaurants/R_EditDetails.svelte';
  import CreateCousine from '../pages/Restaurants/R_CreateCuisine.svelte';
  import RHome from '../pages/Restaurants/R_Home.svelte';
  import ROrderHistory from '../pages/Restaurants/R_OrderHistory.svelte';
  import CHome from '../pages/Customer/C_Home.svelte';
  import RManageCuisine from '../pages/Restaurants/R_ManageCuisine.svelte';

  import TestCredentials from '../pages/TestCredentials.svelte';
  import Test from '../pages/Test.svelte';
  import RStatus from '../pages/Restaurants/R_Status.svelte';
  import RTest from '../pages/Restaurants/R_Test.svelte';
  import RTest2 from '../pages/Restaurants/R_Test2.svelte';


  // export let isLogin
  const routes = {
    '/': Landing,
    '/about': About,
    '/register': Register,
    '/login': Login,
    '/protectedHome': Protected,
    "/CHome":CHome,
    "/test-credentials": TestCredentials,
    '/test':Test,

    // -----------------------------------------------
    // User:
    '/CRestaurant/:id/cuisines': Cuisine,
    '/CMy-orders': OrderHistory,
    '/acknowledgement': Acknowledgement, // <-- Route added
    '/textedit': Texteditor,

    // -----------------------------------------------
    // Restaurant:
    "/RHome": RHome,
    '/REditDetails': EditDetails,
    '/RCreateCuisine': CreateCousine,
    '/RManageCuisine': RManageCuisine,
    '/ROrderHistory': ROrderHistory,
    '/RStatus': RStatus,
    '/RTest': RTest,
    '/RTest2': RTest2,

  };

</script>


<Router {routes} />
