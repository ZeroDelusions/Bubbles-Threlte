import type { Writable } from "svelte/store";

export function getStored<T>(store: Writable<T>): T {
  let value: T | undefined;
  store.subscribe(($: T) => value = $)();
  if (value === undefined) {
    throw new Error('Store value is undefined');
  };
  return value;
};