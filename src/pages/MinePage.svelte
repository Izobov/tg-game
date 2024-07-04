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
  $: ({ tokenBalance, isMining, lastMining } = $user);
  $: ({ miningSpeed, tokensPerClick } = $mining);

  async function mint() {
    const { data } = await post("/mining/mint", { id: $user.id });
    user.update((u) => ({ ...u, ...data.user }));
  }
  let minted = 0;
  let timer = 0;

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
      minted = alreadyMinted;
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
        minted = parseFloat((minted + coinPerSecond).toFixed(4));
      }
    }, 1000);
  }

  function claim() {
    clearInterval(timer);
    post("/mining/claim", { id: $user.id }).then(({ data }) => {
      minted = 0;
      user.update((u) => ({ ...u, ...data.user }));
    });
  }
</script>

<h1>Mining</h1>
<div class="mine-block">
  <div class="balance">
    {tokenBalance} RPS
  </div>
  {#if isMining && minted < tokensPerClick}
    <div class="mining-button" class:disable={isMining}>
      {minted} RPS
    </div>
  {:else if isMining}
    <button class="mining-button" on:click={claim}>
      CLAIM {minted} RPS
    </button>
    <!-- else content here -->
  {:else}
    <button class="mining-button" on:click={mint} class:disable={isMining}>
      {minted} RPS
    </button>
  {/if}
</div>

<style lang="scss">
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
</style>
