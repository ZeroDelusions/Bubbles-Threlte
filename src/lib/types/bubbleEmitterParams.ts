import type { Vector3 } from "three";

export interface BubbleEmitterParams {
    velocity?: Vector3;
    bubbleSize?: { min: number; max: number };
    scatterAngle?: { min: number; max: number };
    spawnCondition?: boolean;
    maxBubbles?: number;
};