import { describe, it, expect, beforeEach } from 'vitest'
import { ParamsStore } from '../lib/stores/ParamsStore'

describe('ParamsStore', () => {
    let paramsStore: ParamsStore<{ count: number; name: string }>;
    let paramsStoreArray: ParamsStore<{ count: number; name: string }[]>;
    const defaultParams = { count: 0, name: 'test' };

    beforeEach(() => {
        paramsStore = new ParamsStore({ ...defaultParams });
        paramsStoreArray = new ParamsStore([]);
    });

    describe('Updates', () => {
        it('updates only specified properties', () => {
            paramsStore.updatePartial({ count: 1 });
            expect(paramsStore.getParams()).toEqual({ count: 1, name: 'test' });
        });

        it('restores initial params on reset', () => {
            paramsStore.updatePartial({ count: 1, name: 'updated' });
            paramsStore.reset();
            expect(paramsStore.getParams()).toEqual({ count: 0, name: 'test' });
        });
    });

    describe('Subscription', () => {
        it("notifies subscribers when values change", () => {
            return new Promise<void>((resolve) => {
                const unsubscribe = paramsStore.subscribe((params) => {
                    if (params.count === 1) {
                        expect(params.count).toEqual(1);
                        unsubscribe();
                        resolve();
                    };
                });
                paramsStore.updatePartial({ count: 1 });
            });
        });

        it("notifies subscribers when number of elements change", () => {
            return new Promise<void>((resolve) => {
                const unsubscribe = paramsStoreArray.subscribe((params) => {
                    if (params.length === 1) {
                        expect(params[0]).toBeDefined();
                        unsubscribe();
                        resolve();
                    };
                });
                paramsStoreArray.update(arr => {
                    return [...arr, { count: 1, name: 'test1' }];
                });
            });
        });
    });
});

