import { boardWidth, boardHeight } from './constants';
import { Map, RNG, Display } from 'rot-js';
import Uniform from 'rot-js/lib/map/uniform';
import { Enemy, Skeleton } from './enemy';
import { Actor } from './actor';
import { Pos } from './types';
import { QuestLog } from './quest-log';
import { Treasure } from './treasure';

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
  private dirty: Pos[] = [];

  public startPoint: Pos = { x: 0, y: 0 };

  constructor(private display: Display, public questLog: QuestLog) {
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
      const enemy = new Skeleton(x, y, this);
      this.cells[x][y].occupant = enemy;
      freeCells.splice(c, 1);
      this.enemies.push(enemy);
      this.actors.push(enemy);
    }

    for (let i = 0; i < 3; i++) {
      const c = RNG.getUniformInt(0, freeCells.length - 1);
      const { x, y } = freeCells[c];
      const treasure = new Treasure('Cash', '$', x, y);
      this.cells[x][y].occupant = treasure;
      freeCells.splice(c, 1);
      this.actors.push(treasure);
    }
  }

  getMapBg = (x: number, y: number) => {
    return (x % 2) + (y % 2) - 1 ? '#EEE' : '#DDD';
  };

  drawTile(x: number, y: number, tile: Tile) {
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

  drawCell(x: number, y: number) {
    const cell = this.cells[x][y];
    if (cell.occupant) {
      cell.occupant.draw(this.display);
    } else {
      this.drawTile(x, y, cell.tile);
    }
  }

  drawEverything() {
    for (let x = 0; x < boardWidth; x++) {
      for (let y = 0; y < boardHeight; y++) {
        this.drawCell(x, y);
      }
    }
  }

  drawDirty() {
    this.dirty.forEach(({ x, y }) => {
      this.drawCell(x, y);
    });
    this.dirty.length = 0;
  }

  isPassable(x: number, y: number) {
    return this.cells[x][y].tile === Tile.Floor;
  }

  isOccupied(x: number, y: number) {
    return this.cells[x][y].occupant;
  }

  removeActor(actor: Actor) {
    this.actors.splice(this.actors.indexOf(actor), 1);
    this.cells[actor.x][actor.y].occupant = null;
    this.dirty.push(actor);
  }

  leaveCell(actor: Actor) {
    const { x, y } = actor;
    const cell = this.cells[x][y];
    cell.occupant = null;
    this.dirty.push({ x, y });
  }

  occupyCell(actor: Actor) {
    const { x, y } = actor;
    const cell = this.cells[x][y];
    cell.occupant = actor;
    this.dirty.push({ x, y });
  }
}
