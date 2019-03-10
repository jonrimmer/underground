import { LitElement, html, css, customElement } from 'lit-element';

@customElement('ui-frame')
export class UIFrame extends LitElement {
  render() {
    return html`
      <div class="background" @click=${this.close}></div>
      <div class="content">
        <slot></slot>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        z-index: 2;
        align-items: center;
        justify-content: center;
      }

      .background {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.7);
      }

      .content {
        background-color: #000;
        padding: 6px;
        border: 2px solid #fff;
        z-index: 3;
        color: #fff;
      }
    `;
  }

  close() {
    this.dispatchEvent(
      new CustomEvent('ui-close', { bubbles: true, composed: true })
    );
  }
}
