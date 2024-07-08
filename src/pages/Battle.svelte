<script>
  import { onMount } from "svelte";
  import Loader from "../components/Loader.svelte";
  import PaperImg from "../assets/paper.svelte";
  import RockImg from "../assets/rock.svelte";
  import ScissorsImg from "../assets/scissors.svelte";
  import websocketStore from "svelte-websocket-store";
  import { user } from "../stores/user";





  let store = websocketStore("ws://localhost:3000/battle/connect");

  let loading = true;
  // let start = false;
  let start = true;
  let choosing = false;
  let selected = null;
  let opponentSelect = null;
  let waitingOpponent = false;
  let ended = false;
  let startagain = false;
  let prevBattleMessage = "";
  const options = [
    { name: "rock", img: RockImg, win: "scissors", lose: "paper" },
    { name: "paper", img: PaperImg, win: "rock", lose: "scissors" },
    { name: "scissors", img: ScissorsImg, win: "paper", lose: "rock" },
  ];
  let opponent;
  $: response = $store;
  let round = {}, type, message, score = {}, opponentNumber;
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
    setTimeout(() => {
      const winnerId = battle.winnerId;
      startagain = true;
      prevBattleMessage =
        winnerId === $user.id
          ? "You win this battle!"
          : "You lose this battle!";
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
  }

  function startMatch() {
    opponent = $store.user;
    ({ round, score } = response);
    opponentNumber =
      round.user1Id === $user.id
        ? "user2Choice"
        : "user1Choice";
    setTimeout(() => {
      start = true;
    }, 1000);
  }
  async function connect() {
    store.set({ type: "init", user: $user });
  }

  function choose(option) {
    store.set({ type: "choice", choice: option.name });
    choosing = false;
    selected = option;
  }
</script>

<h1>Battle</h1>

{#if !start}
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
{:else}
  <div class="battle-wrap">
    <div class="round">
      Round: {round?.roundNumber || 1}
    </div>
    <div class="participants">
      <div class="participant">
        <div class="score">
          You: {score[$user.id]}
        </div>
        <div class="selected-option">
          {#if selected}
            <img src={selected.img} alt={selected.name} />
            <span>{selected.name}</span>
          {/if}
        </div>
      </div>
      <div class="battle-field">
        {#if message}
          <span class="message">{message}</span>
        {/if}
        {#if waitingOpponent}
          <p class="message">waiting User1</p>
          <Loader />
        {/if}
      </div>
      <div class="participant">
        <div class="score">
          User1: {score[opponent?.id]}
        </div>
        <div class="selected-option">
          {#if opponentSelect}
            <img src={opponentSelect.img} alt={opponentSelect.name} />
            <span>{opponentSelect.name}</span>
          {:else}
            <div class="select-placeholder"></div>
          {/if}
        </div>
      </div>
    </div>
    {#if choosing}
      <div class="modal">
        <span class="choose-text">Make your choose</span>
        <div class="options">
          {#each options as option}
            <div class="option" on:click={() => choose(option)}>
              <img src={option.img} alt={option.name} />
              <button on:click={() => choose(option)}>
                {option.name}
              </button>
            </div>
            <!-- content here -->
          {/each}
        </div>
      </div>
      <!-- content here -->
    {/if}
  </div>
  <!-- else content here -->
{/if}
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

<style>
  .img :global(svg){
    stroke: #8e54e9;
    fill: #242424;
    filter: drop-shadow( 3px 5px 2px #4776e6);
  }
  .ended-modal {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .select-placeholder {
    width: 100px;
    height: 200px;
    background-color: #333;
  }
  .selected-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .selected-option img {
    width: 100px;
    height: 200px;
  }
  .battle-field {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    flex-grow: 1;
  }
  .message {
    font-size: 20px;
    color: white;
  }
  .options {
    display: flex;
    justify-content: space-between;
  }
  .option img {
    width: 100px;
    height: 200px;
  }
  .modal {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(4px);
    gap: 40px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loader-wrapp {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 20px;
  }
  .battle-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    width: 100%;
  }
  .choose-text {
    font-size: 30px;
    color: white;
  }
  .round {
    color: white;
    font-size: 40px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .battle-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .battle {
    display: flex;
    gap: 20px;
  }
  button {
    width: 100px;
    height: 50px;
    background-color: #333;
    border: none;
    color: #d0adf0;
    cursor: pointer;
  }
  .participants {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }
  .participant {
    font-size: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  /* your styles go here */
</style>
