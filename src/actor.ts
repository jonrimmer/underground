import { Display } from 'rot-js';

export interface Actor {
  act(): Promise<void> | void;
  draw(display: Display): void;
  notifyAttack?(aggressor: Actor): void;
  x: number;
  y: number;
  isHostile: boolean;
  isPickable: boolean;
  weight: number;
  strength: number;
  name: string;
  health: number;
}
