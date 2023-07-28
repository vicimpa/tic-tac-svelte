<script lang="ts">
  import { names, statuses } from "config";
  import { checkWin } from "lib/checkWin";
  import { getFreeRow } from "lib/getFreeRow";
  import { getRows } from "lib/getRows";
  import { beforeUpdate } from "svelte";

  // Хранилище всей карты в числах
  // 0 - Пустая ячейка
  // 1 - Первый игрок
  // 2 - Второй игрок
  const map = new Uint8Array(9);

  let player = 0; // Текущий игрок 0 или 1
  let steps = 0; // Количество шагов
  let win: number[] | undefined; // Выиграшная строка

  // True, если больше ходить нельзя
  $: noSteps = steps === 9;

  // Функция хода ИИ
  function aiStep() {
    const step = (
      getRows(map, 2, 2) ?? // Вышиграшная строка или
      getRows(map, 1, 2) ?? // Строка, чтобы не проиграть или
      getFreeRow(map)
    ) // Рандомная строка с пустым полем
      .find((e) => !map[e]); // И в ней я ищу именно пустую ячейку

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
    player = 0; // Ставим первого игрока

    // Чистим карту
    for (let i = 0; i < map.length; i++) {
      map[i] = 0;
    }
  }

  // Перед каждым обновлением компонента выполняется функция
  beforeUpdate(() => {
    // Если выбран второй игрок и нет выигрыша и есть доступные шаги
    if (player === 1 && !win && !noSteps) {
      // Через задержку выполняем aiStep
      setTimeout(aiStep, Math.random() * 1000 + 500);
    }
  });
</script>

<!-- Тут состояние -->
{#if !noSteps || win}
  <p>{statuses[+win]} {names[player]}</p>
{:else}
  <p>Ничья</p>
{/if}

<!-- Тут карта с кликами и состоянеием -->
<div class="map">
  {#each map as val, i}
    <div
      class="item"
      on:mousedown={() => select(i)}
      data-win={win?.includes(i)}
      data-val={val}
    />
  {/each}
</div>

<!-- Кнопка перезагрузки -->
<button on:mousedown={reset}>Перезапуск</button>

<!-- Ссылка на гитхаб -->
<a href="https://github.com/vicimpa/tic-tac-svelte">GitHub</a>
