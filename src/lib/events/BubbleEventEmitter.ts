import type { BubbleParams } from '../types/bubbleParams';

export type BubbleEventType = 'creationStarted' | 'creationFinished' | 'removalStarted' | 'removalFinished' | 'move';

export interface BubbleEvent {
    type: BubbleEventType;
    bubble: BubbleParams;
}

export type BubbleEventListener = (event: BubbleEvent) => void;

export class BubbleEventEmitter {
    private listeners: Map<BubbleEventType, Set<BubbleEventListener>> = new Map();

    public addListener(type: BubbleEventType, listener: BubbleEventListener): () => void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type)!.add(listener);

        return () => this.removeListener(type, listener);
    }

    public removeListener(type: BubbleEventType, listener: BubbleEventListener): void {
        if (this.listeners.has(type)) {
            this.listeners.get(type)!.delete(listener);
        }
    }

    public emit(event: BubbleEvent): void {
        if (this.listeners.has(event.type)) {
            this.listeners.get(event.type)!.forEach(listener => listener(event));
        }
    }
}