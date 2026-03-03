import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAppContext } from "./context/authContext";
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
import DeletePage from "./pages/DeletePage";
import ProtectedRoute from "./components/ProtectedRoute";
import OnlyNewUsersRoute from "./components/OnlyNewUsersRoute";

const App = () => {
  const { pathname } = useLocation();
  const { loading } = useAppContext();

  if (loading) {
    return null;
  }

  const hideNavbarPaths = [
    "/login",
    "/register",
    "/settings",
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
    "/settings",
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
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/register"
            element={
              <OnlyNewUsersRoute>
                <Register />
              </OnlyNewUsersRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DeletePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/image-generator"
            element={
              <ProtectedRoute>
                <ImageGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pdf-summarizer"
            element={
              <ProtectedRoute>
                <PdfSummarizer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/image-analyzer"
            element={
              <ProtectedRoute>
                <ImageAnalyzer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/song-generator"
            element={
              <ProtectedRoute>
                <SongGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bg-remover"
            element={
              <ProtectedRoute>
                <BgRemover />
              </ProtectedRoute>
            }
          />
          <Route
            path="/translator"
            element={
              <ProtectedRoute>
                <Translator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grammar-fixer"
            element={
              <ProtectedRoute>
                <GrammarFixer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/web-scraper"
            element={
              <ProtectedRoute>
                <WebScraper />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default App;
