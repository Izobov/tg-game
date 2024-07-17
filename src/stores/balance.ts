import { cubicOut } from "svelte/easing";
import { tweened } from "svelte/motion";
import { writable } from "svelte/store";

export const balance = tweened(0, {
    duration: 1500,
    easing: cubicOut,
  });
export const isMining = writable(false);

export function animateCounter(){}