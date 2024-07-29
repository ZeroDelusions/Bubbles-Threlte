<script lang="ts">
  import { T, useFrame } from "@threlte/core";
  import Bubble from "./Bubble.svelte";
  import { BubbleStore } from "../stores/BubbleStore";
  import type { BubbleEmitterParams, BubbleParams } from "../types/bubble";
  import { BubbleEventEmitter } from "../events/bubbleEvents";
  import { addRandomRotation } from "../utils/animation";
  import { onMount } from "svelte";

  export let emitterParams: BubbleEmitterParams;
  export let bubbleParams: BubbleParams;
  export let eventEmitter: BubbleEventEmitter;

  const bubbleStore = new BubbleStore(emitterParams.maxBubbles, true, true
  );

  function createBubble(): void {
    if (shouldCreateBubble()) {
      const newBubbleParams = generateBubbleParams();
      bubbleStore.addBubble(newBubbleParams);
    }
  }

  function shouldCreateBubble(): boolean {
    const { spawnCondition } = emitterParams;
    return (
      (spawnCondition === undefined || spawnCondition)
    );
  }

  function generateBubbleParams(): BubbleParams {
    const velocity = emitterParams.velocity || bubbleParams.velocity;
    const angleMouseVelocity = emitterParams.scatterAngle
      ? addRandomRotation(
          velocity,
          emitterParams.scatterAngle.min,
          emitterParams.scatterAngle.max
        )
      : velocity;

    const bubbleSize = emitterParams.bubbleSize
      ? Math.random() *
          (emitterParams.bubbleSize.max - emitterParams.bubbleSize.min) +
        emitterParams.bubbleSize.min
      : bubbleParams.size;

    return {
      ...bubbleParams,
      velocity: angleMouseVelocity,
      size: bubbleSize,
      seed: Math.random() * 10000000,
    };
  }

  onMount(() => {
    const unsubscribe = eventEmitter.addListener("removalFinished", (event) => {
      bubbleStore.removeBubble(event.bubble);
    });

    return unsubscribe;
  });

  useFrame(() => {
    createBubble();
  });
  
</script>

<T.Group>
  {#each $bubbleStore as bubble (bubble.id)}
    <Bubble data={bubble} {eventEmitter} />
  {/each}
</T.Group>
