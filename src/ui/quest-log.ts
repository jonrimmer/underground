import { LitElement, property, html, css, customElement } from 'lit-element';
import { LogEntry } from '../log-entry';

const dateFormat = Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
});

@customElement('ui-quest-log')
export class UIQuestLog extends LitElement {
  @property({ type: Array })
  public items: LogEntry[] = [];

  render() {
    return html`
      ${this.items.map(
        item => html`
          <div class="log-entry ${item.type}">
            ${dateFormat.format(item.date)} ${item.text}
          </div>
        `
      )}
    `;
  }

  static get styles() {
    return css`
      :host {
        background-color: #000;
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: repeat(5, 1.5em);
        justify-content: start;
        padding: 2px 6px;
      }

      .log-entry.info {
        color: #aaf;
      }

      .log-entry.danger {
        color: #faa;
      }

      .log-entry.success {
        color: #0f4;
      }
    `;
  }
}
