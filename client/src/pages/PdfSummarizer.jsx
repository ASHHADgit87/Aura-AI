import React, { useState } from "react";
import { Loader2, Upload, Copy, Check, FileText, X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";

const PdfSummarizer = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== "application/pdf")
      return toast.error("Please upload a PDF file only");

    if (selected.size > 10 * 1024 * 1024)
      return toast.error("File size must be under 10MB");

    setFile(selected);
    setSummary("");
  };

  const removeFile = () => {
    setFile(null);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload a PDF file first");

    try {
      setLoading(true);
      setSummary("");

      const formData = new FormData();
      formData.append("pdf", file);

      const { data } = await axios.post("/api/pdf/summarize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setSummary(data.summary);
        toast.success("Summary generated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to summarize PDF");
    } finally {
      setLoading(false);
    }
  };

  const onCopyHandler = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success("Copied to clipboard!");
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
              PDF Summarizer
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
              Upload any PDF and get a clear AI-powered summary in seconds With
              Aura AI. Save time and get the core insights instantly.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            <form
              onSubmit={onSubmitHandler}
              className="bg-black/30 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
            >
              <label className="w-full flex items-center justify-between bg-transparent border border-white/20 rounded-lg px-4 py-2 cursor-pointer hover:bg-white/5 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={onFileChange}
                  className="hidden"
                />

                {file ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-orange-400 truncate">
                      {file.name}
                    </span>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="ml-3 text-white/50 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-white/70 truncate">
                      Upload PDF file...
                    </span>
                    <span className="text-white/40 text-sm">Browse</span>
                  </>
                )}
              </label>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="w-full sm:w-auto px-5 py-1.5 rounded-xl font-semibold text-white  
                             bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 
                             border-2 border-white/30 
                             hover:border-white/70 
                             hover:scale-105 
                             active:scale-95 
                             transition-all duration-300 shadow-lg flex items-center justify-center gap-2
                             disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" /> Processing...
                    </>
                  ) : (
                    "Summarize PDF"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="w-full max-w-3xl mt-12">
            {!summary && !loading && (
              <div className="h-[400px] border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-white/40">
                <FileText size={60} strokeWidth={1} className="mb-4" />
                <p>Your AI summary will appear here</p>
              </div>
            )}

            {loading && (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10" />
              </div>
            )}

            {summary && !loading && (
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/20 p-8 backdrop-blur-md">
                <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                  <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                    <FileText size={18} /> Summary Result
                  </h3>
                  <button
                    onClick={onCopyHandler}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check size={18} className="text-green-400" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </div>

                <div className="text-white/80 leading-relaxed text-sm md:text-base whitespace-pre-wrap max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {summary}
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

export default PdfSummarizer;
