import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import { Board } from "./Board";
import { DifficultyEnum } from "./DifficultyEnum";

export function Game() {
  const [difficulty, setDifficulty] = useState<DifficultyEnum>(
    DifficultyEnum.Easy,
  );

  return (
    <Box display="grid" justifyContent="center">
      <Box margin="0 auto" p={5}>
        <Button onClick={() => setDifficulty(DifficultyEnum.Easy)}>Easy</Button>
        <Button onClick={() => setDifficulty(DifficultyEnum.Normal)}>
          Normal
        </Button>
        <Button onClick={() => setDifficulty(DifficultyEnum.Hard)}>Hard</Button>
      </Box>

      <Board difficulty={difficulty} />
    </Box>
  );
}
