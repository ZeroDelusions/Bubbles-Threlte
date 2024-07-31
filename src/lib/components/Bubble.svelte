<script lang="ts">
  import { T, useFrame } from "@threlte/core";
  import { Object3D, ShaderMaterial, Vector3 } from "three";
  import { onDestroy, onMount } from "svelte";
  import vertexShader from "../shaders/vertexShader.glsl?raw";
  import fragmentShader from "../shaders/fragmentShader.glsl?raw";
  import type { BubbleParams } from "../types/bubbleParams";
  import { BubbleEventEmitter } from "../events/BubbleEventEmitter";

  export let data: BubbleParams;
  export let eventEmitter: BubbleEventEmitter | undefined = undefined;

  let time = 0;
  let startTime = 0;

  let bubbleMaterial: ShaderMaterial;

  function createBubbleMaterial(params: BubbleParams): ShaderMaterial {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        seed: { value: params.seed },
        smoothDeformWaveSin: { value: params.smoothDeformSpeedSin },
        smoothDeformWaveCos: { value: params.smoothDeformSpeedCos },
        smoothDeformSpeedSin: { value: params.smoothDeformSpeedSin },
        smoothDeformSpeedCos: { value: params.smoothDeformSpeedCos },
        smoothDeformStrengthSin: { value: params.smoothDeformStrengthSin },
        smoothDeformStrengthCos: { value: params.smoothDeformStrengthCos },
        opacity: { value: params.opacity },
        baseColor: { value: params.baseColor },
        borderColor: { value: params.borderColor },
        reflectionColor: { value: params.reflectionColor },
        baseAlpha: { value: params.baseAlpha },
        borderAlpha: { value: params.borderAlpha },
        glowStrength: { value: params.glowStrength },
        gradientStrength: { value: params.gradientStrength },
        gradientSpeed: { value: params.gradientSpeed },
        fresnel: { value: params.fresnel },
        fresnelStrength: { value: params.fresnelStrength },
        noiseFrequency: { value: params.noiseFrequency },
        noiseAmplitude: { value: params.noiseAmplitude },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
  }

  function updateBubbleMaterial(material: ShaderMaterial, data: BubbleParams): void {
  if (!material || !material.uniforms) return;

  // Update time-based uniforms
  material.uniforms.time.value += data.animationSpeed;
  material.uniforms.seed.value = data.seed;

  // Update deformation uniforms
  material.uniforms.smoothDeformWaveSin.value = data.smoothDeformWaveSin;
  material.uniforms.smoothDeformWaveCos.value = data.smoothDeformWaveCos;
  material.uniforms.smoothDeformSpeedSin.value = data.smoothDeformSpeedSin;
  material.uniforms.smoothDeformSpeedCos.value = data.smoothDeformSpeedCos;
  material.uniforms.smoothDeformStrengthSin.value = data.smoothDeformStrengthSin;
  material.uniforms.smoothDeformStrengthCos.value = data.smoothDeformStrengthCos;

  // Update color and appearance uniforms
  material.uniforms.opacity.value = data.opacity;
  material.uniforms.baseColor.value.copy(data.baseColor);
  material.uniforms.borderColor.value.copy(data.borderColor);
  material.uniforms.reflectionColor.value.copy(data.reflectionColor);
  material.uniforms.baseAlpha.value = data.baseAlpha;
  material.uniforms.borderAlpha.value = data.borderAlpha;
  material.uniforms.glowStrength.value = data.glowStrength;
  material.uniforms.gradientStrength.value = data.gradientStrength;
  material.uniforms.gradientSpeed.value = data.gradientSpeed;

  // Update fresnel uniforms
  material.uniforms.fresnel.value.copy(data.fresnel);
  material.uniforms.fresnelStrength.value = data.fresnelStrength;

  // Update noise uniforms
  material.uniforms.noiseFrequency.value = data.noiseFrequency;
  material.uniforms.noiseAmplitude.value = data.noiseAmplitude;

  // Ensure the material knows it needs to update
  material.needsUpdate = true;
}

  onMount(() => {
    startTime = performance.now();
    bubbleMaterial = createBubbleMaterial(data);
    eventEmitter?.emit({ type: "creationStarted", bubble: data });
  });

  onDestroy(() => {
    data.geometry.dispose();
    bubbleMaterial.dispose();
  });

  useFrame(() => {
    time += data.animationSpeed;
    bubbleMaterial.uniforms.time.value = time;
    const elapsedTime = performance.now() - startTime;

    updateBubbleState(elapsedTime);
    updateBubbleMaterial(bubbleMaterial, data);

    eventEmitter?.emit({ type: "move", bubble: data });
    data = data;
  });

  function updateBubbleState(elapsedTime: number): void {
    switch (data.state) {
      case "creating":
        handleCreatingState(elapsedTime);
        break;
      case "active":
        handleActiveState();
        break;
      case "removing":
        handleRemovingState(elapsedTime);
        break;
    }
  }

  function handleCreatingState(elapsedTime: number): void {
    const createDuration = data.createAnimation?.duration || 0;
    const createProgress = Math.min(elapsedTime / createDuration, 1);

    if (data.createAnimation?.params) {
      data.createAnimation.params(data);
    }

    if (createProgress >= 1) {
      data.state = "active";
      eventEmitter?.emit({ type: "creationFinished", bubble: data });
    }
  }

  function handleActiveState(): void {
    if (data.bubbleModifier) {
      data.bubbleModifier(data);
    }

    if (data.bubbleFilter && !data.bubbleFilter(data)) {
      data.state = "removing";
      startTime = performance.now();
    }
  }

  function handleRemovingState(elapsedTime: number): void {
    const removeDuration = data.removeAnimation?.duration || 0;
    const removeProgress = Math.min(elapsedTime / removeDuration, 1);

    if (data.removeAnimation?.params) {
      data.removeAnimation.params(data);
    }

    if (removeProgress === 0) {
      eventEmitter?.emit({ type: "removalStarted", bubble: data });
    }

    if (removeProgress >= 1) {
      eventEmitter?.emit({ type: "removalFinished", bubble: data });
    }
  }
</script>

<T.Mesh
  geometry={data.geometry}
  material={bubbleMaterial}
  scale={data.size}
  position={[data.position.x, data.position.y, data.position.z]}
/>
