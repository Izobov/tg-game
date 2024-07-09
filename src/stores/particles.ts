import type {Container} from "@tsparticles/engine";
import { writable } from "svelte/store";

const particles = writable<Container>()
export default particles