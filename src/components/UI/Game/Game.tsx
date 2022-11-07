import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Board, BoardState, gameTypes } from "./Board";
import {
  CustomDifficultyFields,
  CustomDifficultyModal,
} from "./CustomDifficultyModal";
import { DifficultyEnum } from "./DifficultyEnum";

export function Game() {
  const [difficulty, setDifficulty] = useState<DifficultyEnum>(
    DifficultyEnum.Easy,
  );

  const [customSettings, setCustomSettings] = useState<BoardState>(
    gameTypes[DifficultyEnum.Custom],
  );

  const { t } = useTranslation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCustomDifficultySubmit = (values: CustomDifficultyFields) => {
    onClose();
    setDifficulty(DifficultyEnum.Custom);
    setCustomSettings({
      height: Number(values.height),
      width: Number(values.width),
      mines: Number(values.mines),
    });
  };

  return (
    <Box display="grid" justifyContent="center">
      <Box margin="0 auto" p={5}>
        <Button m={2} onClick={() => setDifficulty(DifficultyEnum.Easy)}>
          {t("difficulty.easy")}
        </Button>
        <Button m={2} onClick={() => setDifficulty(DifficultyEnum.Normal)}>
          {t("difficulty.normal")}
        </Button>
        <Button m={2} onClick={() => setDifficulty(DifficultyEnum.Hard)}>
          {t("difficulty.hard")}
        </Button>
        <Button m={2} onClick={onOpen}>
          {t("difficulty.custom")}
        </Button>
      </Box>

      <CustomDifficultyModal
        onSubmit={handleCustomDifficultySubmit}
        isOpen={isOpen}
        onClose={onClose}
      />

      <Board difficulty={difficulty} customSettings={customSettings} />
    </Box>
  );
}
