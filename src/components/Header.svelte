<script>
  import { balance } from "./../balance.ts";
  import Wallet from "../assets/wallet.svelte";
  import Coin from "../assets/coin.svelte";
  import { user } from "../stores/user";

  $: ({ tokenBalance = 100 } = $user);
  let coins = Array(10);
  $: balance.set(tokenBalance);
  let animate = false;
  setTimeout(() => {
    balance.update(v => v +50);
    animate = true;
    setTimeout(() => {
      animate = false;

    }, 1000);
  }, 5000);
</script>

<div class="header">
  <div class="name">@ssgase</div>
  <div class="balance">
    {$balance.toFixed(0)}RPS
    <div class="wallet-wrapper">
      {#each coins as coin, index}
        <div class="coin"  class:animate style="--i: {index}; --random-delay: {Math.random() * 0.2}s; --random-offset: {Math.random() * 50 - 10}px;">
          <Coin />
        </div>
      {/each}
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
          transition: all 1s ease-out;
          transition-delay: calc(var(--i) * 0.1s);
          scale: 1;

          &.hide {
            display: none;
          }

          &.animate {
            left: 0;
            top: 0;
            transform: translate(-20%, -20%);
            z-index: 10;
            scale: 0.5;
          }
        }
      }
    }
  }
</style>
