import { Display } from 'rot-js';

export interface Pos {
  x: number;
  y: number;
}

export enum Tile {
  Wall = 0,
  Floor = 1
}

export interface Cell {
  tile: Tile;
  occupant: Actor | null;
  left?: Cell;
  right?: Cell;
  top?: Cell;
  bottom?: Cell;
}

export interface Actor {
  act(): Promise<void> | void;
  draw(display: Display, x: number, y: number): void;
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
