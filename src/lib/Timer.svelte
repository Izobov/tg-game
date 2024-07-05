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
      const totalSeconds = differenceInSeconds(end, currentTime);
      const duration = intervalToDuration({ start: 0, end: totalSeconds * 1000 });
  
      return {
        hours: duration.hours,
        minutes: duration.minutes,
        seconds: duration.seconds,
        totalSeconds: totalSeconds
      };
    }
  </script>
  
  <div>
    <p>{remainingTime.hours}:{remainingTime.minutes}:{remainingTime.seconds}</p>
  </div>
  