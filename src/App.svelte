<script lang="ts">
  import Header from "./components/Header.svelte";
  import BottomMenu from "./components/BottomMenu.svelte";
  import { Router, Link, Route } from "svelte-routing";
  import MinePage from "./pages/MinePage.svelte";
  import Tournament from "./pages/Tournament.svelte";
  import Battle from "./pages/Battle.svelte";
  import Tasks from "./pages/Tasks.svelte";
  import { onMount } from "svelte";
  import axios from "axios";
  import { user } from "./stores/user";
  import { get, post } from "./utils/axios_helper";
  import { mining } from "./stores/mining_store";
  import BattleV2 from "./pages/BattleV2.svelte";
  import Particles, { particlesInit } from "@tsparticles/svelte";
  import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
  import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
  import Confetti from "./lib/Confetti.svelte";
  import CoinsTransition from "./components/CoinsTransition.svelte";

  onMount(() => {
    init();
  });

  async function init() {
    get("/mining/config").then(({ data }) => {
      mining.set(data);
    });
    const data = await post("http://localhost:3000/auth/verify", {
      initData: window.Telegram.WebApp.initData,
    });
    // const  u = parse(data.data);
    user.set(data.data);
    window.Telegram.WebApp.ready();
  }

  void particlesInit(async (engine) => {
    await loadFull(engine);
  });
</script>

<Router>
  <Confetti />
  <main>
    <Header />
    <Route path="/" component={MinePage} />
    <Route path="/tournament" component={Tournament} />
    <!-- <Route path="/battle" component={Battle} /> -->
    <Route path="/battle" component={BattleV2} />
    <Route path="/tasks" component={Tasks} />
  </main>
  <BottomMenu />
  <CoinsTransition />
</Router>

<style>
  main {
    height: calc(100% - 100px);
    width: 100%;
    padding: 20px;
    background-color: #242424;
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 20px;
  }
</style>
