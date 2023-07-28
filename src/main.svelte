<script lang="ts">
  import { beforeUpdate } from "svelte";

  const map = new Uint8Array(9);
  const names = ["игрок", "компьютер"];
  const statuses = ["Сейчас ходит", "Победил"];
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  let player = 0;
  let steps = 0;
  let win = false;
  let winRow: number[] = [];

  $: noSteps = steps !== 9;

  function checkWin() {
    for (const row of wins) {
      const [a, b, c] = row;
      if (map[a] && map[a] === map[b] && map[a] === map[c]) {
        winRow = row;
        return true;
      }
    }

    return false;
  }

  function sort() {
    wins.sort(() => (Math.random() > 0.5 ? 1 : -1));
  }

  function getFreeRow() {
    sort();

    return wins.find((row) => {
      return row.findIndex((c) => !map[c]) !== -1;
    });
  }

  function getRows(player: number, count: number) {
    sort();

    return wins.find((row) => {
      let cv = 0;

      for (const c of row) {
        if (map[c] === player) cv++;
        if (map[c] && map[c] !== player) cv--;
      }

      return cv === count;
    });
  }

  function aiStep() {
    const step = (getRows(2, 2) ?? getRows(1, 2) ?? getFreeRow()).find(
      (e) => !map[e]
    );

    select(step, 1);
  }

  function select(n: number, pl = 0) {
    if (map[n] || win || player !== pl) return;

    map[n] = player + 1;
    steps++;

    if (checkWin()) {
      win = true;
      return;
    }

    player = +!player;
  }

  function reset() {
    win = false;
    winRow = [];
    steps = 0;
    player = 0;

    for (let i = 0; i < map.length; i++) map[i] = 0;
  }

  beforeUpdate(() => {
    if (player === 1 && !win && noSteps) {
      setTimeout(aiStep, Math.random() * 1000 + 500);
    }
  });
</script>

{#if noSteps || win}
  <p>{statuses[+win]} {names[player]}</p>
{:else}
  <p>Ничья</p>
{/if}

<div class="map">
  {#each map as val, i}
    <div
      class="item"
      on:mousedown={() => select(i)}
      data-win={winRow.includes(i)}
      data-val={val}
    />
  {/each}
</div>

<button on:mousedown={reset}>Перезапуск</button>
