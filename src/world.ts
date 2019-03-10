import { Map, RNG } from 'rot-js';
import Uniform from 'rot-js/lib/map/uniform';
import { Skeleton } from './entities/enemy';
import { Tile } from './types';
import { Cell } from './entities/cell';
import { Actor } from './entities/actor';
import { EntityManager } from './entities/manager';
import { Treasure } from './entities/treasure';
import { LogEntry } from './log-entry';

const worldWidth = 100;
const worldHeight = 100;

export class World {
  public cells: Cell[][] = [];
  public map: Uniform | null = null;
  public width = worldWidth;
  public height = worldHeight;

  private emptyCells = new Set<Cell>();
  private occupiedCells = new Set<Cell>();

  public startPoint: Cell;

  constructor(
    public questLog: LogEntry[],
    private entityManager: EntityManager
  ) {
    for (let x = 0; x < worldWidth; x++) {
      this.cells[x] = [];

      for (let y = 0; y < worldHeight; y++) {
        this.cells[x].push(new Cell(x, y, Tile.Wall, this));
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

    this.startPoint = this.cells[x][y];

    for (let i = 0; i < 20; i++) {
      const c = RNG.getUniformInt(0, freeCells.length - 1);
      const { x, y } = freeCells[c];

      this.entityManager.createEntity(id => {
        const enemy = new Skeleton(id, this);
        enemy.cell = this.cells[x][y];
      });

      freeCells.splice(c, 1);
    }

    for (let i = 0; i < 20; i++) {
      const c = RNG.getUniformInt(0, freeCells.length - 1);
      const { x, y } = freeCells[c];

      this.entityManager.createEntity(id => {
        const treasure = new Treasure(id, 'Cash', '$');
        treasure.cell = this.cells[x][y];
        freeCells.splice(c, 1);
      });
    }
  }

  get grid() {
    return this.cells;
  }

  reportEmpty(cell: Cell) {
    this.emptyCells.add(cell);
    this.occupiedCells.delete(cell);
  }

  reportOccupied(cell: Cell) {
    this.emptyCells.delete(cell);
    this.occupiedCells.add(cell);
  }

  getAllActors() {
    const result: Actor[] = [];

    this.occupiedCells.forEach(cell => {
      result.push(...cell.contents);
    });

    return result;
  }
}
