import { getKeyPress } from '../util';
import { KEYS } from 'rot-js';
import { World } from '../world';
import { Actor } from './actor';

export class Player extends Actor {
  public readonly id: string;
  public char = '@';
  public bgColor = '#FFF';
  public fgColor = '#072';
  public isHostile = false;
  public isPickable = false;
  public strength = 10;
  public weight = 20;
  public name = 'Player';
  public health = 100;

  public inventory: Actor[] = [];

  private get burden() {
    let result = 0;
    this.inventory.forEach(item => {
      result += item.weight;
    });
    return result;
  }

  constructor(id: number, private world: World) {
    super();
    this.id = `PLY${id}`;
  }

  async act() {
    return getKeyPress().then(keyCode => {
      this.handleKeyPress(keyCode);
    });
  }

  handleKeyPress(keyCode: number) {
    let dx = 0;
    let dy = 0;

    switch (keyCode) {
      case KEYS.VK_UP:
        dy = -1;
        break;
      case KEYS.VK_DOWN:
        dy = 1;
        break;
      case KEYS.VK_LEFT:
        dx = -1;
        break;
      case KEYS.VK_RIGHT:
        dx = 1;
        break;
    }

    if (dx !== 0 || dy !== 0) {
      this.move(dx, dy);
    }
  }

  move(dx: number, dy: number) {
    if (this.cell) {
      const target = this.cell.relativeCell(dx, dy);

      if (target.isPassable) {
        const contents = target.contents;

        let enemy = contents.find(actor => actor.isHostile);

        if (enemy) {
          this.attack(enemy);
          return;
        }

        for (let actor of target.contents) {
          if (actor.isPickable) {
            this.pickup(actor);
          }
        }

        this.cell = target;
      }
    }
  }

  attack(target: Actor) {
    this.world.questLog.addEntry(
      `${this.name} attacked ${target.name} causing no damage!`,
      'danger'
    );

    if (target.notifyAttack) {
      target.notifyAttack(this);
    }
  }

  pickup(item: Actor) {
    if (this.burden + item.weight <= this.strength) {
      item.cell = null;
      this.inventory.push(item);
      this.world.questLog.addEntry(
        `${this.name} picked up a ${item.name}`,
        'success'
      );
    }
  }

  notifyAttack() {}
}
