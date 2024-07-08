<script lang="ts">
    import { onMount } from 'svelte';
    import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns';
  
    export let end: Date;
    let currentTime = new Date();
  
    let remainingTime = calculateRemainingTime();
  
    let timer: number;
  
    onMount(() => {
      timer = setInterval(() => {
        currentTime = new Date();
        remainingTime = calculateRemainingTime();
  
        if (remainingTime.totalSeconds <= 0) {
          clearInterval(timer);
          remainingTime = { hours: 0, minutes: 0, seconds: 0 };
        }
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
    });
  
    function calculateRemainingTime() {
      const duration = intervalToDuration({ start: currentTime, end });
    
      return {
        hours: duration.hours || 0,
        minutes: duration.minutes || 0,
        seconds: duration.seconds || 0,
      };
    }

    function addDiggits(number) {
        if(number >= 10) return `${number}`;
        return `0${number}`
    }
  </script>
  
  <div>
    {addDiggits(remainingTime.hours)}:{addDiggits(remainingTime.minutes)}:{addDiggits(remainingTime.seconds)}
  </div>
  