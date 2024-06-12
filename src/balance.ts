import { writable } from "svelte/store";

export const balance = writable(0);
export const isMining = writable(false);
let interval: number | undefined;
export function mint() {
    if (interval) {
        return;
    }
    const start = Date.now();
    isMining.set(true);
    interval = setInterval(() => {
        const delta = Date.now() - start;
        balance.update((b) => b + 1);
        if (delta > 10000) {
            clearInterval(interval);
            isMining.set(false);
        }
    }, 1000);
} 