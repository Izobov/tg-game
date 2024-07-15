<script>
  import { coins } from "./../stores/coins";
  import { balance } from "./../balance";
  import Wallet from "../assets/wallet.svelte";
  import Coin from "../assets/coin.svelte";
  import { user } from "../stores/user";

  $: ({ tokenBalance = 0, first_name } = $user);

  $: balance.set(tokenBalance);
  let animate = false;
  let fade = false;
</script>

<div class="header">
  <div class="name">{first_name}</div>
  <div class="balance">
    {$balance.toFixed(0)}RPS
    <div class="wallet-wrapper">
      {#if $coins.show}
        {#each Array(10) as coin, index}
          <div
            class="coin"
            class:animate
            class:fade
            style="--i: {index}; --random-delay: {Math.random() *
              0.2}s; --random-offset: {Math.random() * 50 - 10}px;"
          >
            <Coin />
          </div>
        {/each}
      {/if}
      <Wallet />
    </div>
  </div>
</div>

<style lang="scss">
  .header {
    display: flex;
    gap: 5px;
    padding-block: 5px;
    justify-content: space-between;
    align-items: center;
    font-size: larger;
    font-weight: 500;

    .balance {
      display: flex;
      gap: 15px;
      align-items: center;

      .wallet-wrapper {
        margin-top: -2px;
        position: relative;
        .coin {
          width: 60px;
          height: 60px;
          //   position: fixed;
          position: absolute;
          top: 400px;
          left: calc(-150px + var(--random-offset));
          scale: 1;

          &.animate {
            left: 0;
            top: 0;
            transform: translate(-20%, -20%);
            z-index: 10;
            scale: 0.5;
            transition: all 1s ease-out;
            transition-delay: calc(var(--i) * 0.1s);

            &.fade {
              transition-delay: calc(1s + var(--i) * 0.1s);

              transition: opacity 1s ease-out;
              opacity: 0;
            }
            // animation: fade-out 1s ease-out forwards;
          }

          @keyframes fade-out {
            0% {
              opacity: 1;
            }
            98% {
              opacity: 0.5;
            }
            100% {
              opacity: 0;
            }
          }
        }
      }
    }
  }
</style>
