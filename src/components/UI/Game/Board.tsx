/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import { Cell } from "./Cell";
import { DifficultyEnum } from "./DifficultyEnum";
import { GameOverAlert } from "./GameOverAlert";
import { GameWonAlert } from "./GameWonAlert";

export type BoardState = {
  height: number;
  width: number;
  mines: number;
};

type Props = {
  difficulty: DifficultyEnum;
  customSettings: BoardState;
};

type GameState = {
  grid: GridCell[][];
  minesCount: number;
  gameStatus: GameStatusEnum;
  revealedCells: number;
};

enum GameStatusEnum {
  InProgress = 0,
  Win = 1,
  Lost = 2,
}

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

export const gameTypes: Record<DifficultyEnum, BoardState> = {
  [DifficultyEnum.Easy]: { height: 8, mines: 10, width: 8 },
  [DifficultyEnum.Normal]: { height: 12, mines: 15, width: 12 },
  [DifficultyEnum.Hard]: { height: 15, mines: 20, width: 15 },
  [DifficultyEnum.Custom]: { height: 15, mines: 20, width: 15 },
};

export function Board({ difficulty, customSettings }: Props) {
  const [board, setBoard] = useState<BoardState>(gameTypes[difficulty]);

  const startingState: GameState = useMemo(
    () => ({
      gameStatus: GameStatusEnum.InProgress,
      grid: createNewBoard(board.height, board.width, board.mines),
      minesCount: board.mines,
      revealedCells: 0,
    }),
    [board.height, board.mines, board.width],
  );

  const [gameState, setGameState] = useImmer<GameState>(startingState);

  // Reset state when board config changes
  useEffect(() => {
    setGameState(startingState);
  }, [setGameState, startingState]);

  useEffect(() => {
    if (difficulty === DifficultyEnum.Custom) {
      setBoard(customSettings);
    } else {
      setBoard(gameTypes[difficulty]);
    }
  }, [customSettings, difficulty]);

  const revealBoard = useCallback(() => {
    setGameState((draft) => {
      const currentGrid = draft.grid;
      for (const row of currentGrid) {
        for (const gridCell of row) {
          gridCell.isRevealed = true;
        }
      }
    });
  }, [setGameState]);

  const killBoard = useCallback(
    (gameStatus: GameStatusEnum) => {
      setGameState((draft) => {
        draft.gameStatus = gameStatus;
      });
      revealBoard();
    },
    [revealBoard, setGameState],
  );

  // Check victory every time the game state changes
  useEffect(() => {
    function getRevealed() {
      return gameState.grid
        .reduce((r, v) => {
          r.push(...v);
          return r;
        }, [])
        .map((v) => v.isRevealed)
        .filter((v) => !!v).length;
    }
    function checkVictory() {
      const revealed = getRevealed();
      if (
        revealed >= board.height * board.width - board.mines &&
        gameState.gameStatus !== 2
      ) {
        killBoard(GameStatusEnum.Win);
      }
    }
    checkVictory();
  }, [board, gameState, killBoard, setGameState]);

  // Cell click handlers
  function handleLeftClick(y: number, x: number): void {
    setGameState((draft) => {
      const currentGrid = draft.grid;
      const gridCell = currentGrid[y][x];
      gridCell.isClicked = true;

      if (gridCell.isRevealed || gridCell.isFlagged) {
        return;
      }

      // Ends game if mine
      if (gridCell.isMine) {
        killBoard(GameStatusEnum.Lost);
        return;
      }

      if (isEmpty(gridCell)) {
        revealEmptyNeigbhours(currentGrid, y, x);
      }

      gridCell.isFlagged = false;
      gridCell.isRevealed = true;
    });
  }

  const handleRestart = () => {
    setGameState(startingState);
  };

  return (
    <>
      <Box
        display="grid"
        gridTemplateRows={`repeat(${board.height}, 50px)`}
        gridTemplateColumns={`repeat(${board.width}, 50px)`}
        justifyContent="center"
      >
        {gameState.grid.map((row) =>
          row.map((cell) => (
            <Cell
              key={cell.y * row.length + cell.x}
              onClickHandler={() => {
                handleLeftClick(cell.y, cell.x);
              }}
              onRightClickHandler={() => {}}
              {...cell}
              neighbourMines={cell.n}
            />
          )),
        )}
      </Box>
      {gameState.gameStatus === GameStatusEnum.Win ? (
        <GameWonAlert handleClick={handleRestart} />
      ) : (
        ""
      )}
      {gameState.gameStatus === GameStatusEnum.Lost ? (
        <GameOverAlert handleClick={handleRestart} />
      ) : (
        ""
      )}
    </>
  );
}

// Get empty cell
function isEmpty(cell: GridCell) {
  return cell.n === 0 && !cell.isMine;
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

function revealEmptyNeigbhours(grid: GridCell[][], y: number, x: number) {
  const neighbours = [...getNeighbours(grid, y, x)];
  grid[y][x].isFlagged = false;
  grid[y][x].isRevealed = true;

  while (neighbours.length) {
    const neighbourGridCell = neighbours.shift();

    if (neighbourGridCell === undefined) {
      continue;
    }
    if (neighbourGridCell.isRevealed) {
      continue;
    }
    if (isEmpty(neighbourGridCell)) {
      neighbours.push(
        ...getNeighbours(grid, neighbourGridCell.y, neighbourGridCell.x),
      );
    }

    neighbourGridCell.isFlagged = false;
    neighbourGridCell.isRevealed = true;
  }
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
  return grid;
}
