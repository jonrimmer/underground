import { boardWidth, boardHeight } from './constants';
import { Map, RNG, Display } from 'rot-js';
import Uniform from 'rot-js/lib/map/uniform';
import { Enemy } from './enemy';
import { Actor } from './actor';
import { Player } from './player';
import { Pos } from './types';

export enum Tile {
  Wall = 0,
  Floor = 1
}

interface Cell {
  tile: Tile;
  occupant: Actor | null;
}

export class World {
  public cells: Cell[][] = [];
  public map: Uniform | null = null;
  public enemies: Enemy[] = [];
  public actors: Actor[] = [];

  public startPoint: Pos = { x: 0, y: 0 };

  constructor(private display: Display) {
    this.cells = Array.from(
      {
        length: boardWidth
      },
      () =>
        Array.from(
          {
            length: boardHeight
          },
          () => ({ tile: Tile.Wall, occupant: null })
        )
    );

    const freeCells: { x: number; y: number }[] = [];

    this.map = new Map.Uniform(boardWidth, boardHeight, {});
    this.map.create((x, y, value) => {
      if (!value) {
        this.cells[x][y].tile = Tile.Floor;
        freeCells.push({ x, y });
      }
    });

    // Put the player in the middle of the first room.
    const [x, y] = this.map.getRooms()[0].getCenter();

    this.startPoint = { x, y };

    this.enemies.length = 0;

    for (let i = 0; i < 2; i++) {
      const c = RNG.getUniformInt(0, freeCells.length - 1);
      const { x, y } = freeCells[c];
      const enemy = new Enemy(this.display, x, y);
      this.cells[x][y].occupant = enemy;
      freeCells.splice(c, 1);
      this.enemies.push(enemy);
      this.actors.push(enemy);

      enemy.draw();
    }
  }

  getMapBg = (x: number, y: number) => {
    return (x % 2) + (y % 2) - 1 ? '#EEE' : '#DDD';
  };

  drawTile({ x, y }: { x: number; y: number }) {
    const tile = this.cells[x][y].tile;

    switch (tile) {
      case Tile.Floor:
        this.display.draw(x, y, '', null, this.getMapBg(x, y));
        break;
      case Tile.Wall:
        if (y < boardHeight - 1 && this.cells[x][y + 1].tile === Tile.Floor) {
          this.display.draw(x, y, '', '', '#333');
        }
        break;
    }
  }

  drawWholeMap() {
    for (let x = 0; x < boardWidth; x++) {
      for (let y = 0; y < boardHeight; y++) {
        this.drawTile({ x, y });
      }
    }
  }

  drawEverything() {
    this.drawWholeMap();
    this.actors.forEach(actor => actor.draw());
  }
}
