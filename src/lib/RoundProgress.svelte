<script>
  import { createEventDispatcher, onMount } from "svelte";
  export let count = 80;
  export let size = "160px";
  export let circleWidth = 20;

  let counter = 0;
  const dispatch = createEventDispatcher();
  // $: strokeDashoffset = strokeDasharray - (strokeDasharray * count) / 100;
  $: anim_duration = 30 * count;
  $: c = size / 2;
  $: perimeter = 2 * Math.PI * radius;
  $: radius = (size - circleWidth) / 2;
  $: strokeDasharray = perimeter; // 2πr, где r = 70
  $: strokeDashoffset = strokeDasharray - (strokeDasharray * count) / 100;
  onMount(() => {
    const interval = setInterval(() => {
      if (counter >= count) {
        clearInterval(interval);
        return;
      }
      counter += 1;
    }, 30);
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="skill"
  on:click={() => dispatch("click")}
  style="height: {size}px; width: {size}px"
  {...$$restProps}
>
  <div class="outer" style="padding: {circleWidth}px;">
    <div class="inner">
      <slot class="placeholder">{counter}%</slot>
    </div>
  </div>
  {#if count}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={size}
      height={size}
    >
      <defs>
        <linearGradient id="gradientColor">
          <stop offset="0%" stop-color="#4776e6" />
          <stop offset="100%" stop-color="#8e54e9" />
        </linearGradient>
      </defs>
      <circle
        cx={c}
        cy={c}
        r={radius}
        stroke-linecap="round"
        stroke-width={circleWidth}
        stroke-dasharray={strokeDasharray}
      >
        <animate
          attributeName="stroke-dashoffset"
          from={strokeDasharray}
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.25 0.1 0.25 1"
          to={strokeDashoffset}
          dur="{anim_duration}ms"
          fill="freeze"
        />
      </circle>
    </svg>
  {/if}
</div>

<style lang="scss">
  .skill {
    position: relative;

    .outer {
      height: 100%;
      width: 100%;
      padding: 20px;
      border-radius: 50%;
      // box-shadow: 4px 1px 6px 1.5px #9e9d9d;
      background: #434242;
      
      .inner {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        box-shadow: inset 0px 0px 29px 6px #040a19;
        background: #242424;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .placeholder {
      color: white;
      font-weight: 600;
      font-size: 30px;
    }

    svg {
      position: absolute;
      top: 0;
      left: 0;
      transform: rotateZ(270deg);

      circle {
        fill: none;
        stroke: url(#gradientColor);
        stroke-width: 20px;
      }
    }
  }
</style>
