import { LitElement, html, customElement, property, css } from 'lit-element';
import { KEYS } from 'rot-js';
import { UIFrame } from './frame';

@customElement('ui-menu')
export class UIMenu extends LitElement {
  @property({ type: Array })
  options: string[] = [];

  shadowRoot!: ShadowRoot;

  constructor() {
    super();
  }

  static get styles() {
    return css`
      .option {
        line-height: 1.5em;
        min-width: 150px;
      }

      .option:focus {
        background-color: blue;
        outline: none;
      }
    `;
  }

  render() {
    return html`
      <ui-frame tabIndex="-1">
        ${this.options.map(
          option => html`
            <div class="option" tabindex="0">${option}</div>
          `
        )}
      </ui-frame>
    `;
  }

  focusFirst() {
    const firstOption = this.shadowRoot.querySelector(
      '.option:first-child'
    ) as HTMLElement;

    if (firstOption) {
      firstOption.focus();
      return firstOption;
    }

    return null;
  }

  async firstUpdated() {
    this.shadowRoot.addEventListener('keydown', this
      .onKeydown as EventListener);
    await (this.shadowRoot.querySelector('ui-frame') as UIFrame).updateComplete;
    this.focusFirst();
  }

  onKeydown = (e: KeyboardEvent) => {
    if (e.keyCode == KEYS.VK_ESCAPE) {
      this.dispatchEvent(
        new CustomEvent('ui-close', { bubbles: true, composed: true })
      );
      return;
    }

    let focused = this.shadowRoot.activeElement;

    if (!focused) {
      focused = this.focusFirst();
    } else {
      switch (e.keyCode) {
        case KEYS.VK_UP:
          focused = focused.previousElementSibling;
          break;
        case KEYS.VK_DOWN:
          focused = focused.nextElementSibling;
          break;
        case KEYS.VK_RETURN:
          this.dispatchEvent(
            new CustomEvent('ui-menu-select', {
              detail: (e.target as HTMLElement).innerText
            })
          );
      }
    }

    if (focused) {
      (focused as HTMLElement).focus();
    }

    e.stopPropagation();
  };
}
