import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BubbleEventEmitter, type BubbleEvent } from '$lib/events/BubbleEventEmitter';
import type { BubbleParams } from '$lib/types/bubble';
import { SphereGeometry, Vector3 } from 'three';

describe('BubbleEventEmitter', () => {
    let emitter: BubbleEventEmitter;
    
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
        emitter = new BubbleEventEmitter();
    });

    it('should add a listener', () => {
        const listener = vi.fn();
        const removeListener = emitter.addListener('creationStarted', listener);

        expect(typeof removeListener).toBe('function');
    });

    it('should emit an event and call the listener', () => {
        const listener = vi.fn();
        emitter.addListener('creationStarted', listener);

        const bubble = createBubble();
        const event: BubbleEvent = {
            type: 'creationStarted',
            bubble
        };

        emitter.emit(event);

        expect(listener).toHaveBeenCalledWith(event);
    });

    it('should not call listeners of different event types', () => {
        const listener1 = vi.fn();
        const listener2 = vi.fn();

        emitter.addListener('creationStarted', listener1);
        emitter.addListener('removalFinished', listener2);

        const bubble = createBubble();
        const event: BubbleEvent = {
            type: 'creationStarted',
            bubble
        };

        emitter.emit(event);

        expect(listener1).toHaveBeenCalledWith(event);
        expect(listener2).not.toHaveBeenCalled();
    });

    it('should remove a listener', () => {
        const listener = vi.fn();
        const removeListener = emitter.addListener('creationStarted', listener);

        removeListener();

        const bubble = createBubble();
        const event: BubbleEvent = {
            type: 'creationStarted',
            bubble
        };

        emitter.emit(event);

        expect(listener).not.toHaveBeenCalled();
    });

    it('should handle multiple listeners for the same event type', () => {
        const listener1 = vi.fn();
        const listener2 = vi.fn();

        emitter.addListener('move', listener1);
        emitter.addListener('move', listener2);

        const bubble = createBubble();
        const event: BubbleEvent = {
            type: 'move',
            bubble
        };

        emitter.emit(event);

        expect(listener1).toHaveBeenCalledWith(event);
        expect(listener2).toHaveBeenCalledWith(event);
    });

    it('should do nothing when emitting an event with no listeners', () => {
        const bubble = createBubble();
        const event: BubbleEvent = {
            type: 'removalStarted',
            bubble
        };

        // This should not throw an error
        expect(() => emitter.emit(event)).not.toThrow();
    });

    it('should do nothing when removing a non-existent listener', () => {
        const listener = vi.fn();

        // This should not throw an error
        expect(() => emitter.removeListener('creationFinished', listener)).not.toThrow();
    });
});