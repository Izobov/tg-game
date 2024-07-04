import { writable } from "svelte/store";


interface User { 
    id: BigInt;
    first_name: string;
    last_name: string;
    isMining: boolean;
    personalMinted: number;
    lastMining: Date;
    tokenBalance: number;
}

const user = writable<User>({} as User);

export { user };