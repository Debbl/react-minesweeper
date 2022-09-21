import type { Dispatch } from "react";
import { createContext } from "react";

const MainContext = createContext<{
  isDev: boolean;
  setIsDev: Dispatch<boolean>;
}>({
  isDev: false,
  setIsDev: (isDev: boolean) => isDev,
});

export default MainContext;
