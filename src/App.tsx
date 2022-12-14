import Footer from "./components/Footer";
import Container from "./components/Container";
import Ranking from "./components/Ranking";

function App() {
  return (
    <div className="h-screen overflow-auto py-[5%] text-center font-sans dark:bg-slate-800 dark:text-white">
      <div className="inline-block h-screen">
        <Container />
        <Footer />
      </div>
      <Ranking />
    </div>
  );
}
export default App;
