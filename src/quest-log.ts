interface LogEntry {
  date: Date;
  text: string;
  type: 'info' | 'danger' | 'success';
}

const dateFormat = Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
});

export class QuestLog {
  container: HTMLElement;
  items: LogEntry[] = [];

  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('quest-log');
    document.body.appendChild(this.container);
  }

  public addEntry(text: string, type: 'info' | 'danger' | 'success') {
    const entry = { text, type, date: new Date() };
    this.items.push(entry);

    if (this.container.childNodes.length === 5) {
      this.container.removeChild(this.container.childNodes[0]);
    }

    const el = document.createElement('div');
    el.classList.add('log-item', type);
    el.innerText = `${dateFormat.format(entry.date)} ${text}`;

    this.container.appendChild(el);
  }

  public clear() {
    this.container.innerHTML = '';
    this.items.length = 0;
  }
}
