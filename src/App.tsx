import { Footer } from "./pages/footer/footer";
import { Navbar } from "./pages/header/navebar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import {
  Homepage,
  Shopepage,
  Aboutpage,
  Contactpage,
} from "./pages/components/index";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/shop" element={<Shopepage />} />
            <Route path="/about" element={<Aboutpage />} />
            <Route path="/contact" element={<Contactpage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
