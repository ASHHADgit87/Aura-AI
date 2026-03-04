import React, { useState } from "react";
import {
  Loader2,
  Upload,
  Copy,
  Check,
  FileText,
  X,
  MessageSquareQuote,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";
import api from "../configs/axios";

const PdfSummarizer = () => {
  const [file, setFile] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (selected.type !== "application/pdf")
      return toast.error("PDF files only");
    if (selected.size > 10 * 1024 * 1024)
      return toast.error("Max 10MB allowed");
    setFile(selected);
    setSummary("");
  };

  const removeFile = () => setFile(null);

  const handleReset = () => {
    setFile(null);
    setUserPrompt("");
    setSummary("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload a PDF file first");

    try {
      setLoading(true);
      setSummary("");

      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("prompt", userPrompt);

      const { data } = await api.post(
        "/api/features/pdf-summarizer",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (data.success) {
        setSummary(data.summary);
        toast.success("Summary generated!");
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
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      summary ? handleReset() : onSubmitHandler(e);
    }
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
            <p className="text-white/90 text-sm max-w-lg mx-auto">
              Upload a PDF and give custom instructions Aura AI will get the
              exact insights you need.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            <form
              onSubmit={summary ? (e) => e.preventDefault() : onSubmitHandler}
              className="bg-black/30 border border-white/20 rounded-2xl p-6 backdrop-blur-xl space-y-4"
            >
              <label className="w-full flex items-center justify-between bg-white/5 border border-white/20 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={onFileChange}
                  className="hidden"
                />
                {file ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-orange-400 font-medium truncate">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-white/50 hover:text-red-500"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-white/70">
                      Select PDF document...
                    </span>
                    <Upload size={18} className="text-white/40" />
                  </>
                )}
              </label>

              <div className="relative">
                <div className="absolute top-3 left-3 text-white/40">
                  <MessageSquareQuote size={18} />
                </div>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Optional: How should I summarize this? (e.g. 'Use bullet points', 'Focus on dates')"
                  onKeyDown={handleKeyDown}
                  readOnly={!!summary}
                  className="w-full bg-transparent border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500 min-h-[100px] transition-all resize-none"
                />
              </div>

              <div className="flex justify-end mt-4 gap-3">
                {summary ? (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-1.5 rounded-xl font-semibold text-white   
                    bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 
                    border-2 border-white/30 hover:border-white/70 
                    hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" /> Reset
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="w-full sm:w-auto px-5 py-1.5 rounded-xl font-semibold text-white   
                    bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 
                    border-2 border-white/30 hover:border-white/70 
                    hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center gap-2
                    disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />{" "}
                        Processing...
                      </>
                    ) : (
                      "Generate Summary"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="w-full max-w-3xl mt-12">
            {!summary && !loading && (
              <div className="h-[300px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/30">
                <FileText size={50} strokeWidth={1} className="mb-2" />
                <p>Summary Will Appear Here</p>
              </div>
            )}

            {loading && (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-white" />
              </div>
            )}

            {summary && !loading && (
              <div className="relative animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="bg-[#1e1e2e]/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl relative">
                  <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h3 className="font-semibold text-orange-400 flex items-center gap-2">
                      <FileText size={20} /> Summary
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
                    {summary.split("\n").map((line, index) => {
                      if (line.trim().startsWith("###")) {
                        return (
                          <h3
                            key={index}
                            className="text-xl font-bold text-white mt-8 mb-2 border-l-4 border-orange-500 pl-4"
                          >
                            {line.replace(/###/g, "").trim()}
                          </h3>
                        );
                      }

                      if (
                        line.trim().startsWith("*") ||
                        line.trim().startsWith("-")
                      ) {
                        return (
                          <div
                            key={index}
                            className="ml-4 text-gray-300 flex gap-3 items-start"
                          >
                            <span className="text-orange-500 mt-1.5 text-[10px]">
                              ●
                            </span>
                            <span>{line.replace(/^[*-]/, "").trim()}</span>
                          </div>
                        );
                      }

                      return (
                        <p key={index} className="mb-2">
                          {line.split("**").map((part, i) =>
                            i % 2 === 1 ? (
                              <strong
                                key={i}
                                className="text-white font-semibold"
                              >
                                {part}
                              </strong>
                            ) : (
                              part
                            ),
                          )}
                        </p>
                      );
                    })}
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

export default PdfSummarizer;
