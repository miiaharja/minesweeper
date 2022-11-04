import { useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";
import { Game } from "./components/UI/Game/Game";
import { Navbar } from "./components/UI/Navbar";

export function App() {
  const { setColorMode } = useColorMode();
  useEffect(() => {
    setColorMode("dark");
  }, [setColorMode]);

  return (
    <>
      <Navbar />
      <Game />
    </>
  );
}
