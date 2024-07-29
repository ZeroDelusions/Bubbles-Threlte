import { writable, type Writable } from 'svelte/store';
import { get as getStored } from 'svelte/store';

export class ParamsStore<T> {
    private store: Writable<T>;
    private initialParams: T;

    public subscribe;
    public set;
    public update;

    constructor(params: T) {
        this.store = writable<T>(params);
        this.initialParams = { ...params };
        const { subscribe, set, update } = this.store;
        this.subscribe = subscribe;
        this.set = set;
        this.update = update;
    };

    public updatePartial(partialParams: Partial<T>): void {
        this.update(currentParams => ({
            ...currentParams,
            ...partialParams
        }));
    };

    public reset(): void {
        this.set(this.initialParams);
    };

    public getParams(): T {
        return getStored<T>(this.store);
    };
};