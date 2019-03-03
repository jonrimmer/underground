import { Actor } from './actor';
import { Display } from 'rot-js';

export class Enemy implements Actor {
  constructor(private display: Display, public x: number, public y: number) {}
  draw() {
    this.display.draw(this.x, this.y, 'E', '#FFF', '#720');
  }

  act() {}
}
