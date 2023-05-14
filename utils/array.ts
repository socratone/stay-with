export const create2DArray = (x: number, y: number) => {
  const array2D = new Array(x);
  for (let i = 0; i < x; i++) {
    array2D[i] = new Array(y).fill(0);
  }
  return array2D as 0[][];
};

export const assignTruthyValues = (array: number[][], truthyCount: number) => {
  const totalCells = array.length * array[0].length;

  // Ensure the truthyCount is within the valid range
  truthyCount = Math.min(truthyCount, totalCells);
  truthyCount = Math.max(truthyCount, 0);

  // Create a flat array of all cells in the 2D array
  const flatArray = array.flat();

  // Set all values to 0 initially
  for (let i = 0; i < flatArray.length; i++) {
    flatArray[i] = 0;
  }

  // Assign 1 values randomly until the desired count is reached
  let count = 0;
  while (count < truthyCount) {
    const randomIndex = Math.floor(Math.random() * totalCells);
    if (!flatArray[randomIndex]) {
      flatArray[randomIndex] = 1;
      count++;
    }
  }

  // Reconstruct the 2D array from the modified flat array
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      array[i][j] = flatArray[i * array[i].length + j];
    }
  }
};

export const addCoordinateFrom2DArray = (
  values: { [key: string]: any }[],
  array: any[][]
) => {
  let valueIndex = 0;
  // Iterate over each row in the array
  for (let i = 0; i < array.length; i++) {
    // Iterate over each element in the row
    for (let j = 0; j < array[i].length; j++) {
      // Check if the element is 1
      if (array[i][j] === 1) {
        // Replace 1 with value and coordinate
        values[valueIndex] = { ...values[valueIndex], row: i, column: j };
        valueIndex++;
      }
    }
  }

  return values;
};
