import { Actor } from './actor';
import { Display } from 'rot-js';
import { World } from './world';

export abstract class Enemy implements Actor {
  public isHostile = true;
  public currentTarget: Actor | null = null;

  public get isPickable() {
    return this.health === 0;
  }

  constructor(
    public x: number,
    public y: number,
    public weight: number,
    public name: string,
    public strength: number,
    public health: number,
    private world: World
  ) {}

  abstract draw(display: Display): void;

  notifyAttack(aggressor: Actor) {
    this.currentTarget = aggressor;
  }

  act() {
    if (this.currentTarget) {
      const { x: tx, y: ty } = this.currentTarget;

      if (Math.abs(tx - this.x) <= 1 && Math.abs(ty - this.y) <= 1) {
        // In range.
        this.world.questLog.addEntry(
          `${this.name} attacked ${
            this.currentTarget.name
          } and caused no damage.`,
          'danger'
        );
      }
    }
  }
}

export class Skeleton extends Enemy {
  constructor(x: number, y: number, world: World) {
    super(x, y, 15, 'Skeleton', 5, 5, world);
  }

  draw(display: Display) {
    display.draw(this.x, this.y, 'S', '#FFF', '#000');
  }
}
