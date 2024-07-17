<script lang="ts">
  import { fade } from "svelte/transition";
  import Coin from "../assets/coin.svelte";
  import { coins } from "../stores/coins";
  import { balance } from "../stores/balance";
  let animate = false;
  let timer = 0;
  $: if (!!$coins.show) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      animate = true;
      balance.update((prev) => prev + $coins.amount);
      if ($coins.decreesStore) {
        $coins.decreesStore.set(0);
      }
      setTimeout(() => {
        $coins.show = false;
      }, 2000);
    }, 500);
  }
  let startX = 0,
    startY = 0,
    endX = 0,
    endY = 0;
  $: if ($coins.source) {
    const { left, top, height, width } = (
      $coins.source as HTMLElement
    ).getBoundingClientRect();
    startX = left + width / 2;
    startY = top + height / 2;
  }
  $: if ($coins.target) {
    const { top, left, width, height } = (
      $coins.target as HTMLElement
    ).getBoundingClientRect();
    endX = left + width / 2;
    endY = top + height / 2;
  }
</script>

{#if $coins.show}
  {#each Array(10) as coin, index}
    <div
      in:fade={{ duration: 500 }}
      out:fade
      class="coin"
      class:animate
      style="--i: {index}; --start-x:{startX}px; --start-y: {startY}px; --end-x: {endX}px; --end-y: {endY}px;  --random-delay: {Math.random() *
        0.2}s; --random-offset: 0px"
    >
      <Coin />
    </div>
  {/each}
{/if}

<style lang="scss">
  .coin {
    z-index: 30;
    width: 60px;
    height: 60px;
    //   position: fixed;
    position: absolute;
    transform: translate(-50%, -100%);
    top: var(--start-y);
    left: calc(var(--start-x) + var(--random-offset));
    scale: 1;

    &.animate {
      left: var(--end-x);
      top: var(--end-y);
      transform: translate(-100%, -100%);
      z-index: 10;
      scale: 0.5;
      transition: all 1s ease-out;
      transition-delay: calc(var(--i) * 0.1s);

      // &.fade {
      //   transition-delay: calc(1s + var(--i) * 0.1s);

      //   transition: opacity 1s ease-out;
      //   opacity: 0;
      // }
      // animation: fade-out 1s ease-out forwards;
    }

    //   @keyframes fade-out {
    //     0% {
    //       opacity: 1;
    //     }
    //     98% {
    //       opacity: 0.5;
    //     }
    //     100% {
    //       opacity: 0;
    //     }
    //   }
  }
</style>
