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
  // import Cuisine from '../pages/Customer/C_Cuisine.svelte';
  // import OrderHistory from '../pages/Customer/C_OrderHistory.svelte';
  import EditDetails from '../pages/Restaurants/R_EditDetails.svelte';
  import CreateCousine from '../pages/Restaurants/R_CreateCuisine.svelte';
  import RHome from '../pages/Restaurants/R_Home.svelte';
  import ROrderHistory from '../pages/Restaurants/R_OrderHistory.svelte';
  import CHome from '../pages/Customer/C_Home.svelte';
  import RManageCuisine from '../pages/Restaurants/R_ManageCuisine.svelte';

  import TestCredentials from '../pages/TestCredentials.svelte';
  import RStatus from '../pages/Restaurants/R_Status.svelte';
  import RTest from '../pages/Restaurants/R_Test.svelte';
  import RTest2 from '../pages/Restaurants/R_Test2.svelte';
  import MenuPage from '../pages/Customer/MenuPage.svelte';
  import MyOrders from '../pages/Customer/MyOrders.svelte';
  import Dashboard from '../pages/Restaurants/Dashboard.svelte';
  import ManageOrders from '../pages/Restaurants/ManageOrders.svelte';
  import Notifications from '../components/Notifications.svelte';
  import RContact from '../pages/R_Contact.svelte';


  // export let isLogin
  const routes = {
    '/': Landing,
    '/about': About,
    '/register': Register,
    '/login': Login,
    '/protectedHome': Protected,
    "/CHome":CHome,
    "/test-credentials": TestCredentials,
    '/rcontact/:id': RContact,

    // -----------------------------------------------
    // User:
    // '/CRestaurant/:id/cuisines': Cuisine,
    '/CRestaurant/:id/cuisines': MenuPage,
    // '/CMy-orders': OrderHistory,
    '/CMy-orders': MyOrders,
    '/acknowledgement': Acknowledgement, // <-- Route added
    '/textedit': Texteditor,

    // -----------------------------------------------
    // Restaurant:
    "/RHome": RHome,
    '/REditDetails': EditDetails,
    '/RCreateCuisine': CreateCousine,
    '/RManageCuisine': RManageCuisine,
    '/ROrderHistory': ROrderHistory,
    '/RDashboard': Dashboard,
    '/RStatus': RStatus,
    "/Notifications": Notifications,
    "/RManageorders": ManageOrders,
    '/RTest': RTest,
    '/RTest2': RTest2,

  };

</script>


<Router {routes} />
