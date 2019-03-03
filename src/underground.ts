import { Display, Map, RNG, KEYS } from 'rot-js';
import { Game } from './game';

console.log('hello dungeon');

RNG.setSeed(11);

new Game().start();
