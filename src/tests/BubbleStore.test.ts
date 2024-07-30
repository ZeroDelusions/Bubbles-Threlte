import { BubbleStore } from '$lib/stores/BubbleStore';
import type { BubbleParams } from '$lib/types/bubble';
import { SphereGeometry, Vector3 } from 'three';
import { describe, it, expect, beforeEach, afterEach, type DoneCallback, vi } from 'vitest';

describe('BubbleStore', () => {
    let bubbleStore: BubbleStore;

    const createBubble = (overrides = {}): BubbleParams => ({
        id: crypto.randomUUID().toString(),
        state: "creating",
        position: new Vector3(0, 0, 0),
        origin: new Vector3(0, 0, 0),
        velocity: new Vector3(0, 0, 0),
        size: 1,
        opacity: 1.0,
        geometry: new SphereGeometry(1, 16, 16),
        animationSpeed: 0.1,
        smoothDeformWaveSin: 1.0,
        smoothDeformWaveCos: 1.0,
        smoothDeformSpeedSin: 1.0,
        smoothDeformSpeedCos: 1.0,
        smoothDeformStrengthSin: 1.0,
        smoothDeformStrengthCos: 1.0,
        baseColor: new Vector3(1.0, 1.0, 1.0),
        borderColor: new Vector3(1.0, 1.0, 1.0),
        reflectionColor: new Vector3(1.0, 1.0, 1.0),
        baseAlpha: 1.0,
        borderAlpha: 1.0,
        glowStrength: 1.0,
        gradientStrength: 1.0,
        gradientSpeed: 1.0,
        fresnel: new Vector3(0.0, 0.0, 1.0),
        fresnelStrength: 1.0,
        noiseFrequency: 1.0,
        noiseAmplitude: 1.0,
        seed: Math.random() * 1000,
        ...overrides
    });

    beforeEach(() => {
        bubbleStore = new BubbleStore(5, true);
        vi.spyOn(console, 'warn').mockImplementation(() => undefined); // Mock console.warn
    });

    afterEach(() => {
        bubbleStore.clearAll();
        vi.restoreAllMocks(); // Restore console.warn
    });

    describe('Adding bubbles', () => {
        it("adds a bubble when store is not full", () => {
            expect(bubbleStore.isFull()).toBeFalsy();
            bubbleStore.addBubble(createBubble());
            expect(bubbleStore.storeLength()).toEqual(1);
        });

        it("doesn't add bubble when store is full", () => {
            for (let i = 0; i < bubbleStore.maxPoolSize; i++) {
                bubbleStore.addBubble(createBubble());
            }
            expect(bubbleStore.isFull()).toBeTruthy();
            bubbleStore.addBubble(createBubble());
            expect(bubbleStore.storeLength()).toEqual(bubbleStore.maxPoolSize);
        });

        it("doesn't add bubble with existing ID", () => {
            const bubble = createBubble();
            bubbleStore.addBubble(bubble);
            bubbleStore.addBubble(bubble);
            expect(bubbleStore.storeLength()).toEqual(1);
            expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("already exists"));
        });

        it("doesn't add bubble from pool with existing ID", () => {
            const bubble1 = createBubble();
            const bubble2 = createBubble();
            bubbleStore.addBubble(bubble1);
			bubbleStore.removeBubble(bubble1); // Moves bubble1 to pool
			bubbleStore.addBubble(bubble2);
            bubbleStore.addBubble(bubble2); // Tries to move bubble1 to writable while assigning params to ones of bubble2
            expect(bubbleStore.storeLength()).toEqual(1);
            expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("already exists"));
        });
    });

    describe('Removing bubbles', () => {
        it("removes bubble from store", () => {
            const bubble = createBubble();
            bubbleStore.addBubble(bubble);
            bubbleStore.removeBubble(bubble);
            expect(bubbleStore.storeLength()).toEqual(0);
        });

        it("moves bubble to pool after removing it from store", () => {
            const bubble = createBubble();
            bubbleStore.addBubble(bubble);
            bubbleStore.removeBubble(bubble);
            expect(bubbleStore.storeLength()).toEqual(0);
            expect(bubbleStore.poolLength()).toEqual(1);
        });

        it("does nothing when removing non-existent bubble", () => {
            bubbleStore.addBubble(createBubble());
            const nonExistentBubble = createBubble();
            bubbleStore.removeBubble(nonExistentBubble);
            expect(bubbleStore.storeLength()).toEqual(1);
            expect(bubbleStore.poolLength()).toEqual(0);
        });
    });

    describe('Subscription', () => {
        it("notifies subscribers when bubbles count change", () => {
            return new Promise<void>((resolve) => {
                const unsubscribe = bubbleStore.subscribe((bubbles) => {
                    if (bubbles.length === 1) {
                        expect(bubbles[0]).toBeDefined();
                        unsubscribe();
                        resolve();
                    };
                });
                bubbleStore.addBubble(createBubble());
            });
        });
    });
});