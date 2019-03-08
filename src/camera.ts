import { World } from './world';
import { Player } from './entities/player';
import { Display, FOV, Color } from 'rot-js';
import { boardWidth, boardHeight } from './constants';
import { Tile } from './types';
import { Cell } from './entities/cell';
import { Displayable } from './entities/displayable';
import PreciseShadowcasting from 'rot-js/lib/fov/precise-shadowcasting';

const DEBUG = false;

const FLOOR1: [number, number, number] = [238, 238, 238];
const FLOOR2: [number, number, number] = [221, 221, 221];

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
  private fov: PreciseShadowcasting;

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

    this.fov = new FOV.PreciseShadowcasting((x, y) => {
      if (this.validCoords(x, y)) {
        return this.world.cells[x][y].tile === Tile.Floor;
      }
      return false;
    });
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

    const visible = new Map<Cell, number>();

    if (this._player) {
      this.fov.compute(
        this._player.x,
        this._player.y,
        boardWidth / 2,
        (x, y, r, visibility) => {
          if (this.validCoords(x, y)) {
            const cell = this.world.cells[x][y];
            visible.set(cell, visibility);
            cell.seen = true;
          }
        }
      );
    }

    for (let rx = 0; rx < boardWidth; rx++) {
      const x = this.cx + (rx - boardWidth / 2);

      for (let ry = 0; ry < boardHeight; ry++) {
        const y = this.cy + (ry - boardHeight / 2);

        if (this.validCoords(x, y)) {
          const cell = this.world.cells[x][y];

          if (visible.has(cell)) {
            this.drawCell(cell, rx, ry, visible.get(cell) as number);
          } else {
            this.drawCell(cell, rx, ry, 0);
          }
        } else {
          this.display.draw(rx, ry, '', '', '');
        }
      }
    }
  }

  getMapBg = ({ x, y, seen }: Cell, visibility: number) => {
    const baseColor = (x % 2) + (y % 2) - 1 ? FLOOR1 : FLOOR2;
    const invisible: [number, number, number] = !seen
      ? [0, 0, 0]
      : [20, 20, 20];
    const interpolated = Color.interpolate(invisible, baseColor, visibility);
    return Color.toHex(interpolated);
  };

  drawTile(x: number, y: number, cell: Cell, visibility: number) {
    switch (cell.tile) {
      case Tile.Floor:
        this.display.draw(x, y, '', null, this.getMapBg(cell, visibility));
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

        if (cell.bottom && cell.bottom.tile === Tile.Floor && visibility > 0) {
          this.display.draw(x, y, '', '', '#333');
        } else {
          this.display.draw(x, y, '', '', '');
        }
        break;
    }
  }

  drawCell(cell: Cell, x: number, y: number, visibility: number) {
    if (!cell.isEmpty) {
      this.draw(x, y, cell.contents[0]);
    } else {
      this.drawTile(x, y, cell, visibility);
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

  validCoords(x: number, y: number) {
    return x >= 0 && x < this.world.width && y >= 0 && y < this.world.height;
  }
}
