<script lang="ts">
  import { SphereGeometry, Vector3 } from "three";
  import { useFrame } from "@threlte/core";
  import BubbleEmitter from "$lib/components/BubbleEmitter.svelte";
  import { BubbleEventEmitter } from "$lib/events/bubbleEvents";
  import type { BubbleEmitterParams, BubbleParams } from "$lib/types/bubble";
  import { ParamsStore } from "$lib/stores/ParamsStore";

  const eventEmitter = new BubbleEventEmitter();

  // Emitter configuration
  const emitterConfig: BubbleEmitterParams = {
    spawnCondition: false,
    bubbleSize: { min: 1, max: 3 },
    maxBubbles: 9999,
  };

  // Bubble configuration
  const bubbleConfig: BubbleParams = {
    id: '',
    state: "creating",
    position: new Vector3(),
    origin: new Vector3(),
    velocity: new Vector3(0, 1, 0),
    size: 10,
    opacity: 0.05,
    geometry: new SphereGeometry(1, 16, 16),
    animationSpeed: 0.1,
    smoothDeformWaveSin: 2.0,
    smoothDeformWaveCos: 2.0,
    smoothDeformSpeedSin: 0.5,
    smoothDeformSpeedCos: 0.5,
    smoothDeformStrengthSin: 0.2,
    smoothDeformStrengthCos: 0.2,
    baseColor: new Vector3(0.53, 0.94, 1.0),
    borderColor: new Vector3(1.0, 1.0, 1.0),
    reflectionColor: new Vector3(1.0, 1.0, 1.0),
    baseAlpha: 0.02,
    borderAlpha: 0.6,
    glowStrength: 0.1,
    gradientStrength: 0.2,
    gradientSpeed: 0.1,
    fresnel: new Vector3(0.0, 0.0, 1.0),
    fresnelStrength: 0.0,
    noiseFrequency: 0.8,
    noiseAmplitude: 0.1,
    seed: Math.random() * 1000,
    bubbleFilter: (bubble: BubbleParams) => {
      return (
        bubble.position.y < window.innerHeight / 2 &&
        bubble.position.y > -window.innerHeight / 2 &&
        bubble.position.x > -window.innerWidth / 2 &&
        bubble.position.x < window.innerWidth / 2
      );
    },
    bubbleModifier: (bubble: BubbleParams) => {
      bubble.position.add(bubble.velocity);
      bubble.position.x =
        bubble.origin.x +
        (bubble.velocity.y / 2) * Math.sin(bubble.position.y / 50);
    },
    createAnimation: {
      params: (bubble: BubbleParams) => {
        bubble.position.add(bubble.velocity);
        bubble.size *= 1.005;
        bubble.fresnelStrength += 0.01 * bubble.velocity.y;
        bubble.opacity += bubble.velocity.y / 200;
        bubble.position.x =
          bubble.origin.x +
          (bubble.velocity.y / 2) * Math.sin(bubble.position.y / 50);
      },
      duration: 2000,
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

  useFrame(() => {
    const bubbleOrigin = new Vector3(
      Math.random() * window.innerWidth - window.innerWidth / 2,
      -window.innerHeight / 2,
      0
    );
    bubbleStore.updatePartial({
      id: crypto.randomUUID().toString(),
      position: bubbleOrigin,
      origin: bubbleOrigin,
      velocity: new Vector3(0, Math.random() + 0.1 * 2, 0),
    });
    emitterStore.updatePartial({
      spawnCondition: Math.random() <= 0.3,
    });
  });
</script>

<BubbleEmitter {emitterParams} {eventEmitter} {bubbleParams} />
