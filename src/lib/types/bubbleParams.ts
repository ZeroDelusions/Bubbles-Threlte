import type { SphereGeometry, Vector3 } from "three";
import type { BubbleAnimation } from "./bubbleAnimation";

export interface BubbleParams {
    id: string;
    state: "creating" | "active" | "removing";
    origin: Vector3;
    position: Vector3;
    velocity: Vector3;
    size: number;
    opacity: number;
    geometry: SphereGeometry;
    animationSpeed: number;

    smoothDeformWaveSin: number;
    smoothDeformWaveCos: number;
    smoothDeformSpeedSin: number;
    smoothDeformSpeedCos: number;
    smoothDeformStrengthSin: number;
    smoothDeformStrengthCos: number;

    baseColor: Vector3;
    borderColor: Vector3;
    reflectionColor: Vector3;
    baseAlpha: number;
    borderAlpha: number;
    glowStrength: number;
    gradientStrength: number;
    gradientSpeed: number;
    fresnel: Vector3;
    fresnelStrength: number;
    noiseFrequency: number;
    noiseAmplitude: number;
    seed: number;

    bubbleFilter?: (bubble: BubbleParams) => boolean;
    bubbleModifier?: (bubble: BubbleParams) => void;

    createAnimation?: BubbleAnimation;
    removeAnimation?: BubbleAnimation;
};