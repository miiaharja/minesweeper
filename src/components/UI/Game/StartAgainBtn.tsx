import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type Props = {
  handleClick: () => void;
};

export function StartAgainBtn({ handleClick }: Props) {
  const { t } = useTranslation();
  return (
    <Button alignSelf="right" colorScheme="blue" onClick={handleClick}>
      {t("game.start-again")}
    </Button>
  );
}
