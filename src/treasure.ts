import { Display } from 'rot-js';
import { Actor } from './types';

export class Treasure implements Actor {
  isHostile = false;
  isPickable = true;
  weight = 1;
  strength = 0;
  health = 100;

  act(): void {}

  draw(display: Display, x: number, y: number): void {
    display.draw(x, y, this.symbol, '#000', '#FF0');
  }

  constructor(
    public name: string,
    private symbol: string,
    public x: number,
    public y: number
  ) {}
}
