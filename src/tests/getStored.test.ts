import { describe, it, expect, beforeEach } from 'vitest'
import { getStored } from '$lib/stores/getStored';
import { writable, type Writable } from 'svelte/store';

describe('getStored', () => {
    let store: Writable<number[]>;

    beforeEach(() => {
        store = writable([]);
    });

    it("getStored returns right value", () => {
        store.update(arr => [...arr, 0]);
        let storedData = getStored(store);
        expect(storedData.length).toBeGreaterThan(0);
    });
});

