import { Actor } from './actor';
import { getKeyPress } from './util';
import { KEYS, Display } from 'rot-js';
import { Tile, World } from './world';

export class Player implements Actor {
  public x: number = 0;
  public y: number = 0;

  constructor(private world: World, private display: Display) {}

  draw() {
    this.display.draw(this.x, this.y, '@', '#FFF', '#072');
  }

  async act() {
    return getKeyPress().then(keyCode => {
      this.handleKeyPress(keyCode);
    });
  }

  handleKeyPress(keyCode: number) {
    let newX = this.x;
    let newY = this.y;

    let movePressed = false;

    switch (keyCode) {
      case KEYS.VK_UP:
        newY -= 1;
        movePressed = true;
        break;
      case KEYS.VK_DOWN:
        movePressed = true;
        newY += 1;
        break;
      case KEYS.VK_LEFT:
        movePressed = true;
        newX -= 1;
        break;
      case KEYS.VK_RIGHT:
        movePressed = true;
        newX += 1;
        break;
    }

    if (movePressed) {
      const target = this.world.cells[newX][newY];

      if (target.tile === Tile.Floor) {
        if (target.occupant) {
        } else {
          this.world.drawTile(this);
          this.world.cells[this.x][this.y].occupant = null;

          this.x = newX;
          this.y = newY;

          this.draw();
        }
      }
    }
  }
}
