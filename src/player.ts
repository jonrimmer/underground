import { Actor } from './actor';
import { getKeyPress } from './util';
import { KEYS, Display } from 'rot-js';
import { Tile, World } from './world';

export class Player implements Actor {
  public x: number = 0;
  public y: number = 0;
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

  constructor(private world: World) {}

  draw(display: Display) {
    display.draw(this.x, this.y, '@', '#FFF', '#072');
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
    const newX = this.x + dx;
    const newY = this.y + dy;

    if (this.world.isPassable(newX, newY)) {
      const occupant = this.world.isOccupied(newX, newY);

      if (occupant) {
        if (occupant.isHostile) {
          this.attack(occupant);
          return;
        }

        if (occupant.isPickable) {
          this.pickup(occupant);
        }
      }

      this.world.leaveCell(this);

      this.x = newX;
      this.y = newY;

      this.world.occupyCell(this);
    }
  }

  attack(target: Actor) {
    this.world.questLog.addEntry(
      `${this.name} attacked ${target.name} causing no damage!`,
      'danger'
    );
  }

  pickup(item: Actor) {
    if (this.burden + item.weight <= this.strength) {
      this.world.removeActor(item);
      this.inventory.push(item);
      this.world.questLog.addEntry(`Your picked up a ${item.name}`, 'success');
    }
  }
}
