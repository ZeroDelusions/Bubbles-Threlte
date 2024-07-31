<script lang="ts">
  import { Canvas, T } from "@threlte/core";
  import ScreenCover from "./ScreenCover.svelte";
  import ShinyPop from "./ShinyPop.svelte";
  import VoidStar from "./VoidStar.svelte";
  import Waves from "./Waves.svelte";
  import Illusion from "./Illusion.svelte";
</script>

<div id="container">
  <div id="canvas-container" class="size-full">
    <Canvas>
      <T.OrthographicCamera makeDefault position={[0, 0, 1000]} />
      <T.AmbientLight intensity={0.5} />
      <T.PointLight position={[0, 5, 5]} intensity={1} color="#00ffff" />
      <T.DirectionalLight position={[-5, 5, -5]} intensity={0.5} color="#0080ff" />

      <!-- Examples -->

      <ShinyPop />
      <!-- <ScreenCover /> -->
      <!-- <VoidStar /> -->
      <!-- <Waves /> -->
      <!-- <Illusion /> -->

    </Canvas>
  </div>
</div>

<style>
  #container {
    width: 100vw;
    height: 100vh;
    position: relative;
    margin: 0;
    /* For VoidStar, Waves and Illusion */ 
    /* background: black;  */

    /* For ShinyPop and ScreenCover */ 
    background: linear-gradient(65deg, rgba(21,33,47,1) 0%, rgba(29,51,100,1) 60%); 
  }

  .size-full {
    width: 100%;
    height: 100%;
  }

  #canvas-container {
    position: absolute;
  }
</style>