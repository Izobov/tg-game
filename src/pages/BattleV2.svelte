<script>
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
  import { feedback } from "../utils/telegram";
  import particles, { particlesMode } from "../stores/particles";

  let store = websocketStore("ws://localhost:3000/battle/connect");

  let loading = true;
  let start = false;
  let choosing = false;
  let selected = null;
  let opponentSelect = null;
  let waitingOpponent = false;
  let ended = false;
  let startagain = false;
  let prevBattleMessage = "";
  const options = [
    { name: "rock", img: Rock, win: "scissors", lose: "paper" },
    { name: "scissors", img: Scissors, win: "paper", lose: "rock" },
    { name: "paper", img: Paper, win: "rock", lose: "scissors" },
  ];
  let opponent;
  $: response = $store;
  let round = {},
    type,
    message,
    score = { home: 0, away: 0 },
    opponentNumber;
  $: ({ type } = response || {});
  $: if (type === "info") {
    ({ message } = response);
    waitingOpponent = true;
  }

  $: if (type === "end") {
    ({ round, score } = response);
    const { prevRound, battle } = response;
    calculateMatch(prevRound);
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
    }, 3000);
  }

  $: if (type === "match") {
    waitingOpponent = false;
    ({ round, score } = response);
    const { prevRound } = response;
    calculateMatch(prevRound);
    setTimeout(() => {
      opponentSelect = null;
      message = "";
      selected = null;
      choosing = true;
    }, 3000);
  }
  $: if (!start && type === "start") {
    startMatch();
  }

  function calculateMatch(prevRound) {
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
    setTimeout(() => {
      start = true;
    }, 1000);
  }
  async function connect() {
    store.set({ type: "init", user: $user });
  }

  function choose(option) {
    feedback("medium");
    selected = option;
    // store.set({ type: "choice", choice: option.name });
    // choosing = false;
    score.home += 1;
    opponentSelect = options[Math.floor(Math.random() * 3)];
  }
</script>

<h1>Battle</h1>

<!-- {#if !start}
  <div class="loader-wrapp">
    {#if startagain && prevBattleMessage}
      <span> {prevBattleMessage}</span>
    {/if}
    <button on:click={connect}>Start {startagain ? "again" : ""}</button>
    {#if response?.type === "waiting"}
      <span> {response.message}</span>
      <Loader />
    {/if}
    {#if response?.type === "start"}
      <span> {response.message} </span>
    {/if}
  </div>
{:else} -->
<div class="battle-field">
  <div class="field-block">
    <div class="score-wrapper">
      {#each [1, 2, 3] as item}
        <div class="score-indicator" class:win={score.away >= item} />
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
    {#if startagain && prevBattleMessage}
      <span class="message"> {prevBattleMessage}</span>
    {/if}
    {#if !start}
      <button class="button" on:click={connect}
        >Start {startagain ? "again" : ""}</button
      >
    {/if}
    {#if response?.type === "waiting"}
      <span class="message"> {response.message}</span>
      <Loader />
    {/if}
    {#if response?.type === "start"}
      <span class="message"> {response.message} </span>
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
        <div class="score-indicator" class:win={score.home >= item} />
      {/each}
    </div>
  </div>
</div>
<!-- else content here -->
<!-- {/if} -->
{#if ended}
  <div class="modal">
    <div class="ended-modal">
      <span class="message">{message}</span>
      <span class="token">{prize} RPS</span>
      <button on:click={reset}> start again </button>
    </div>
  </div>
  <!-- content here -->
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
  .message {
    font-size: 20px;
    font-weight: 500;
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
