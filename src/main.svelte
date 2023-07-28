<script lang="ts">
  const map = new Uint8Array(9);
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

  function checkWin() {
    for(const [a, b, c] of wins) {
      if(map[a] && map[a] === map[b] && map[a] === map[c])
        return true;
    }

    return false;
  }

  function select(n: number) {
    if(map[n] || win) return

    map[n] = player + 1;
    steps++;

    if(checkWin()) {
      win = true;
      return
    }

    player = +!player;
  }

  function reset() {
    win = false;
    steps = 0;
    player = 0;
    
    for(let i = 0; i < map.length; i++)
      map[i] = 0
  }
</script>

{#if steps !== 9 || win }
  <p>{win ? 'Победил игрок' : 'Сейчас ходит'} {player + 1}</p>
{:else}
  <p>Ничья</p>
{/if}


<div class="map">
  {#each map as val, i}
    <div class="item" on:mousedown={() => select(i)} data-val={val} />
  {/each}
</div>

<button on:mousedown={reset}>Перезапуск</button>