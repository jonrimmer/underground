import { Actor } from './actor';

export class Treasure extends Actor {
  public readonly id: string;
  public bgColor = '#FF0';
  public fgColor = '#000';
  isHostile = false;
  isPickable = true;
  weight = 1;
  strength = 0;
  health = 100;
  act(): void {}
  notifyAttack() {}

  constructor(id: number, public name: string, public char: string) {
    super();
    this.id = `TRE${id}`;
  }
}
