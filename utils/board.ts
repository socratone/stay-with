import cloneDeep from 'lodash/cloneDeep';

export const createEmptyBoard = (x: number, y: number) => {
  const array2D = new Array(x);
  for (let i = 0; i < x; i++) {
    array2D[i] = new Array(y).fill(null);
  }
  return array2D as null[][];
};

export const assignValue = <V>(board: (V | null)[][], value: V) => {
  let isPut = false;
  const totalCells = board.length * board[0].length;

  // Create a flat array of all cells in the board
  const flatArray = board.flat();

  // value를 빈 board에 넣는다.
  while (!isPut) {
    const randomIndex = Math.floor(Math.random() * totalCells);
    if (!flatArray[randomIndex]) {
      isPut = true;
      flatArray[randomIndex] = value;
    }
  }

  // Reconstruct the 2D array from the modified flat array
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = flatArray[i * board[i].length + j];
    }
  }
};

export const assignValues = <V>(board: (V | null)[][], values: V[]) => {
  const totalCells = board.length * board[0].length;
  const newValues = cloneDeep(values);

  // Create a flat array of all cells in the board
  const flatArray = board.flat();

  // Set all values to null initially
  for (let i = 0; i < flatArray.length; i++) {
    flatArray[i] = null;
  }

  // 배열을 다 비울 때까지 value를 board에 넣는다.
  while (0 < newValues.length) {
    const randomIndex = Math.floor(Math.random() * totalCells);
    if (!flatArray[randomIndex]) {
      flatArray[randomIndex] = newValues.pop() ?? null;
    }
  }

  // Reconstruct the board from the modified flat array
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = flatArray[i * board[i].length + j];
    }
  }
};

export const parseBoardToArrayWithCoordinate = <T>(board: (T | null)[][]) => {
  const array = [];
  const newBoard = cloneDeep(board);
  // Iterate over each row in the board
  for (let i = 0; i < newBoard.length; i++) {
    // Iterate over each element in the row
    for (let j = 0; j < newBoard[i].length; j++) {
      // Check if the element is
      const value = newBoard[i][j];
      if (value) {
        // Add value and coordinate
        array.push({ ...value, row: i, column: j });
      }
    }
  }
  return array;
};
