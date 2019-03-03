import { Display, Map, RNG, KEYS } from 'rot-js';

console.log('hello dungeon');

RNG.setSeed(11);

const width = 30;
const height = 30;

const d = new Display({
  width,
  height,
  fontSize: 18,
  forceSquareRatio: true
});

const container = d.getContainer() as HTMLElement;
container.classList.add('container');
document.body.appendChild(container);

const gen = new Map.Uniform(width, height, {});

interface Cell {
  tile: string | null;
}

const map: Cell[][] = Array.from(
  {
    length: width
  },
  () =>
    Array.from(
      {
        length: height
      },
      () => ({
        tile: null
      })
    )
);

gen.create((x, y, value) => {
  if (!value) {
    map[x][y].tile = '.';
  }
});

for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    const cell = map[x][y];

    if (cell.tile) {
      d.draw(x, y, ' ', null, (x % 2) + (y % 2) - 1 ? '#EEE' : '#DDD');

      if (!map[x][y - 1].tile) {
        d.draw(x, y - 1, null, null, '#444');
      }
    }
  }
}

const startPos = gen.getRooms()[0].getCenter();

const player = {
  x: startPos[0],
  y: startPos[1]
};

d.draw(player.x, player.y, 'P', '#0F0', null);

window.addEventListener('keydown', e => {
  let newX = player.x;
  let newY = player.y;

  switch (e.keyCode) {
    case KEYS.VK_UP:
      newY -= 1;
      break;
    case KEYS.VK_DOWN:
      newY += 1;
      break;
    case KEYS.VK_LEFT:
      newX -= 1;
      break;
    case KEYS.VK_RIGHT:
      newX += 1;
      break;
  }

  if (map[newX][newY].tile) {
    d.draw(
      player.x,
      player.y,
      ' ',
      null,
      (player.x % 2) + (player.y % 2) - 1 ? '#EEE' : '#DDD'
    );

    player.x = newX;
    player.y = newY;

    d.draw(player.x, player.y, 'P', '#0F0', null);
  }
});

async function mainLoop() {}
