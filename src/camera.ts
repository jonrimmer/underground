import { World } from './world';
import { Player } from './entities/player';
import { Display } from 'rot-js';
import { boardWidth, boardHeight } from './constants';
import { Tile } from './types';
import { Cell } from './entities/cell';
import { Displayable } from './entities/displayable';

const DEBUG = false;

export class Camera {
  private display: Display;
  private _player: Player | null = null;

  set player(value: Player) {
    this._player = value;
    this.cx = value.x;
    this.cy = value.y;
  }

  private windowWidth: number;
  private windowHeight: number;
  private cx = 0;
  private cy = 0;

  constructor(private world: World) {
    this.display = new Display({
      width: boardWidth,
      height: boardHeight,
      fontSize: 18,
      forceSquareRatio: true
    });

    this.windowWidth = Math.floor(boardWidth * 0.15);
    this.windowHeight = Math.floor(boardHeight * 0.15);

    const container = this.display.getContainer() as HTMLElement;
    container.classList.add('container');
    document.body.appendChild(container);
  }

  draw(x: number, y: number, displayable: Displayable) {
    this.display.draw(
      x,
      y,
      displayable.char,
      displayable.fgColor,
      displayable.bgColor
    );
  }

  render() {
    this.updateWindow();

    for (let rx = 0; rx < boardWidth; rx++) {
      const x = this.cx + (rx - boardWidth / 2);

      for (let ry = 0; ry < boardHeight; ry++) {
        const y = this.cy + (ry - boardHeight / 2);

        if (x >= 0 && x < this.world.width && y >= 0 && y < this.world.height) {
          const cell = this.world.cells[x][y];
          this.drawCell(cell, rx, ry);
        } else {
          this.display.draw(rx, ry, '', '', '');
        }
      }
    }
  }

  getMapBg = ({ x, y }: Cell) => {
    return (x % 2) + (y % 2) - 1 ? '#EEE' : '#DDD';
  };

  drawTile(x: number, y: number, cell: Cell) {
    switch (cell.tile) {
      case Tile.Floor:
        this.display.draw(x, y, '', null, this.getMapBg(cell));
        break;
      case Tile.Wall:
        if (
          DEBUG &&
          (cell.x === this.cx - this.windowWidth ||
            cell.x === this.cx + this.windowHeight ||
            cell.y === this.cy - this.windowHeight ||
            cell.y === this.cy + this.windowHeight)
        ) {
          this.display.draw(x, y, '', '', '#F00');
          break;
        }

        if (cell.bottom && cell.bottom.tile === Tile.Floor) {
          this.display.draw(x, y, '', '', '#333');
        } else {
          this.display.draw(x, y, '', '', '');
        }
        break;
    }
  }

  drawCell(cell: Cell, x: number, y: number) {
    if (!cell.isEmpty) {
      this.draw(x, y, cell.contents[0]);
    } else {
      this.drawTile(x, y, cell);
    }
  }

  private updateWindow() {
    if (this._player) {
      const dx = this._player.x - this.cx;
      const dy = this._player.y - this.cy;

      if (dx > this.windowWidth) {
        this.cx += 1;
      } else if (dx < -this.windowWidth) {
        this.cx -= 1;
      }

      if (dy > this.windowHeight) {
        this.cy += 1;
      } else if (dy < -this.windowHeight) {
        this.cy -= 1;
      }
    }
  }
}
