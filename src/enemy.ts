import { Actor } from './actor';
import { Display } from 'rot-js';

export abstract class Enemy implements Actor {
  public isHostile = true;

  public get isPickable() {
    return this.health === 0;
  }

  constructor(
    public x: number,
    public y: number,
    public weight: number,
    public name: string,
    public strength: number,
    public health: number
  ) {}

  abstract draw(display: Display): void;

  act() {}
}

export class Skeleton extends Enemy {
  constructor(x: number, y: number) {
    super(x, y, 15, 'Skeleton', 5, 5);
  }

  draw(display: Display) {
    display.draw(this.x, this.y, 'S', '#FFF', '#000');
  }
}
