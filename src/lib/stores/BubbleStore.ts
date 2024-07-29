import { writable, type Writable } from 'svelte/store';
import type { BubbleParams } from '../types/bubble';
import { getStored } from './getStored';

export class BubbleStore {
  private bubbles: Writable<BubbleParams[]>;
  private pool: BubbleParams[] = [];
  public maxPoolSize: number;
  public enablePooling: boolean;

  public subscribe;
  public set;
  public update;

  constructor(maxPoolSize: number = 100, enablePooling: boolean = true, forceNewBubble: boolean = false) {
    this.maxPoolSize = maxPoolSize;
    this.enablePooling = enablePooling;
    this.bubbles = writable([]);
    const { subscribe, set, update } = this.bubbles;
    this.subscribe = subscribe;
    this.set = set;
    this.update = update;
  };

  public storeLength(): number {
    return getStored(this.bubbles)?.length ?? 0;
  };

  public poolLength(): number {
    return this.pool.length;
  };

  public isFull(): boolean {
    return this.storeLength() >= this.maxPoolSize;
  };

  public addBubble(params: BubbleParams): void {
    if (!this.isFull()) {
      const existingBubble = getStored(this.bubbles).find(b => b.id === params.id);
      if (!existingBubble) {
        if (this.enablePooling) {
          this.unpoolBubble(params);
        } else {
          this.pushBubble(params);
        };
      } else {
        console.warn(`Bubble with ID ${params.id} already exists. Not adding duplicate.`);
      };
    };
  };

  public removeBubble(params: BubbleParams): void {
    if (this.enablePooling) {
      this.poolBubble(params);
    } else {
      this.filterBubble(params);
    };
  };

  public clearAll(): void {
    this.clearStore();
    this.clearPool();
  };

  public clearStore(): void {
    this.bubbles.set([]);
  };

  public clearPool(): void {
    this.pool = [];
  };

  private pushBubble(params: BubbleParams): void {
    this.bubbles.update(b => [...b, params]);
  };

  private filterBubble(params: BubbleParams): void {
    this.bubbles.update(arr => arr.filter(b => b.id !== params.id));
  };

  private unpoolBubble(params: BubbleParams): void {
    if (this.pool.length > 0) {
      const bubble = this.pool.pop()!;
      Object.assign(bubble, params);
      if (!getStored(this.bubbles).some(b => b.id === bubble.id)) {
        this.pushBubble(bubble);
      } else {
        console.warn(`Bubble with ID ${bubble.id} already exists. Not adding duplicate from pool.`);
        this.pool.push(bubble);
      }
    } else {
      if (!getStored(this.bubbles).some(b => b.id === params.id)) {
        this.pushBubble(params);
      } else {
        console.warn(`Bubble with ID ${params.id} already exists. Not adding duplicate.`);
      };
    };
  };

  private poolBubble(params: BubbleParams): void {
    this.bubbles.update(arr => {
      const index = arr.findIndex(b => b.id === params.id);
      if (index !== -1) {
        this.pool.push(params);
      };
      return arr.filter((_, i) => i !== index);
    });
  };

};
