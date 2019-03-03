import { World } from './world';
import { Scheduler, Display } from 'rot-js';
import { Player } from './player';
import { Actor } from './actor';
import { boardWidth, boardHeight } from './constants';

export class Game {
  display: Display;
  scheduler = new Scheduler.Simple<Actor>();
  player: Player | null = null;
  world: World;

  constructor() {
    this.display = new Display({
      width: boardWidth,
      height: boardHeight,
      fontSize: 18,
      forceSquareRatio: true
    });

    const container = this.display.getContainer() as HTMLElement;
    container.classList.add('container');
    document.body.appendChild(container);

    this.world = new World(this.display);
  }

  async start() {
    this.scheduler.clear();

    this.player = new Player(this.world, this.display);
    this.player.x = this.world.startPoint.x;
    this.player.y = this.world.startPoint.y;
    this.world.actors.push(this.player);

    this.world.actors.forEach(actor => {
      this.scheduler.add(actor, true);
    });

    this.world.drawEverything();

    while (1) {
      let actor: Actor = this.scheduler.next();

      if (!actor) {
        break;
      }

      await actor.act();
    }
  }
}
