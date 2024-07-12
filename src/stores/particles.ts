import type { Container } from "@tsparticles/engine";
import type { IOptions } from "@tsparticles/engine"
import { writable } from "svelte/store";

export const particles = writable<Container>();

export let particlesConfig: IOptions = {
    fullScreen: {
      zIndex: 1,
    },
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "emitter",
        },
      },
    },
    particles: {
      number: {
        value: 0,
      },
      color: {
        value: ["#9e9d9d", "#8e54e9", "#4776e6"],
      },
      shape: {
        type: "circle",
        options: {},
      },
      opacity: {
        value: {
          min: 0,
          max: 1,
        },
        animation: {
          enable: true,
          speed: 2,
          startValue: "max",
          destroy: "min",
        },
      },
      size: {
        value: {
          min: 2,
          max: 4,
        },
      },
      links: {
        enable: false,
      },
      life: {
        duration: {
          sync: true,
          value: 5,
        },
        count: 1,
      },
      move: {
        enable: true,
        gravity: {
          enable: true,
          acceleration: 10,
        },
        speed: {
          min: 10,
          max: 20,
        },
        decay: 0.1,
        direction: "none",
        straight: false,
        outModes: {
          default: "destroy",
          top: "none",
        },
      },
      rotate: {
        value: {
          min: 0,
          max: 360,
        },
        direction: "random",
        move: true,
        animation: {
          enable: true,
          speed: 60,
        },
      },
      tilt: {
        direction: "random",
        enable: true,
        move: true,
        value: {
          min: 0,
          max: 360,
        },
        animation: {
          enable: true,
          speed: 60,
        },
      },
      roll: {
        darken: {
          enable: true,
          value: 25,
        },
        enable: true,
        speed: {
          min: 15,
          max: 25,
        },
      },
      wobble: {
        distance: 30,
        enable: true,
        move: true,
        speed: {
          min: -15,
          max: 15,
        },
      },
    },
    emitters: {
      life: {
        count: 1,
        duration: 0.1,
        delay: 0.4,
      },
      rate: {
        delay: 0.1,
        quantity: 500,
      },
      size: {
        width: 0,
        height: 0,
      },
    },
};
  
export const sideConfig = {
    "fullScreen": {
      "zIndex": 1
    },
    "emitters": [
      {
        "position": {
          "x": 0,
          "y": 30
        },
        "rate": {
          "quantity": 100,
          "delay": 0.15
        },
        "particles": {
          "move": {
            "direction": "top-right",
            "outModes": {
              "top": "none",
              "left": "none",
              "default": "destroy"
            }
          }
        }
      },
      {
        "position": {
          "x": 100,
          "y": 30
        },
        "rate": {
          "quantity": 100,
          "delay": 0.15
        },
        "particles": {
          "move": {
            "direction": "top-left",
            "outModes": {
              "top": "none",
              "right": "none",
              "default": "destroy"
            }
          }
        }
      }
    ],
    "particles": {
      "color": {
        "value": [
          "#9e9d9d", "#8e54e9", "#4776e6"
        ]
      },
      "move": {
        "decay": 0.05,
        "direction": "top",
        "enable": true,
        "gravity": {
          "enable": true
        },
        "outModes": {
          "top": "none",
          "default": "destroy"
        },
        "speed": {
          "min": 10,
          "max": 50
        }
      },
      "number": {
        "value": 0
      },
      "opacity": {
        "value": 1
      },
      "rotate": {
        "value": {
          "min": 0,
          "max": 360
        },
        "direction": "random",
        "animation": {
          "enable": true,
          "speed": 30
        }
      },
      "tilt": {
        "direction": "random",
        "enable": true,
        "value": {
          "min": 0,
          "max": 360
        },
        "animation": {
          "enable": true,
          "speed": 30
        }
      },
      "size": {
        "value": {
          "min": 0,
          "max": 2
        },
        "animation": {
          "enable": true,
          "startValue": "min",
          "count": 20,
          "speed": 16,
          "sync": true
        }
      },
      "roll": {
        "darken": {
          "enable": true,
          "value": 25
        },
        "enable": true,
        "speed": {
          "min": 5,
          "max": 15
        }
      },
      "wobble": {
        "distance": 30,
        "enable": true,
        "speed": {
          "min": -7,
          "max": 7
        }
      },
      "shape": {
        "type": [
          "circle",
          "square"
        ],
        "options": {}
      }
    }
} 
export const particlesMode = writable<"side" | "click">("side");
export default particles