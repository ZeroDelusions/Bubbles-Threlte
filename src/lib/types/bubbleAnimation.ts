import type { BubbleParams } from "./bubbleParams";

export interface BubbleAnimation {
    params: (bubble: BubbleParams) => void;
    duration: number;
};