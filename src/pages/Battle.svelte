<script>
  import { onMount } from "svelte";
  import Loader from "../components/Loader.svelte";
  import PaperImg from "../assets/paper.png";
  import RockImg from "../assets/rock.png";
  import ScissorsImg from "../assets/scissors.png";
  let loading = true;
  let round = 1;
  let scoreUser = 0;
  let scoreOpponent = 0;
  let choosing = true;
  let selected = null;
  let opponentSelect = null;
  let waitingOpponent = false;
  let message = "";
  let winner = false;
  let ended = false;
  const options = [
    { name: "rock", img: RockImg, win: "scissors", lose: "paper" },
    { name: "paper", img: PaperImg, win: "rock", lose: "scissors" },
    { name: "scissors", img: ScissorsImg, win: "paper", lose: "rock" },
  ];
  onMount(() => {
   load();
  });
  function load () {
    setTimeout(() => {
      loading = false;
    }, 2000);
  }
  function choose(option) {
    choosing = false;
    selected = option;
    waitingOpponent = true;
    setTimeout(() => {
      opponentChoose();
    }, 2000);
  }

  function reset() {
    scoreUser = 0;
    scoreOpponent = 0;
    round = 1;
    selected = null;
    opponentSelect = null;
    message = "";
    choosing = true;
    ended = false;
    load();
  }

  function opponentChoose() {
    waitingOpponent = false;
    opponentSelect = options[Math.floor(Math.random() * options.length)];
    setTimeout(() => {
      startRound();
    }, 500);
  }
  let prize = 0;
  function animateBalance() {
    if (winner) {
      while (prize !== 100) {
        prize++;
      }
    } else {
      while (prize !== -50) {
        prize--;
      }
    }
  }

  function summarize() {
    winner = scoreUser === 3;
    ended = true;
    message = `You ${winner ? "win" : "lose"}`;
    animateBalance();
  }

  function startRound() {
    if (selected.win === opponentSelect.name) {
      scoreUser++;
      message = "You win!";
    } else if (selected.lose === opponentSelect.name) {
      scoreOpponent++;
      message = "You lose!";
    } else {
      message = "Draw!";
    }
    if (scoreOpponent === 3 || scoreUser === 3) {
      summarize();
      return
    }
    round++;
    setTimeout(() => {
      opponentSelect = null;
      message = "";
      selected = null;
      choosing = true;
    }, 2000);
  }
  // your script goes here
</script>

<h1>Battle</h1>

{#if loading}
  <div class="loader-wrapp">
    <span> looking for opponent </span>
    <Loader />
  </div>
{:else}
  <div class="battle-wrap">
    <div class="round">
      Round: {round}
    </div>
    <div class="participants">
      <div class="participant">
        <div class="score">
          You: {scoreUser}
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
          User1: {scoreOpponent}
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
      <button on:click={reset}>
        start again
      </button>
    </div>
  </div>
  <!-- content here -->
{/if}

<style>
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
