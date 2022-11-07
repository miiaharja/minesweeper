import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { StartAgainBtn } from "./StartAgainBtn";

type Props = {
  handleClick: () => void;
};

export function GameOverAlert({ handleClick }: Props) {
  const { t } = useTranslation();
  return (
    <Box display="grid" bg="tomato" p={4}>
      {t("game.game-over")}
      <StartAgainBtn handleClick={handleClick} />
    </Box>
  );
}
