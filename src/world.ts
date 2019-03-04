import { Map, RNG } from 'rot-js';
import Uniform from 'rot-js/lib/map/uniform';
import { Enemy, Skeleton } from './enemy';
import { Pos, Cell, Actor, Tile } from './types';
import { QuestLog } from './quest-log';
import { Treasure } from './treasure';

const worldWidth = 100;
const worldHeight = 100;

export class World {
  public cells: Cell[][] = [];
  public map: Uniform | null = null;
  public enemies: Enemy[] = [];
  public actors: Actor[] = [];
  public width = worldWidth;
  public height = worldHeight;

  public startPoint: Pos = { x: 0, y: 0 };

  constructor(public questLog: QuestLog) {
    for (let x = 0; x < worldWidth; x++) {
      this.cells[x] = [];

      for (let y = 0; y < worldHeight; y++) {
        const cell: Cell = {
          tile: Tile.Wall,
          occupant: null
        };

        if (x > 0) {
          const left = this.cells[x - 1][y];
          left.right = cell;
          cell.left = cell;
        }

        if (y > 0) {
          const top = this.cells[x][y - 1];
          top.bottom = cell;
          cell.top = top;
        }

        this.cells[x].push(cell);
      }
    }

    const freeCells: { x: number; y: number }[] = [];

    this.map = new Map.Uniform(worldWidth, worldHeight, {});
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

  isPassable(x: number, y: number) {
    return this.cells[x][y].tile === Tile.Floor;
  }

  isOccupied(x: number, y: number) {
    return this.cells[x][y].occupant;
  }

  removeActor(actor: Actor) {
    this.actors.splice(this.actors.indexOf(actor), 1);
    this.cells[actor.x][actor.y].occupant = null;
  }

  leaveCell(actor: Actor) {
    const { x, y } = actor;
    const cell = this.cells[x][y];
    cell.occupant = null;
  }

  occupyCell(actor: Actor) {
    const { x, y } = actor;
    const cell = this.cells[x][y];
    cell.occupant = actor;
  }
}
