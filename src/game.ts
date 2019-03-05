import { World } from './world';
import { Scheduler } from 'rot-js';
import { Player } from './entities/player';
import { QuestLog } from './quest-log';
import { Camera } from './camera';
import { EntityManager } from './entities/manager';
import { Actor } from './entities/actor';

export class Game {
  scheduler = new Scheduler.Simple<Actor>();
  player: Player | null = null;
  world: World;
  questLog: QuestLog;
  camera: Camera;
  entityManager: EntityManager;

  constructor() {
    this.questLog = new QuestLog();
    this.entityManager = new EntityManager();
    this.world = new World(this.questLog, this.entityManager);
    this.camera = new Camera(this.world);
  }

  async start() {
    this.questLog.clear();
    this.questLog.addEntry('Your adventure begins!', 'info');
    this.scheduler.clear();

    this.entityManager.createEntity(id => {
      const player = new Player(id, this.world);
      player.cell = this.world.startPoint;

      this.player = player;
      this.camera.player = this.player;
    });

    this.world.getAllActors().forEach(actor => {
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
