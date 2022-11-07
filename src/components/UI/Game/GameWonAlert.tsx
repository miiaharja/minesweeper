import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { StartAgainBtn } from "./StartAgainBtn";

type Props = {
  handleClick: () => void;
};

export function GameWonAlert({ handleClick }: Props) {
  const { t } = useTranslation();
  return (
    <Box display="grid" bg="green" p={4}>
      {t("game.you-won")}
      <StartAgainBtn handleClick={handleClick} />
    </Box>
  );
}
