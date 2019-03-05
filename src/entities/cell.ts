import { Tile } from '../types';
import { Actor } from './actor';
import { World } from '../world';

export class Cell {
  private _contents = new Map<string, Actor>();
  public readonly id: string;

  constructor(
    public readonly x: number,
    public readonly y: number,
    public tile: Tile,
    private world: World
  ) {
    this.id = `${x}:${y}`;
    this.world.reportEmpty(this);
  }

  get top() {
    return this.y > 0 ? this.world.grid[this.x][this.y - 1] : null;
  }

  get bottom() {
    return this.y < this.world.grid[this.x].length
      ? this.world.grid[this.x][this.y + 1]
      : null;
  }

  get left() {
    return this.x > 0 ? this.world.grid[this.x - 1][this.y] : null;
  }

  get right() {
    return this.x < this.world.grid.length - 1
      ? this.world.grid[this.x + 1][this.y]
      : null;
  }

  relativeCell(dx: number, dy: number) {
    return this.world.grid[this.x + dx][this.y + dy];
  }

  get isEmpty() {
    return this._contents.size === 0;
  }

  get contents() {
    return Array.from(this._contents.values());
  }

  get isPassable() {
    return this.tile == Tile.Floor;
  }

  addEntity(entity: Actor) {
    if (!this._contents.has(entity.id)) {
      this._contents.set(entity.id, entity);

      if (entity.cell !== this) {
        entity.cell = this;
      }

      if (this._contents.size === 1) {
        this.world.reportOccupied(this);
      }
    }
  }

  removeEntity(entity: Actor) {
    if (this._contents.has(entity.id)) {
      this._contents.delete(entity.id);

      if (entity.cell === this) {
        entity.cell = null;
      }

      if (this._contents.size === 0) {
        this.world.reportOccupied(this);
      }
    }
  }
}
