import { writable } from "svelte/store";


interface MiningConfig { 
    availableMining: number
    maxMining:       BigInt
    miningSpeed:    number
    tokensPerClick:  number
    minted:          BigInt
}

const mining = writable<MiningConfig>({} as MiningConfig);

export { mining };