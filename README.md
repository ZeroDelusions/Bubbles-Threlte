# Bubbles-Threlte: Svelte Bubble Generator 

A highly customizable bubble generator component for Svelte applications using Threlte (Three.js for Svelte). Create stunning bubble effects with ease, perfect for interactive backgrounds, particle systems, and more.

## Installation

```bash
npm install bubbles-threlte
```
## Usage

Import the BubbleEmitter component in your Svelte file:
```ts
import BubbleEmitter from 'bubbles-threlte';
```
Set up your bubble and emitter configurations:
```ts
<script>
  import { Vector3 } from 'three';
  import type { BubbleEmitterParams, BubbleParams } from 'bubbles-threlte';
  import { useFrame } from "@threlte/core";

  const eventEmitter = new BubbleEventEmitter();

  // Optionally, setup event listeners
  onMount(() => {
    eventEmitter.addListener('creationStarted', (event) => console.log("Bubble creation started", event.bubble));
    eventEmitter.addListener('creationFinished', (event) => console.log("Bubble creation finished", event.bubble));
    eventEmitter.addListener('removalStarted', (event) => console.log("Bubble removal started", event.bubble));
    eventEmitter.addListener('removalFinished', (event) => console.log("Bubble removal finished", event.bubble));
    eventEmitter.addListener('move', (event) => console.log("Bubble moved", event.bubble));
  });

  const emitterParams: BubbleEmitterParams = {
    // Your emitter configuration
  };

  const bubbleParams: BubbleParams = {
    // Your bubble configuration
  };

  useFrame(() => {
    // Update params of your emitterParams and/or bubbleParams to generate new bubbles with this new data
  });
</script>
```

Use the BubbleEmitter component in your Svelte template:

```ts
<BubbleEmitter {emitterParams} {bubbleParams} {eventEmitter} />
```

## Configuration Parameters

<details>
--------------------
<br/><br/>
<summary>BubbleParams</summary>

The `BubbleParams` interface provides extensive customization for individual bubbles: <br/><br/>

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique identifier for the bubble. |
| `state` | `"creating" \| "active" \| "removing"` | Current state of the bubble in its lifecycle. |
| `position` | `Vector3` | The bubble's position in 3D space. |
| `origin` | `Vector3` | The original spawn position of the bubble. |
| `velocity` | `Vector3` | The bubble's current velocity. |
| `size` | `number` | The size of the bubble. |
| `opacity` | `number` | The overall opacity of the bubble. |
| `geometry` | `SphereGeometry` | The Three.js geometry used for the bubble. |
| `animationSpeed` | `number` | Speed of the bubble's animation. |
| `smoothDeformWaveSin` | `number` | Frequency of sinusoidal deformation. |
| `smoothDeformWaveCos` | `number` | Frequency of cosinusoidal deformation. |
| `smoothDeformSpeedSin` | `number` | Speed of sinusoidal deformation. |
| `smoothDeformSpeedCos` | `number` | Speed of cosinusoidal deformation. |
| `smoothDeformStrengthSin` | `number` | Strength of sinusoidal deformation. |
| `smoothDeformStrengthCos` | `number` | Strength of cosinusoidal deformation. |
| `baseColor` | `Vector3` | The base color of the bubble (RGB). |
| `borderColor` | `Vector3` | The color of the bubble's border (RGB). |
| `reflectionColor` | `Vector3` | The color of reflections on the bubble (RGB). |
| `baseAlpha` | `number` | The base alpha (transparency) of the bubble. |
| `borderAlpha` | `number` | The alpha (transparency) of the bubble's border. |
| `glowStrength` | `number` | The strength of the bubble's glow effect. |
| `gradientStrength` | `number` | The strength of the color gradient effect. |
| `gradientSpeed` | `number` | The speed of the color gradient animation. |
| `fresnel` | `Vector3` | Parameters for the Fresnel effect (edge highlighting). |
| `fresnelStrength` | `number` | The strength of the Fresnel effect. |
| `noiseFrequency` | `number` | The frequency of noise applied to the bubble's surface. |
| `noiseAmplitude` | `number` | The amplitude of noise applied to the bubble's surface. |
| `seed` | `number` | A random seed for consistent randomization. |
| `bubbleFilter` | `(bubble: BubbleParams) => boolean` | A function to determine if a bubble should be removed. |
| `bubbleModifier` | `(bubble: BubbleParams) => void` | A function to modify bubble properties on each frame. |
| `createAnimation` | `BubbleAnimation` | Animation parameters for bubble creation. |
| `removeAnimation` | `BubbleAnimation` | Animation parameters for bubble removal. |
</details>

<details>
--------------------
<br/><br/>
<summary>BubbleAnimation</summary>

The `BubbleAnimation` interface is used for both `createAnimation` and `removeAnimation`: <br/><br/>

| Parameter | Type | Description |
|-----------|------|-------------|
| `params` | `(bubble: BubbleParams) => void` | A function to update bubble parameters during the animation. |
| `duration` | `number` | The duration of the animation in milliseconds. |

These parameters provide extensive control over both the emission of bubbles and the appearance and behavior of individual bubbles. By adjusting these values, you can create a wide range of effects, from realistic soap bubbles to abstract particle systems.
</details>

<details>
--------------------
<br/><br/>
<summary>BubbleEmitterParams</summary>
The `BubbleEmitterParams` interface allows you to configure the behavior of the bubble emitter: <br/><br/>

| Parameter | Type | Description |
|-----------|------|-------------|
| `spawnCondition` | `boolean` | Determines whether new bubbles should be spawned. |
| `velocity` | `Vector3` | The initial velocity applied to newly spawned bubbles. |
| `bubbleSize` | `{ min: number; max: number }` | Defines the size range for spawned bubbles. |
| `scatterAngle` | `{ min: number; max: number }` | Sets the range of angles (in degrees) for random direction scatter upon spawn. |
| `maxBubbles` | `number` | The maximum number of bubbles that can exist simultaneously. |
</details>

<details>
--------------------
<br/><br/>
<summary>Event Emitter</summary>
The BubbleEventEmitter allows you to listen for various events during the lifecycle of bubbles. Available events include: <br/><br/>

| Parameter | Description |
|-----------|-------------|
| `creationStarted` | Fired when a bubble starts its creation animation |
| `creationFinished ` | Fired when a bubble completes its creation animation |
| ` removalStarted ` | Fired when a bubble starts its removal animation |
| ` removalFinished ` | Fired when a bubble completes its removal animation |
| ` move ` | Fired on each frame update for active bubbles |

These events can be used to trigger custom behaviors or synchronize other elements of your application with the bubble animations.
</details>

## Examples

<table>
<tr>
<td>

### ShinyPop: Interactive Mouse-driven Bubbles

The ShinyPop example demonstrates how to create interactive bubbles that respond to mouse movement. 
Key features:

- Bubbles spawn based on mouse velocity
- Custom bubble physics for realistic movement
- Smooth creation and removal animations

This example showcases the potential for creating engaging, interactive backgrounds or particle effects that respond to user input.

</td>
<td>
  <img src="https://github.com/user-attachments/assets/fea2be35-5909-4810-8752-c45feae4c7c4">
</picture>
</td>
</tr>
<tr>
<td>

### ScreenCover: Full-screen Bubble Animation

The ScreenCover example illustrates how to create a full-screen bubble animation. 
Key features:

- Bubbles rise from the bottom of the screen
- Subtle wave-like horizontal movement
- Gradual size increase and opacity changes

This example is perfect for creating ambient background animations or loading screens with a soothing, aquatic feel.

</td>
<td>
<picture>
  <img src="https://github.com/user-attachments/assets/f3be3b7e-51ce-49d6-ba64-f4c2ad895202">
</picture>
</td>
</tr>
<tr>
<td>

### VoidStar: Abstract Cosmic Effect

The VoidStar example creates an abstract, cosmic-like effect using a single, highly detailed bubble. 
Key features:

- High-resolution sphere geometry
- Subtle deformations for an organic feel

This example demonstrates how to use the bubble generator for creating unique, abstract visual effects beyond traditional bubble animations.


</td>
<td>
<picture>
  <img src="https://github.com/user-attachments/assets/8dc58de0-ad64-460b-a083-4298d8885325">
</picture>
</td>
</tr>
<tr>
<td>

### Waves: Dynamic Wave Simulation

The Waves example showcases how to create a dynamic wave-like effect using a single, large bubble. 
Key features:

- Custom deformation parameters for wave-like movement
- High-frequency noise for detailed surface texture
- Fresnel effect for light interaction

This example illustrates the potential for using the bubble generator to create more complex, fluid-like animations and effects.

</td>
<td>
<picture>
  <img src="https://github.com/user-attachments/assets/a869f540-2a04-4849-94c8-1bce3afbd8d3">
</picture>
</td>
</tr>
</table>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
