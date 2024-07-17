<script>
  import { coins } from "../stores/coins";
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import Close from "../assets/close_icon.svelte";
  import Header from "./../components/Header.svelte";
  import { onMount } from "svelte";
  import Loader from "../components/Loader.svelte";
  import PaperImg from "../assets/paper.svelte";
  import RockImg from "../assets/rock.svelte";
  import ScissorsImg from "../assets/scissors.svelte";
  import websocketStore from "svelte-websocket-store";
  import { user } from "../stores/user";
  import Rock from "../assets/rock.svelte";
  import Scissors from "../assets/scissors.svelte";
  import Paper from "../assets/paper.svelte";
  import CloseIcon from "../assets/close_icon.svelte";
  import { feedback } from "../utils/telegram";
  import particles, { particlesMode } from "../stores/particles";
  import Modal from "../components/Modal.svelte";

  import "animate.css/animate.css";

  let store = websocketStore("ws://localhost:3000/battle/connect");

  let loading = true;
  let start = false;
  let choosing = false;
  let selected = null;
  let opponentSelect = null;
  let waitingOpponent = false;
  let ended = false;
  let startagain = true;
  let modal_body;
  let prize = tweened(10, {
    duration: 1500,
    easing: cubicOut,
  });
  let prevBattleMessage = "You win this battle!";
  const options = [
    { name: "rock", img: Rock, win: "scissors", lose: "paper" },
    { name: "scissors", img: Scissors, win: "paper", lose: "rock" },
    { name: "paper", img: Paper, win: "rock", lose: "scissors" },
  ];
  setTimeout(() => {
    // ended = true;
  }, 1000);

  $: if (ended) {
    setTimeout(() => {
      $coins.source = modal_body;
      $coins.amount = 10;
      $coins.decreesStore = prize;
      $coins.show = true;
    }, 1000);
  }
  let opponent;
  $: response = $store;
  let round = {},
    type,
    message = "You win this battle!",
    score = { home: 0, away: 0 },
    opponentNumber;
  $: ({ type } = response || {});
  $: if (["info", "waiting"].includes(type)) {
    ({ message } = response);
    waitingOpponent = true;
  }

  $: if (type === "end") {
    ({ round, score } = response);
    const { prevRound, battle } = response;
    calculateRound(prevRound);
    store = websocketStore("ws://localhost:3000/battle/connect");
    feedback("heavy");
    const winnerId = battle.winnerId;
    startagain = true;
    const isWinner = winnerId === $user.id;
    prevBattleMessage = isWinner
      ? "You win this battle!"
      : "You lose this battle!";
    if (isWinner) {
      $particlesMode = "side";
      $particles.start();
    }
    setTimeout(() => {
      $particles.stop();
      loading = true;
      opponentSelect = null;
      selected = null;
      choosing = true;
      start = false;
      score = { home: 0, away: 0 };
    }, 3000);
  }

  $: if (type === "round") {
    waitingOpponent = false;
    ({ round } = response);
    const { prevRound, score: s } = response;
    score = { ...s };
    calculateRound(prevRound);
    setTimeout(() => {
      opponentSelect = null;
      message = "Make your choice";
      selected = null;
      choosing = true;
    }, 3000);
  }
  $: if (type === "start") {
    startMatch();
  }

  function calculateRound(prevRound) {
    opponentSelect = options.find((o) => o.name === prevRound[opponentNumber]);
    message = prevRound.isDraw
      ? "Draw!"
      : prevRound.winnerId === $user.id
        ? "You win this round!"
        : "You lose this round!";
    feedback("light");
  }

  function startMatch() {
    opponent = $store.user;
    ({ round, score } = response);
    opponentNumber = round.user1Id === $user.id ? "user2Choice" : "user1Choice";
    message = "Make your choice";
    setTimeout(() => {
      start = true;
    }, 1000);
  }
  async function connect() {
    message = "";
    startagain = false;
    prevBattleMessage = "";
    start = true;
    store.set({ type: "init", user: $user });
  }

  function choose(option) {
    feedback("medium");
    selected = option;
    store.set({ type: "choice", choice: option.name });
    choosing = false;
  }
</script>

<h1>Battle</h1>

<div class="battle-field">
  <div class="field-block">
    <div class="score-wrapper">
      {#each [1, 2, 3] as item}
        <div class="score-indicator" class:win={score[opponent?.id] >= item} />
      {/each}
    </div>
    <div class="options-wrapper">
      {#each options as item (item)}
        <div
          class="game-option"
          class:disabled={opponentSelect?.name !== item.name}
          class:selected={opponentSelect?.name === item.name}
        >
          <svelte:component this={item.img} />
        </div>
      {/each}
    </div>
  </div>
  <div class="field-block info">
    {#if !start}
      <button class="button" on:click={connect}
        >Start {startagain ? "again" : ""}</button
      >
    {/if}
    {#if ["waiting"].includes(response?.type)}
      <span class="message animate__zoomInDown"> {message}</span>
      <Loader />
    {/if}
    {#if ["info", "start", "round"].includes(response?.type)}
      <span class="message animate__zoomInDown"> {message} </span>
    {/if}
  </div>
  <div class="field-block">
    <div class="options-wrapper">
      {#each options as item}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="game-option"
          class:disabled={selected?.name !== item.name}
          class:selected={selected?.name === item.name}
          on:keydown={() => {}}
          on:click={() => choose(item)}
        >
          <svelte:component this={item.img} />
        </div>
      {/each}
    </div>
    <div class="score-wrapper">
      {#each [1, 2, 3] as item (item)}
        <div class="score-indicator" class:win={score[$user.id] >= item} />
      {/each}
    </div>
  </div>
</div>
<!-- else content here -->
<!-- {/if} -->
{#if ended}
  <Modal show={ended}>
    <span slot="title" class="title">{message}</span>
    <div slot="body" class="modal-body" bind:this={modal_body}>
      <span class="token">{$prize.toFixed(0)} RPS</span>
    </div>
  </Modal>
{/if}

<style lang="scss">
  :global(.field-block .game-option svg) {
    fill: #9e9d9d;
    width: 100px;
    height: 120px;
  }
  :global(.field-block .game-option.selected svg) {
    fill: #9e9d9d;
    // stroke: #9e9d9d;
    // fill: #8e54e9;
    // filter: drop-shadow(3px 5px 2px #4776e6);
  }
  :global(.field-block .game-option.disabled svg) {
    fill: #434242;
  }
  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    min-height: 40px;
    .token {
      font-size: 20px;
      font-weight: 500;
    }
  }

  h1 {
    margin: 0;
  }
  .message {
    font-size: 20px;
    font-weight: 500;
    animation-duration: 1s;
  }
  .button {
    padding: 10px 5px;
    background: -webkit-linear-gradient(214deg, #4776e6 0%, #8e54e9 100%);
    background: linear-gradient(214deg, #4776e6 0%, #8e54e9 100%);
    border: none;
    border-radius: 5px;
    width: 200px;
    font-size: medium;
  }
  .battle-field {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    gap: 10px;
    width: 100%;

    .field-block {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      gap: 20px;

      .info {
        min-height: 200px;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .score-wrapper {
        display: flex;
        gap: 5px;
        justify-content: center;

        .score-indicator {
          width: 20px;
          height: 20px;
          border: 2px solid #434242;
          border-radius: 50%;
          transition: all 1s;
          background: none;

          &.win {
            background: #4776e6;
            background: -webkit-linear-gradient(
              214deg,
              #4776e6 0%,
              #8e54e9 100%
            );
            background: linear-gradient(214deg, #4776e6 0%, #8e54e9 100%);
            border: none;
          }
        }
      }
      .options-wrapper {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 20px;
      }
    }
  }
  /* your styles go here */
</style>
