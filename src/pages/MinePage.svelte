<script>
  import { onMount } from "svelte";
  import Loader from "../components/Loader.svelte";
  import { user } from "../stores/user";
  import { mining } from "../stores/mining_store";
  import { post } from "../utils/axios_helper";
  import { hoursToSeconds } from "date-fns";
  import { addHours } from "date-fns/addHours";
  import { differenceInSeconds } from "date-fns/differenceInSeconds";
  import { isAfter } from "date-fns/isAfter";
  import RoundProgress from "../lib/RoundProgress.svelte";
  import Timer from "../lib/Timer.svelte";
  import particles from "../stores/particles";
  $: ({
    tokenBalance,
    isMining,
    lastMining = addHours(new Date(), -4),
  } = $user);
  $: ({ miningSpeed = 8, tokensPerClick = 100 } = $mining);
  async function mint() {
    feedback("medium");
    const { data } = await post("/mining/mint", { id: $user.id });
    user.update((u) => ({ ...u, ...data.user }));
  }
  let minted = 0;
  let timer = 0;
  let animate = false;

  $: miningSpeedIns = hoursToSeconds(miningSpeed);
  $: coinPerSecond = tokensPerClick / miningSpeedIns;
  $: endOfTimer = addHours(lastMining, miningSpeed);

  $: if (isMining) {
    const alreadyMinted =
      coinPerSecond * differenceInSeconds(new Date(), lastMining);
    if (alreadyMinted >= tokensPerClick) {
      clearInterval(timer);
      minted = tokensPerClick;
    } else {
      minted = parseFloat(alreadyMinted.toFixed(4));
      startMiningTimer();
    }
  }
  function startMiningTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      const now = new Date().valueOf();
      if (isAfter(now, endOfTimer)) {
        clearInterval(timer);
        minted = tokensPerClick;
      } else {
        minted = (+minted + coinPerSecond).toFixed(4);
      }
    }, 1000);
  }

  function claim() {
    $particles.start();
    clearInterval(timer);
    post("/mining/claim", { id: $user.id }).then(({ data }) => {
      minted = 0;
      user.update((u) => ({ ...u, ...data.user }));
    });
  }

  function handleClick() {
    // animation();
    if (!isMining) mint();
    if (isMining && minted >= tokensPerClick) claim();
  }
  let animation_timer = 0;
  function animation() {
    if (animation_timer) {
      clearTimeout(animation_timer);
      animate = false;
    }

    animate = true;
    animation_timer = setTimeout(() => {
      animate = false;
    }, 150);
  }
  function down() {
    animate = true;
  }
  function up() {
    animate = false;
  }
  function feedback(type) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
  }
</script>

<h1>Mining</h1>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="mine-block"
  class:animate
  on:mousedown={down}
  on:touchstart={down}
  on:touchend={up}
  on:mouseup={up}
>
  <RoundProgress
    on:click={handleClick}
    count={(minted * 100) / tokensPerClick}
    size={250}
  >
    <div
      class="wrapper"
      class:animate
      class:disabled={isMining && minted < tokensPerClick}
    >
      {#if isMining && minted < tokensPerClick}
        <div class="tokens">
          <span>
            {minted}
          </span>
          RPS
        </div>
        <Timer end={endOfTimer} />
        <!-- <div class="mining-button" class:disable={isMining}> -->
        <!-- </div> -->
      {:else if isMining}
        <!-- <button class="mining-button" on:click={claim}> -->
        <div class="tokens">
          {minted} RPS
        </div>
        CLAIM
        <!-- </button> -->
        <!-- else content here -->
      {:else}
        <!-- <button class="mining-button" on:click={mint} class:disable={isMining}> -->
        START
        <!-- </button> -->
      {/if}
    </div>
  </RoundProgress>
</div>

<style lang="scss">
  :global(.animate .inner) {
    box-shadow: inset 0px 0px 19px 8px rgb(14 13 15 / 73%) !important;
  }
  .mine-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    width: 100%;
  }
  .balance {
    color: white;
    font-size: 40px;
    background-color: #4b4b4b;
    flex-grow: 1;
    width: 100%;
    display: flex;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    justify-content: center;
    align-items: center;
  }
  .mining-button {
    width: 100%;
    height: 50px;
    background-color: #333;
    border: none;
    color: #d0adf0;
    cursor: pointer;

    &.disable {
      background-color: #5a5a5a;
      pointer-events: none;
      cursor: not-allowed;
    }
  }
  .wrapper {
    display: flex;
    transform: scale(1);
    flex-direction: column;
    color: #fff;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: 30px;
    font-size: 30px;
    font-weight: 600;

    &.animate {
      transform: scale(0.9);
    }

    &.disabled {
      color: #5a5a5a;
    }
    .tokens {
      font-size: 24px;
      display: flex;
      background-color: unset;
      align-items: center;
      width: 85%;
      justify-content: space-between;
      gap: 5px;
    }
  }
</style>
