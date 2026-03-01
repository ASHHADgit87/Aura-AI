import React, { useState } from "react";
import { Loader2, Upload, Copy, Check, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import DashboardLayout from "../components/DashboardLayout";

const PdfSummarizer = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") return toast.error("Please upload a PDF file only");
    if (selected.size > 10 * 1024 * 1024) return toast.error("File size must be under 10MB");
    setFile(selected);
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
      const { data } = await axios.post("/api/pdf/summarize", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setSummary(data.summary);
      toast.success("Summary generated!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to summarize PDF");
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

  const onDownloadHandler = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name?.replace(".pdf", "")}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
        <div className="w-full max-w-3xl mt-10 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, #FF7A18, #E10600)" }}>📄</div>
            <h1 className="text-2xl font-semibold" style={{ color: "#F5F5F7" }}>PDF Summarizer</h1>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Upload any PDF and get a clear AI-powered summary in seconds.</p>
        </div>

        <form onSubmit={onSubmitHandler} className="w-full max-w-3xl flex flex-col gap-4">
          <label className="bg-white/5 border border-white/10 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group backdrop-blur-lg"
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,122,24,0.4)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
          >
            <input type="file" accept="application/pdf" onChange={onFileChange} className="hidden" />
            <Upload className="w-8 h-8 text-white/20 group-hover:text-[#FF7A18] transition-colors" />
            {file ? (
              <div className="flex items-center gap-2" style={{ color: "#FF7A18" }}>
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
            ) : (
              <>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Click to upload or drag & drop your PDF</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Max size: 10MB</p>
              </>
            )}
          </label>
          <button type="submit" disabled={loading || !file}
            className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{ background: "linear-gradient(to right, #FF7A18, #E10600, #FF4DA6)", boxShadow: "0 0 35px rgba(255,122,24,0.4)" }}>
            {loading ? <><span>Summarizing</span><Loader2 className="animate-spin w-4 h-4" /></> : "Summarize PDF →"}
          </button>
        </form>

        {summary && (
          <div className="w-full max-w-3xl mt-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-lg">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" style={{ color: "#FF7A18" }} />
                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>{file?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={onCopyHandler} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs transition-all">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={onDownloadHandler} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs transition-all">
                  Download
                </button>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.7)" }}>{summary}</p>
            </div>
          </div>
        )}

        {!summary && !loading && (
          <div className="w-full max-w-3xl mt-6 bg-white/5 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center h-48 gap-3">
            <FileText className="w-8 h-8 text-white/10" />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Your PDF summary will appear here</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default PdfSummarizer;