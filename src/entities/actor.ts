import { Displayable } from './displayable';
import { Entity } from './entity';
import { Cell } from './cell';

export abstract class Actor implements Entity, Displayable {
  public abstract char: string;
  public abstract bgColor: string;
  public abstract fgColor: string;
  public abstract id: string;
  public abstract act(): Promise<void> | void;
  public abstract notifyAttack?(aggressor: Actor): void;
  public abstract isHostile: boolean;
  public abstract isPickable: boolean;
  public abstract weight: number;
  public abstract strength: number;
  public abstract name: string;
  public abstract health: number;

  private _cell: Cell | null = null;

  get cell() {
    return this._cell;
  }

  get x() {
    return this._cell ? this._cell.x : 0;
  }

  get y() {
    return this._cell ? this._cell.y : 0;
  }

  set cell(value: Cell | null) {
    if (value !== this._cell) {
      const oldCell = this._cell;
      this._cell = value;

      if (oldCell) {
        oldCell.removeEntity(this);
      }

      if (this._cell) {
        this._cell.addEntity(this);
      }
    }
  }
}
