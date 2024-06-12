import { writable } from "svelte/store";

export const balance = writable(0);
let interval: number | undefined;
export function mint() {
    const start = Date.now();
    interval = setInterval(() => {
        const delta = Date.now() - start;
        balance.update((b) => b + 1);
        if (delta > 10000) {
            clearInterval(interval);
        }
    }, 1000);
} 