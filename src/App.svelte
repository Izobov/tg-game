<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import Counter from "./lib/Counter.svelte";
  import BottomMenu from "./components/BottomMenu.svelte";
  import { Router, Link, Route } from "svelte-routing";
  import MinePage from "./pages/MinePage.svelte";
  import Tournament from "./pages/Tournament.svelte";
  import Battle from "./pages/Battle.svelte";
  import Taks from "./pages/Taks.svelte";
</script>

<Router>
  <main>
    <Route path="/" component={MinePage} />
    <Route path="/tournament" component={Tournament} />
    <Route path="/battle" component={Battle} />
    <Router path="/tasks" component={Taks} />
  </main>
  <BottomMenu />
</Router>

<style>
  main {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 20px;
    background-color: #242424;
    display: flex;
    flex-direction: column;
    gap: 20px;

    padding-bottom: 80px;
  }
</style>
