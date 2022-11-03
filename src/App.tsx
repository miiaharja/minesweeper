import { Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function App() {
  const [count, setCount] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    console.log(count);
  }, [count]);

  return (
    <Box>
      <Button onClick={() => setCount((prevCount) => prevCount + 1)}>
        {t("temp.counter-count", { count })}
      </Button>
    </Box>
  );
}
