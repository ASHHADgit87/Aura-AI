import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ImageGenerator from "./pages/ImageGenerator";
import PdfSummarizer from "./pages/PdfSummarizer";
import ImageAnalyzer from "./pages/ImageAnalyzer";
import SongGenerator from "./pages/SongGenerator";
import BgRemover from "./pages/BgRemover";
import Translator from "./pages/Translator";
import GrammarFixer from "./pages/GrammarFixer";
import WebScraper from "./pages/WebScraper";

const App = () => {
  const { pathname } = useLocation();

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/register";

  return (
    <div>
      <Toaster />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/image-generator" element={<ImageGenerator />} />
        <Route path="/pdf-summarizer" element={<PdfSummarizer />} />
        <Route path="/image-analyzer" element={<ImageAnalyzer />} />
        <Route path="/song-generator" element={<SongGenerator />} />
        <Route path="/bg-remover" element={<BgRemover />} />
        <Route path="/translator" element={<Translator />} />
        <Route path="/grammar-fixer" element={<GrammarFixer />} />
        <Route path="/web-scraper" element={<WebScraper />} />
      </Routes>
    </div>
  );
};

export default App;