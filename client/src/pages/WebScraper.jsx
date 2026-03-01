import React, { useState } from "react";
import { Loader2, Copy, Check, Globe, Code } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import DashboardLayout from "../components/DashboardLayout";

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
      const { data } = await axios.post("/api/scrape", { url, prompt: prompt.trim() || "Extract all key information from this page" });
      setResult(data);
      toast.success("Page scraped successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to scrape URL");
    } finally {
      setLoading(false);
    }
  };

  const onCopyHandler = () => {
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
    <DashboardLayout>
      <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
        <div className="w-full max-w-4xl mt-10 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, #FF7A18, #E10600)" }}>🕷️</div>
            <h1 className="text-2xl font-semibold" style={{ color: "#F5F5F7" }}>AI Web Scraper</h1>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Enter any URL and AI will extract structured data from the page instantly.</p>
        </div>

        <form onSubmit={onSubmitHandler} className="w-full max-w-4xl flex flex-col gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 transition-all backdrop-blur-lg"
            onFocus={(e) => e.currentTarget.style.borderColor = "rgba(255,122,24,0.4)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
          >
            <Globe className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com"
              className="bg-transparent outline-none text-white/90 placeholder:text-white/20 w-full text-sm" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all backdrop-blur-lg"
            onFocus={(e) => e.currentTarget.style.borderColor = "rgba(255,122,24,0.4)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
          >
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={2}
              placeholder="Optional: What do you want to extract? (e.g. product names and prices)"
              className="bg-transparent outline-none text-white/90 placeholder:text-white/20 resize-none w-full text-sm" />
          </div>
          <button type="submit" disabled={loading || !url.trim()}
            className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{ background: "linear-gradient(to right, #FF7A18, #E10600, #FF4DA6)", boxShadow: "0 0 35px rgba(255,122,24,0.4)" }}>
            {loading ? <><span>Scraping</span><Loader2 className="animate-spin w-4 h-4" /></> : "Scrape Page →"}
          </button>
        </form>

        {loading && (
          <div className="w-full max-w-4xl mt-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center h-48 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#FF7A18" }} />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Scraping and extracting data...</p>
          </div>
        )}

        {result && !loading && (
          <div className="w-full max-w-4xl mt-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-lg">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" style={{ color: "#FF7A18" }} />
                <span className="text-xs truncate max-w-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{url}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white/5 rounded-lg p-1 gap-1">
                  <button type="button" onClick={() => setViewMode("table")}
                    className={`px-3 py-1 rounded-md text-xs transition-all ${viewMode === "table" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}>Table</button>
                  <button type="button" onClick={() => setViewMode("json")}
                    className={`px-3 py-1 rounded-md text-xs transition-all ${viewMode === "json" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}>JSON</button>
                </div>
                <button onClick={onCopyHandler} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs transition-all">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy JSON"}
                </button>
              </div>
            </div>

            {viewMode === "table" && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-5 py-3 uppercase tracking-widest font-medium w-1/3"
                        style={{ color: "rgba(255,255,255,0.3)" }}>Key</th>
                      <th className="text-left px-5 py-3 uppercase tracking-widest font-medium"
                        style={{ color: "rgba(255,255,255,0.3)" }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3 font-mono" style={{ color: "#FF7A18" }}>{row.key}</td>
                        <td className="px-5 py-3 break-all" style={{ color: "rgba(255,255,255,0.6)" }}>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {viewMode === "json" && (
              <div className="p-5">
                <pre className="text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono"
                  style={{ color: "rgba(255,255,255,0.6)" }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {!result && !loading && (
          <div className="w-full max-w-4xl mt-6 bg-white/5 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center h-48 gap-3">
            <Code className="w-8 h-8 text-white/10" />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Scraped data will appear here as a table or JSON</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default WebScraper;