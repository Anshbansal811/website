import { Footer } from "./pages/footer/footer";
import { Navbar } from "./pages/header/navebar";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow"></main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
