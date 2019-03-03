import { Display } from 'rot-js';

console.log('hello dungeon');

const d = new Display({
  width: 11,
  height: 5
});

document.body.appendChild(d.getContainer() as HTMLElement);
