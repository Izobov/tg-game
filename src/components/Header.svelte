<script>
  import { coins } from "./../stores/coins";
  import { balance } from "../stores/balance";
  import Wallet from "../assets/wallet.svelte";
  import Coin from "../assets/coin.svelte";
  import { user } from "../stores/user";

  $: ({ tokenBalance = 0, first_name } = $user);

  $: balance.set(tokenBalance);
  let wallet_node;
  $: if (wallet_node) {
    $coins.target = wallet_node;
  }
  
</script>

<div class="header">
  <div class="name">{first_name}</div>
  <div class="balance">
    {$balance.toFixed(0)}RPS
    <div class="wallet-wrapper " bind:this={wallet_node}>
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
      }
    }
  }
</style>
