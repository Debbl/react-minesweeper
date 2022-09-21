import { useState } from "react";
import Container from "./components/Container";
import MainContext from "./contexts/MainContext";

function App() {
  const [isDev, setIsDev] = useState(false);
  return (
    <div className="box-border flex h-screen justify-center pt-[10%]">
      <MainContext.Provider value={{ isDev, setIsDev }}>
        <Container />
      </MainContext.Provider>
    </div>
  );
}
export default App;
