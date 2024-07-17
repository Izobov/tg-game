import { writable } from "svelte/store";

export const coins = writable({ show: false, amount: 0, source: null, target: null, decreesStore: null });