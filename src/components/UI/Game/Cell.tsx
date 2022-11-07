import { Box } from "@chakra-ui/react";
import { useEffect } from "react";

type Props = {
  onClickHandler: () => void;
  onRightClickHandler: () => void;
  x: number;
  y: number;
  isFlagged: boolean;
  isMine: boolean;
  isRevealed: boolean;
  neighbourMines: number;
};

export function Cell({
  onClickHandler,
  onRightClickHandler,
  x,
  y,
  isFlagged,
  isMine,
  isRevealed,
  neighbourMines,
}: Props) {
  const getValue = () => {
    if (!isRevealed) {
      return isFlagged ? "🚩" : null;
    }
    if (isMine) {
      return "💣";
    }
    if (neighbourMines === 0) {
      return null;
    }
    return neighbourMines;
  };

  useEffect(() => {
    console.log(isRevealed);
  }, [isRevealed]);

  return (
    <Box
      as="button"
      bg={isRevealed ? "#372948" : "#FFCACA"}
      gridColumn={x + 1}
      gridRow={y + 1}
      border="1px solid white"
      onClick={onClickHandler}
      onContextMenu={onRightClickHandler}
    >
      {getValue()}
    </Box>
  );
}
