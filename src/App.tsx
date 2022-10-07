import Footer from "./components/Footer";
import Container from "./components/Container";

function App() {
  return (
    <div className="h-screen overflow-auto py-[5%] text-center font-sans dark:bg-slate-800 dark:text-white">
      <div className="inline-block">
        <Container />
        <Footer />
      </div>
    </div>
  );
}
export default App;
