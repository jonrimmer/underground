import { LitElement, html, css, customElement } from 'lit-element';
import { RNG, Scheduler } from 'rot-js';
import { Player } from '../entities/player';
import { World } from '../world';
import { LogEntry } from '../log-entry';
import { Camera } from '../camera';
import { EntityManager } from '../entities/manager';
import { UIMenu } from './menu';
import { Actor } from '../entities/actor';

@customElement('ui-game')
export class UIGame extends LitElement {
  scheduler = new Scheduler.Simple<Actor>();
  player: Player | null = null;
  world: World;
  questLog: LogEntry[] = [];
  camera: Camera;
  entityManager: EntityManager;

  constructor() {
    super();
    RNG.setSeed(11);
    this.entityManager = new EntityManager();
    this.world = new World(this.questLog, this.entityManager);
    this.camera = new Camera(this.world);
  }

  render() {
    return html`
      <h1>Underground</h1>
      ${this.camera.displayContainer}
      <ui-quest-log .items="${this.questLog}"></ui-quest-log>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto auto auto;
        align-content: center;
        justify-content: center;
        grid-gap: 12px;
      }

      h1 {
        text-align: center;
        font-weight: normal;
      }
    `;
  }

  log(entry: LogEntry) {
    this.questLog = [...this.questLog, entry];
    this.requestUpdate();
  }

  async firstUpdated() {
    this.questLog.length = 0;
    this.questLog.push(new LogEntry('Your adventure begins!', 'info'));
    this.scheduler.clear();

    this.entityManager.createEntity(id => {
      const player = new Player(id, this.world, this);
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

  showMenu(options: string[]): Promise<string | null> {
    return new Promise(resolve => {
      const menu = document.createElement('ui-menu') as UIMenu;
      document.body.appendChild(menu);
      menu.options = options;

      menu.addEventListener('ui-close', () => {
        document.body.removeChild(menu);
        resolve(null);
      });

      menu.addEventListener('ui-menu-select', ((e: CustomEvent) => {
        document.body.removeChild(menu);
        resolve(e.detail);
      }) as EventListener);
    });
  }
}
