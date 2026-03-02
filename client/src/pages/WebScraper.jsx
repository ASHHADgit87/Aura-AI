import React, { useState } from "react";
import { Loader2, Copy, Check, Globe, Code } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";

const WebScraper = () => {
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState("table");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!url.trim()) return toast.error("Please enter a URL");
    if (!url.startsWith("http")) return toast.error("Please enter a valid URL starting with http");
    try {
      setLoading(true);
      setResult(null);
      const { data } = await axios.post("/api/scrape", {
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

  const flattenObject = (obj, prefix = "") => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) return [...acc, ...flattenObject(value, fullKey)];
      return [...acc, { key: fullKey, value: Array.isArray(value) ? value.join(", ") : String(value) }];
    }, []);
  };

  const tableRows = result ? flattenObject(result) : [];

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Web Scraper</h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
              Enter any URL and AI will extract structured data from the page instantly.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            <form
              onSubmit={onSubmitHandler}
              className="bg-black/30 border border-white/20 rounded-2xl p-6 backdrop-blur-xl flex flex-col gap-4"
            >
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 transition-all backdrop-blur-lg"
                onFocus={(e) => e.currentTarget.style.borderColor = "rgba(255,122,24,0.4)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              >
                <Globe className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="bg-transparent outline-none text-sm text-white/90 placeholder:text-white/40 w-full"
                />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all backdrop-blur-lg"
                onFocus={(e) => e.currentTarget.style.borderColor = "rgba(255,122,24,0.4)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              >
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={2}
                  placeholder="Optional: What do you want to extract? (e.g. product names and prices)"
                  className="bg-transparent outline-none text-sm text-white/90 placeholder:text-white/40 resize-none w-full"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="w-full sm:w-auto px-5 py-1.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 border-2 border-white/30 hover:border-white/70 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" /> Scraping...
                    </>
                  ) : (
                    "Scrape Page"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="w-full max-w-3xl mt-12">
            {!result && !loading && (
              <div className="h-[400px] border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-white/40">
                <Code className="w-10 h-10 mb-4" />
                <p>Scraped data will appear here</p>
              </div>
            )}

            {loading && (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10" />
              </div>
            )}

            {result && !loading && (
              <div className="relative rounded-3xl border border-white/20 bg-black/20 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-400" />
                    <span className="text-xs truncate max-w-xs text-white/70">{url}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white/5 rounded-xl p-1 gap-1">
                      <button
                        type="button"
                        onClick={() => setViewMode("table")}
                        className={`px-3 py-1 rounded-lg text-xs transition-all ${viewMode === "table" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
                      >
                        Table
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("json")}
                        className={`px-3 py-1 rounded-lg text-xs transition-all ${viewMode === "json" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
                      >
                        JSON
                      </button>
                    </div>
                    <button
                      onClick={onCopyHandler}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy JSON"}
                    </button>
                  </div>
                </div>

                {viewMode === "table" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left px-5 py-3 uppercase tracking-widest font-medium text-white/40 w-1/3">Key</th>
                          <th className="text-left px-5 py-3 uppercase tracking-widest font-medium text-white/40">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.map((row, index) => (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-5 py-3 font-mono text-orange-400">{row.key}</td>
                            <td className="px-5 py-3 break-all text-white/70">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {viewMode === "json" && (
                  <div className="p-4">
                    <pre className="text-xs font-mono text-white/70 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                )}
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