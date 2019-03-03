import { Actor } from './actor';
import { Display } from 'rot-js';

export class Treasure implements Actor {
  isHostile = false;
  isPickable = true;
  weight = 1;
  strength = 0;
  health = 100;

  act(): void {}

  draw(display: Display): void {
    display.draw(this.x, this.y, this.symbol, '#000', '#FF0');
  }

  constructor(
    public name: string,
    private symbol: string,
    public x: number,
    public y: number
  ) {}
}
