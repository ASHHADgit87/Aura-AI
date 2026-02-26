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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-lg">🕷️</div>
            <h1 className="text-2xl font-semibold">AI Web Scraper</h1>
          </div>
          <p className="text-white/40 text-xs">Enter any URL and AI will extract structured data from the page instantly.</p>
        </div>

        <form onSubmit={onSubmitHandler} className="w-full max-w-4xl flex flex-col gap-3">
          <div className="bg-white/5 border border-white/10 focus-within:border-red-500/50 rounded-xl px-4 py-3 flex items-center gap-3 transition-all">
            <Globe className="w-4 h-4 text-white/30 shrink-0" />
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com"
              className="bg-transparent outline-none text-white/90 placeholder:text-white/20 w-full text-sm" />
          </div>
          <div className="bg-white/5 border border-white/10 focus-within:border-red-500/50 rounded-xl p-4 transition-all">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={2}
              placeholder="Optional: What do you want to extract? (e.g. product names and prices)"
              className="bg-transparent outline-none text-white/90 placeholder:text-white/20 resize-none w-full text-sm" />
          </div>
          <button type="submit" disabled={loading || !url.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-red-600 to-pink-600 hover:brightness-110 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <><span>Scraping</span><Loader2 className="animate-spin w-4 h-4" /></> : "Scrape Page →"}
          </button>
        </form>

        {loading && (
          <div className="w-full max-w-4xl mt-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center h-48 gap-3">
            <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
            <p className="text-white/40 text-xs">Scraping and extracting data...</p>
          </div>
        )}

        {result && !loading && (
          <div className="w-full max-w-4xl mt-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-400" />
                <span className="text-xs text-white/40 truncate max-w-xs">{url}</span>
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
                      <th className="text-left px-5 py-3 text-white/30 uppercase tracking-widest font-medium w-1/3">Key</th>
                      <th className="text-left px-5 py-3 text-white/30 uppercase tracking-widest font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3 text-red-300 font-mono">{row.key}</td>
                        <td className="px-5 py-3 text-white/60 break-all">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {viewMode === "json" && (
              <div className="p-5">
                <pre className="text-white/60 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {!result && !loading && (
          <div className="w-full max-w-4xl mt-6 bg-white/5 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center h-48 gap-3">
            <Code className="w-8 h-8 text-white/10" />
            <p className="text-white/20 text-xs">Scraped data will appear here as a table or JSON</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default WebScraper;