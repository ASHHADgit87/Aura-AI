import React, { useState } from "react";
import { Loader2, Copy, Check, Globe, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";
import api from "../configs/axios";

const WebScraper = () => {
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setUrl("");
    setPrompt("");
    setResult(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      result ? handleReset() : onSubmitHandler(e);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!url.trim()) return toast.error("Please enter a URL");
    if (!url.startsWith("http"))
      return toast.error("Please enter a valid URL starting with http");

    try {
      setLoading(true);
      setResult(null);

      const { data } = await api.post("/api/features/web-scrape", {
        url,
        prompt: prompt.trim() || "Extract all key information from this page",
      });

      setResult(data);
      toast.success("Page scraped successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to scrape URL");
    } finally {
      setLoading(false);
    }
  };

  const onCopyHandler = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    toast.success("JSON copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <section
          className="flex flex-col items-center text-white pb-20 px-6 flex-1"
          style={{
            background: "linear-gradient(180deg, #FF7A18 0%, #E10600 60%)",
          }}
        >
          <div className="w-full max-w-4xl mt-10 mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI Web Scraper
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
              Enter any URL and Aura AI will extract structured data from the
              page instantly.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            <form
              onSubmit={result ? (e) => e.preventDefault() : onSubmitHandler}
              className="bg-black/30 border border-white/20 rounded-2xl p-6 backdrop-blur-xl flex flex-col gap-4"
            >
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 transition-all backdrop-blur-lg">
                <Globe
                  className="w-4 h-4 shrink-0"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  onKeyDown={handleKeyDown}
                  className="bg-transparent outline-none text-sm text-white/90 placeholder:text-white/40 w-full"
                />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all backdrop-blur-lg">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Optional: What do you want to extract? (e.g. product names and prices)"
                  onKeyDown={handleKeyDown}
                  rows={2}
                  className="bg-transparent outline-none text-sm text-white/90 placeholder:text-white/40 resize-none w-full"
                />
              </div>

              <div className="flex justify-end mt-4 gap-3">
                {result ? (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-1.5 text-sm rounded-lg font-semibold text-white   
                    bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 
                    border border-white/30 hover:border-white/70 
                    hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="px-4 py-1.5 text-sm rounded-lg font-semibold text-white   
                    bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 
                    border border-white/30 hover:border-white/70 
                    hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center gap-2
                    disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" /> Scraping...
                      </>
                    ) : (
                      "Scrape Page"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="w-full max-w-3xl mt-12">
            {!result && !loading && (
              <div className="h-[300px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/30">
                <p>Scraped JSON Will Appear Here</p>
              </div>
            )}

            {loading && (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-white" />
              </div>
            )}

            {result && !loading && (
              <div className="relative animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="bg-[#1e1e2e]/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl relative">
                  <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h3 className="font-semibold text-orange-400 flex items-center gap-2">
                      <Globe size={20} /> Scraped Data
                    </h3>
                    <button
                      onClick={onCopyHandler}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check size={18} className="text-green-400" />
                      ) : (
                        <Copy size={18} className="text-white/70" />
                      )}
                    </button>
                  </div>

                  <div className="text-gray-200 font-sans text-[15px] leading-relaxed tracking-wide space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        <FooterForFeature />
      </div>
    </div>
  );
};

export default WebScraper;
