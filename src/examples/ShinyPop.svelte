<script lang="ts">
  import { SphereGeometry, Vector3 } from "three";
  import { useFrame } from "@threlte/core";
  import BubbleEmitter from "$lib/components/BubbleEmitter.svelte";
  import { BubbleEventEmitter } from "$lib/events/BubbleEventEmitter";
  import type { BubbleEmitterParams, BubbleParams } from "$lib/types/bubble";
  import { ParamsStore } from "$lib/stores/ParamsStore";

  const eventEmitter = new BubbleEventEmitter();

  // Events usage example

  // onMount(() => {
  //   eventEmitter.addListener('creationStarted', () => console.log("Bubble created"));
  //   eventEmitter.addListener('removalFinished', () => console.log("Bubble removed"));
  // });

  let mousePosition = new Vector3();
  let mouseVelocity = new Vector3();
  let lastMousePosition = new Vector3();

  // Emitter configuration
  const emitterConfig: BubbleEmitterParams = {
    spawnCondition: false,
    bubbleSize: { min: 2, max: 5 },
    scatterAngle: { min: -30, max: 30 },
  };

  // Bubble configuration
  const bubbleConfig: BubbleParams = {
    id: '',
    state: "creating",
    position: new Vector3(),
    origin: new Vector3(),
    velocity: new Vector3(),
    size: 10,
    opacity: 1.0,
    geometry: new SphereGeometry(1, 64),
    animationSpeed: 0.2,
    smoothDeformWaveSin: 2.0,
    smoothDeformWaveCos: 2.0,
    smoothDeformSpeedSin: 0.5,
    smoothDeformSpeedCos: 0.5,
    smoothDeformStrengthSin: 0.2,
    smoothDeformStrengthCos: 0.2,
    baseColor: new Vector3(0.53, 0.94, 1.0),
    borderColor: new Vector3(1.0, 1.0, 1.0),
    reflectionColor: new Vector3(1.0, 1.0, 1.0),
    baseAlpha: 0.1,
    borderAlpha: 0.6,
    glowStrength: 1.6,
    gradientStrength: 0.4,
    gradientSpeed: 0.1,
    fresnel: new Vector3(0.0, 0.0, 1.0),
    fresnelStrength: 3.0,
    noiseFrequency: 0.8,
    noiseAmplitude: 0.1,
    seed: Math.random() * 1000,
    bubbleFilter: (bubble) => {
      return (
        bubble.position.y < window.innerHeight &&
        bubble.position.y > -window.innerHeight / 2 &&
        bubble.position.x > -window.innerWidth / 2 &&
        bubble.position.x < window.innerWidth / 2 &&
        bubble.size >= 2
      );
    },
    bubbleModifier: (bubble) => {
      bubble.position.add(bubble.velocity);
      bubble.size -= 0.1;
      bubble.velocity.x += Math.random() * 0.4 - 0.2;
      bubble.velocity.y += Math.random() * 0.4 - 0.2;
      bubble.velocity.multiplyScalar(0.98);
      bubble.geometry = new SphereGeometry(1, Math.min(64, bubble.size * 10));
    },
    createAnimation: {
      params: (bubble) => {
        bubble.size *= 1.05;
        bubble.position.add(bubble.velocity);
        bubble.velocity.x += Math.random() * 0.4 - 0.2;
        bubble.velocity.y += Math.random() * 0.4 - 0.2;
        bubble.fresnelStrength += 0.2;
      },
      duration: 200,
    },
    removeAnimation: {
      params: (bubble) => {
        bubble.size *= 1.2;
        bubble.velocity.x += Math.random() * 0.4 - 0.2;
        bubble.velocity.y += Math.random() * 0.4 - 0.2;
        bubble.position.add(bubble.velocity);
        bubble.fresnelStrength -= 0.2;
      },
      duration: 100,
    },
  };

  const emitterStore = new ParamsStore<BubbleEmitterParams>(emitterConfig);
  const bubbleStore = new ParamsStore<BubbleParams>(bubbleConfig);

  let emitterParams: BubbleEmitterParams;
  let bubbleParams: BubbleParams;

  emitterStore.subscribe((value) => {
    emitterParams = value;
  });

  bubbleStore.subscribe((value) => {
    bubbleParams = value;
  });

  function handleMouseMove(event: MouseEvent) {
    mousePosition.set(
      event.clientX - window.innerWidth / 2,
      -event.clientY + window.innerHeight / 2,
      0
    );
    mouseVelocity.subVectors(mousePosition, lastMousePosition);

    if (mouseVelocity.length() > 30) {
      mouseVelocity.setLength(30);
    }

    mouseVelocity.multiplyScalar(-0.2);
    lastMousePosition.copy(mousePosition);
  }

  // This function is responsible for updating the state in each frame.
  // New bubbles are spawned based on changing values, effectively initializing a bubble for each new value.

  useFrame(() => {
    bubbleStore.updatePartial({
      id: crypto.randomUUID().toString(),
      position: mousePosition,
      origin: mousePosition,
      velocity: mouseVelocity,
    });
    emitterStore.updatePartial({
      spawnCondition:
        Math.random() >= (1 / Math.pow(mouseVelocity.length(), 1.2)) * 2,
    });
  });
</script>

<svelte:window on:mousemove={handleMouseMove} />

<BubbleEmitter {emitterParams} {eventEmitter} {bubbleParams} />
