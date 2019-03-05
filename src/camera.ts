import { World } from './world';
import { Player } from './entities/player';
import { Display } from 'rot-js';
import { boardWidth, boardHeight } from './constants';
import { Tile } from './types';
import { Cell } from './entities/cell';
import { Displayable } from './entities/displayable';

export class Camera {
  private display: Display;
  public player!: Player;

  constructor(private world: World) {
    this.display = new Display({
      width: boardWidth,
      height: boardHeight,
      fontSize: 18,
      forceSquareRatio: true
    });

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
    const { x: cx, y: cy } = this.player;

    for (let rx = 0; rx < boardWidth; rx++) {
      const x = cx + (rx - boardWidth / 2);

      for (let ry = 0; ry < boardHeight; ry++) {
        const y = cy + (ry - boardHeight / 2);

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
}
