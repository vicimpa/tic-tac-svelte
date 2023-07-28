// Имена игроков
export const names = [
  "игрок",        // 0
  "компьютер"     // 1
];

// Состояния статуса
export const statuses = [
  "Сейчас ходит",   // false
  "Победил"         // true
];

// Все позиции для поиска выиграша
export const wins = [
  [0, 1, 2], // 1 →
  [3, 4, 5], // 2 →
  [6, 7, 8], // 3 →

  [0, 3, 6], // 1 ↓
  [1, 4, 7], // 2 ↓
  [2, 5, 8], // 3 ↓

  [0, 4, 8], // 1 ➘
  [6, 4, 2], // 2 ➚
];