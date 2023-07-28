import { wins } from "config";

import { sort } from "./sort";

// Функция выдающая строку где, есть хотя бы 1 пустой 0
export function getFreeRow(map: Uint8Array) {
  return sort(wins).find((row) => {
    return row.findIndex((c) => !map[c]) !== -1;
  });
}
