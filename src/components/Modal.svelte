<script>
  import { fade, scale } from "svelte/transition";
  import CloseIcon from "../assets/close_icon.svelte";
  import { createEventDispatcher } from "svelte";
  export let show = false;
  let showAnimation = false;

  $: if (show) {
    setTimeout(() => {
      showAnimation = true;
    }, 100);
  }
  let duration = 500;
  const dispatch = createEventDispatcher();
  function close() {
    show = false;
    showAnimation = false;
    dispatch("close");
  }
</script>

{#if showAnimation}
  <div
    on:click={close}
    class="modal"
    in:fade={{ duration }}
    out:fade={{ duration, delay: 200 }}
  >
    <div
      class="modal-popup"
      in:scale={{ duration, delay: 200 }}
      out:scale={{ duration }}
      on:click|stopPropagation
    >
      <div class="modal-header">
        <span class="title"><slot name="title" /></span>
        <button class="modal-close" on:click={close}><CloseIcon /></button>
      </div>
      <div class="modal-body">
        <slot name="body" />
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 20;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;

    .modal-popup {
      width: 80%;
      display: flex;
      flex-direction: column;
      background-color: #434242;
      padding: 20px;
      border-radius: 10px;
      gap: 15px;

      .modal-header {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transform: translateY(2px);
          border-radius: 5px;
          :global(svg) {
            fill: #9e9d9d;
            width: 20px;
            height: 20px;
          }
        }

        .title {
          font-size: 25px;
          font-weight: 500;
          width: 100%;
          text-align: start;
        }
      }

      .modal-body {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: center;
      }
    }
  }
</style>
