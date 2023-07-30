<script lang="ts">
  import { names, statuses } from "config";
  import { checkWin } from "lib/checkWin";
  import { getFreeRow } from "lib/getFreeRow";
  import { getRows } from "lib/getRows";
  import { sort } from "lib/sort";
  import { beforeUpdate } from "svelte";

  // Хранилище всей карты в числах
  // 0 - Пустая ячейка
  // 1 - Первый игрок
  // 2 - Второй игрок
  const map = new Uint8Array(9);

  let fPlayer = 0; // Кто ходит первым

  let player = fPlayer; // Текущий игрок 0 или 1
  let steps = 0; // Количество шагов
  let win: number[] | undefined; // Выиграшная строка
  let wait = 3; // Ожидание

  // True, если больше ходить нельзя
  $: noSteps = steps === 9;

  // Функция хода ИИ
  function aiStep() {
    // В 70 процентах случаев, если центр свободен, ходим туда
    if (!map[4] && Math.random() < 0.7) {
      return select(4, 1);
    }

    const row = (
      getRows(map, 2, 2) ?? // Вышиграшная строка, или
      getRows(map, 1, 2) ?? // Строка, чтобы не проиграть, или
      getRows(map, 2, 1) ?? // Строка, где уже есть наша позиция, или
      getFreeRow(map)
    ) // Рандомная строка с пустым полем
      .filter((e) => !map[e]); // И в ней я ищу именно пустые ячейки

    const step = sort(row)[0];

    // Делается ход ИИ если ячейка найдена
    if (typeof step === "number") {
      select(step, 1);
    }
  }

  // Функция хода. Первый аргумент ячейка. Второй, не обязательный, игрок.
  function select(n: number, pl = 0) {
    // Если на карте что-то есть, или есть выигрыш, или игрок не тот
    if (map[n] || win || player !== pl) {
      return;
    }

    steps++; // Добаляем количество шагов в игре
    map[n] = player + 1; // Устанавливаем нужное значение на карту

    // Ищем выиграшную строку
    if ((win = checkWin(map))) {
      return;
    }

    player = +!player; // Меняем игрока
  }

  // Тут всё просто сбрасываем в начало
  function reset() {
    win = undefined; // Удаляем строку
    steps = 0; // Удаляем шаги
    player = fPlayer; // Ставим первого игрока
    wait = 3; // Ставим ожидание на 3

    // Чистим карту
    for (let i = 0; i < map.length; i++) {
      map[i] = 0;
    }
  }

  // Перед каждым обновлением компонента выполняется функция
  beforeUpdate(() => {
    // Если выпала ничья
    if (!win && noSteps) {
      // Через секунду
      setTimeout(() => {
        // Если есть еще ожидание уменьшаем
        if (wait > 1) wait--;
        else reset(); // Иначе сброс
      }, 1000);
    }

    // Если выбран второй игрок и нет выигрыша и есть доступные шаги
    if (player === 1 && !win && !noSteps) {
      // Через задержку выполняем aiStep
      setTimeout(aiStep, Math.random() * 500 + 500);
    }
  });
</script>

<!-- Тут состояние -->
{#if !noSteps || win}
  <p>{statuses[+!!win]} {names[player]}</p>
{:else}
  <p>Ничья. ({wait}с)</p>
{/if}

<!-- Тут карта с кликами и состоянеием -->
<div class="map">
  {#each map as val, i}
    <div
      class="item"
      on:mousedown={(e) => !e.button && select(i)}
      data-win={win?.includes(i)}
      data-val={val}
    />
  {/each}
</div>

<!-- Кнопка выбора первого игрока -->
<button
  on:mousedown={() => {
    fPlayer = +!fPlayer;
    reset();
  }}
>
  Первый - {names[fPlayer]}
</button>

<!-- Кнопка перезагрузки -->
<button on:mousedown={reset}>Перезапуск</button>

<!-- Ссылка на гитхаб -->
<a href="https://github.com/vicimpa/tic-tac-svelte">GitHub</a>
