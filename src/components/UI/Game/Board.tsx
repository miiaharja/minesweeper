import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Cell } from "./Cell";
import { DifficultyEnum } from "./DifficultyEnum";

export type BoardState = {
  height: number;
  width: number;
  mines: number;
};

type Props = {
  difficulty: DifficultyEnum;
};

type GameState = {
  grid: GridCell[][];
  minesCount: number;
  gameOver: boolean;
  revealedCells: number;
};

type GridCell = {
  x: number;
  y: number;
  n: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isUnknown: boolean;
  isClicked: boolean;
};

const gameTypes: Record<DifficultyEnum, BoardState> = {
  [DifficultyEnum.Easy]: { height: 8, mines: 10, width: 8 },
  [DifficultyEnum.Normal]: { height: 12, mines: 15, width: 12 },
  [DifficultyEnum.Hard]: { height: 15, mines: 20, width: 15 },
};

export function Board({ difficulty }: Props) {
  const [board, setBoard] = useState<BoardState>(gameTypes[difficulty]);
  const [gameState, setGameState] = useState<GameState>({
    gameOver: false,
    grid: createNewBoard(board.height, board.width, board.mines),
    minesCount: board.mines,
    revealedCells: 0,
  });

  useEffect(() => {
    setGameState({
      gameOver: false,
      grid: createNewBoard(board.height, board.width, board.mines),
      minesCount: board.mines,
      revealedCells: 0,
    });
  }, [board.height, board.mines, board.width]);

  useEffect(() => {
    setBoard(gameTypes[difficulty]);
  }, [difficulty]);

  return (
    <Box
      display="grid"
      gridTemplateRows={`repeat(${board.height}, 50px)`}
      gridTemplateColumns={`repeat(${board.width}, 50px)`}
    >
      {gameState.grid.map((row) =>
        row.map((cell) => (
          <Cell
            key={cell.y * row.length + cell.x}
            onClickHandler={() => {
              console.log(cell);
            }}
            onRightClickHandler={() => {
              console.log(cell);
            }}
            {...cell}
            neighbourMines={cell.n}
          />
        )),
      )}
    </Box>
  );
}

function getNeighbours(grid: GridCell[][], y: number, x: number) {
  const neighbours = [];
  const currentRow = grid[y];
  const prevRow = grid[y - 1];
  const nextRow = grid[y + 1];

  if (currentRow[x - 1]) neighbours.push(currentRow[x - 1]);
  if (currentRow[x + 1]) neighbours.push(currentRow[x + 1]);
  if (prevRow) {
    if (prevRow[x - 1]) neighbours.push(prevRow[x - 1]);
    if (prevRow[x]) neighbours.push(prevRow[x]);
    if (prevRow[x + 1]) neighbours.push(prevRow[x + 1]);
  }
  if (nextRow) {
    if (nextRow[x - 1]) neighbours.push(nextRow[x - 1]);
    if (nextRow[x]) neighbours.push(nextRow[x]);
    if (nextRow[x + 1]) neighbours.push(nextRow[x + 1]);
  }

  return neighbours;
}

function getRandomMines(amount: number, columns: number, rows: number) {
  const minesArray = [];
  const limit = columns * rows;
  const minesPool = [...Array(limit).keys()];

  for (let i = 0; i < amount; i += 1) {
    const n = Math.floor(Math.random() * minesPool.length);
    minesArray.push(...minesPool.splice(n, 1));
  }

  return minesArray;
}

function addGridCell(grid: GridCell[][], gridCell: GridCell) {
  const y = grid.length - 1;
  const x = grid[y].length;
  const lastGridCell = gridCell;
  const neighbours = getNeighbours(grid, y, x);

  for (const neighbourGridCell of neighbours) {
    if (lastGridCell.isMine) {
      neighbourGridCell.n += 1;
    } else if (neighbourGridCell.isMine) {
      lastGridCell.n += 1;
    }
  }

  grid[y].push(gridCell);
}

function createNewBoard(rows: number, columns: number, minesCount: number) {
  const grid: GridCell[][] = [];
  const minesArray = getRandomMines(minesCount, columns, rows);

  for (let i = 0; i < columns; i += 1) {
    grid.push([]);
    for (let j = 0; j < rows; j += 1) {
      const gridCell: GridCell = {
        y: i,
        x: j,
        n: 0,
        isRevealed: false,
        isFlagged: false,
        isUnknown: false,
        isClicked: false,
        isMine: minesArray.includes(i * rows + j),
      };
      addGridCell(grid, gridCell);
    }
  }
  console.log(grid);
  return grid;
}
