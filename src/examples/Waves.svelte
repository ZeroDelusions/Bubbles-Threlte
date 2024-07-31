<script lang="ts">
  import { SphereGeometry, Vector3 } from "three";
  import { BubbleEventEmitter } from "$lib/events/BubbleEventEmitter";
  import type { BubbleParams } from "$lib/types/bubble";
  import { ParamsStore } from "$lib/stores/ParamsStore";
  import Bubble from "$lib/components/Bubble.svelte";

  const eventEmitter = new BubbleEventEmitter();

  // Events usage example

  // onMount(() => {
  //   eventEmitter.addListener('creationStarted', () => console.log("Bubble created"));
  //   eventEmitter.addListener('removalFinished', () => console.log("Bubble removed"));
  // });

  // Bubble configuration
  const bubbleConfig: BubbleParams = {
    id: '',
    state: "creating",
    position: new Vector3(),
    origin: new Vector3(),
    velocity: new Vector3(0, 1, 0),
    size: 200,
    opacity: 1.0,
    geometry: new SphereGeometry(1, 512, 512),
    animationSpeed: 0.1,
    smoothDeformWaveSin: 20.0,
    smoothDeformWaveCos: 2.0,
    smoothDeformSpeedSin: 0.5,
    smoothDeformSpeedCos: 0.0,
    smoothDeformStrengthSin: 0.15,
    smoothDeformStrengthCos: 0.15,
    baseColor: new Vector3(0.1, 0.1, 0.1),
    borderColor: new Vector3(1.0, 1.0, 1.0),
    reflectionColor: new Vector3(1.0, 1.0, 1.0),
    baseAlpha: 0.2,
    borderAlpha: 0.1,
    glowStrength: 0.8,
    gradientStrength: 0.0,
    gradientSpeed: 0.1,
    fresnel: new Vector3(0.0, 0.0, 1.0),
    fresnelStrength: 0.2,
    noiseFrequency: 1000.0,
    noiseAmplitude: 0.01,
    seed: Math.random() * 1000
  };

  const bubbleStore = new ParamsStore<BubbleParams>(bubbleConfig);

  let bubbleParams: BubbleParams;

  bubbleStore.subscribe((value) => {
    bubbleParams = value;
  });

</script>

<Bubble data={bubbleParams} {eventEmitter} />
