<script lang="ts">
  import BottomMenu from "./components/BottomMenu.svelte";
  import { Router, Link, Route } from "svelte-routing";
  import MinePage from "./pages/MinePage.svelte";
  import Tournament from "./pages/Tournament.svelte";
  import Battle from "./pages/Battle.svelte";
  import Tasks from "./pages/Tasks.svelte";
</script>

<Router>
  <main>
    <Route path="/" component={MinePage} />
    <Route path="/tournament" component={Tournament} />
    <Route path="/battle" component={Battle} />
    <Route path="/tasks" component={Tasks} />
  </main>
  <BottomMenu />
</Router>

<style>
  main {
    box-sizing: border-box;
    height: calc(100% - 100px);
    width: 100%;
    padding: 20px;
    background-color: #242424;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>
