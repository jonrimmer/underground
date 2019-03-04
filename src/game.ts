import { World } from './world';
import { Scheduler } from 'rot-js';
import { Player } from './player';
import { QuestLog } from './quest-log';
import { Camera } from './camera';
import { Actor } from './types';

export class Game {
  scheduler = new Scheduler.Simple<Actor>();
  player: Player | null = null;
  world: World;
  questLog: QuestLog;
  camera: Camera;

  constructor() {
    this.questLog = new QuestLog();

    this.world = new World(this.questLog);
    this.camera = new Camera(this.world);
  }

  async start() {
    this.questLog.clear();
    this.questLog.addEntry('Your adventure begins!', 'info');
    this.scheduler.clear();

    this.player = new Player(this.world);
    this.player.x = this.world.startPoint.x;
    this.player.y = this.world.startPoint.y;
    this.world.actors.push(this.player);
    this.world.occupyCell(this.player);
    this.camera.player = this.player;

    this.world.actors.forEach(actor => {
      this.scheduler.add(actor, true);
    });

    this.camera.render();

    while (1) {
      let actor: Actor = this.scheduler.next();

      if (!actor) {
        break;
      }

      await actor.act();

      this.camera.render();
    }
  }
}
