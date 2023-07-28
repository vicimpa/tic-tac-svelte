import { wins } from "config";

// Поиск строки, которая выиграла
export function checkWin(map: Uint8Array) {
  for (const row of wins) {
    const [a, b, c] = row;

    if (map[a] && map[a] === map[b] && map[a] === map[c])
      return row;
  }

  return undefined;
}