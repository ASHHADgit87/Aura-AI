import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
import About from "./pages/About";

const App = () => {
  const { pathname } = useLocation();

  const hideNavbarPaths = [
    "/login",
    "/register",
    "/image-generator",
    "/pdf-summarizer",
    "/image-analyzer",
    "/song-generator",
    "/bg-remover",
    "/translator",
    "/grammar-fixer",
    "/web-scraper",
  ];

  const hideFooterPaths = [
    "/login",
    "/register",
    "/about",
    "/image-generator",
    "/pdf-summarizer",
    "/image-analyzer",
    "/song-generator",
    "/bg-remover",
    "/translator",
    "/grammar-fixer",
    "/web-scraper",
  ];

  const hideNavbar = hideNavbarPaths.includes(pathname);
  const hideFooter = hideFooterPaths.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />

      {!hideNavbar && <Navbar />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
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

      {!hideFooter && <Footer />}
    </div>
  );
};

export default App;
