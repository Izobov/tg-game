<script lang="ts">
  import Particles, { particlesInit } from "@tsparticles/svelte";
  import type { IOptions } from "@tsparticles/engine"; // if you are going to use `loadFull`, install the "tsparticles" package too.
  import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
  import {particles, particlesMode, particlesConfig, sideConfig} from "../stores/particles";


  let onParticlesLoaded = (event) => {
    const particlesContainer = event.detail.particles;
    particlesContainer.stop();
    particles.set(particlesContainer);
    // you can use particlesContainer to call all the Container class
    // (from the core library) methods like play, pause, refresh, start, stop
  };
</script>

<Particles
  id="tsparticles"
  class="put your classes here"
  style=""
  options={$particlesMode === "click" ? particlesConfig : sideConfig}
  on:particlesLoaded={onParticlesLoaded}
/>
