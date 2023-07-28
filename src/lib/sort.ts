// Функция рандомной сортировки масиива
export const sort = <T>(array: T[]) => {
  const output: T[] = [];
  const newArray = [...array];

  while (newArray.length) {
    output.push(
      newArray.splice(
        Math.random() * newArray.length, 1
      )[0]
    );
  }

  return output;
};