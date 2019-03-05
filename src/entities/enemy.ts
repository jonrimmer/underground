import { World } from '../world';
import { Actor } from './actor';

export abstract class Enemy extends Actor {
  public abstract char: string;
  public abstract bgColor: string;
  public abstract fgColor: string;
  public isHostile = true;
  public currentTarget: Actor | null = null;

  public get isPickable() {
    return this.health === 0;
  }

  constructor(
    public readonly id: string,
    public weight: number,
    public name: string,
    public strength: number,
    public health: number,
    private world: World
  ) {
    super();
  }

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
  public char = 'S';
  public bgColor = '#000';
  public fgColor = '#FFF';
  constructor(id: number, world: World) {
    super(`SKL${id}`, 15, 'Skeleton', 5, 5, world);
  }
}
