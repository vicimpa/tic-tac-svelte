import { wins } from "config";

import { sort } from "./sort";

// Функция выдающая строку где, указанный player имеет count позиций
export function getRows(map: Uint8Array, player: number, count: number) {
  return sort(wins).find((row) => {
    let cv = 0, cn = 0;

    for (const c of row) {
      if (map[c] === player) cv++;
      if (!map[c]) cn++;
    }

    return cv === count && cn;
  });
}