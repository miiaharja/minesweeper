import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import { Board } from "./Board";
import { DifficultyEnum } from "./DifficultyEnum";

export function Game() {
  const [difficulty, setDifficulty] = useState<DifficultyEnum>(
    DifficultyEnum.Easy,
  );

  return (
    <Box>
      <Button onClick={() => setDifficulty(DifficultyEnum.Easy)}>Easy</Button>
      <Button onClick={() => setDifficulty(DifficultyEnum.Normal)}>
        Normal
      </Button>
      <Button onClick={() => setDifficulty(DifficultyEnum.Hard)}>Hard</Button>
      <Board difficulty={difficulty} />
    </Box>
  );
}
