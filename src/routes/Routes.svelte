<!-- Logic of All routes is here: -->

<script>
  // importing svelte essentials
  import Router from 'svelte-spa-router';

  // importing components
  import TestCard from '../components/auth/Test.svelte';
  import Login from '../components/auth/Login.svelte';
  import Register from '../components/auth/Register.svelte';
  
  // importing pages:
  import About from '../pages/About.svelte';
  import Acknowledgement from '../pages/Acknowledgement.svelte';
  import Landing from '../pages/Landing.svelte';
  import Protected from '../pages/Protected.svelte';
  import Texteditor from '../pages/Texteditor.svelte';
  import Cuisine from '../pages/Cuisine.svelte';

  import Test1 from '../ui_Test/Test1.svelte';
  import Test2 from '../ui_Test/Test2.svelte';

  // export let isLogin
  const routes = {
    '/': Landing,
    '/home': Protected,
    '/about': About,
    '/register': Register,
    '/login': Login,
    '/testC': TestCard,
    '/acknowledgement': Acknowledgement, // <-- Route added
    '/textedit': Texteditor,
    '/restaurant/:id/cuisines': Cuisine,
    '/test1': Test1,
    '/test2': Test2,

  };
</script>


<Router {routes} />
