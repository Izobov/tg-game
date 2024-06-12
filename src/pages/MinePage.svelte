<script>
  import { balance, mint, isMining } from "../balance";
  import Loader from "../components/Loader.svelte";
</script>

<h1>Mining</h1>
<div class="mine-block">
    <div class="balance">
      {$balance} RPS
    </div>
    <button on:click={mint} class:disable={$isMining}>
        MINT RPS
    </button>
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
  button {
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
