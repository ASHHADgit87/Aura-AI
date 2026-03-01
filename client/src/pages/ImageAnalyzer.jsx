import React, { useState } from "react";
import { Loader2, Upload, Copy, Check, ScanSearch } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import DashboardLayout from "../components/DashboardLayout";

const ImageAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) return toast.error("Please upload an image file");
    if (selected.size > 5 * 1024 * 1024) return toast.error("Image size must be under 5MB");
    setFile(selected);
    setResult(null);
    setPreview(URL.createObjectURL(selected));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload an image first");
    try {
      setLoading(true);
      setResult(null);
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post("/api/image/analyze", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(data);
      toast.success("Image analyzed!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  const onCopyHandler = () => {
    navigator.clipboard.writeText(result?.output || JSON.stringify(result, null, 2));
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
        <div className="w-full max-w-3xl mt-10 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, #FF7A18, #E10600)" }}>🔍</div>
            <h1 className="text-2xl font-semibold" style={{ color: "#F5F5F7" }}>Image Analyzer</h1>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Upload any image and AI will analyze objects, scene, colors and more.</p>
        </div>

        <form onSubmit={onSubmitHandler} className="w-full max-w-3xl flex flex-col gap-4">
          <label className="bg-white/5 border border-white/10 border-dashed rounded-xl cursor-pointer transition-all group overflow-hidden backdrop-blur-lg"
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,122,24,0.4)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
          >
            <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            {preview ? (
              <img src={preview} alt="preview" className="w-full max-h-72 object-contain rounded-xl" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <Upload className="w-8 h-8 text-white/20 group-hover:text-[#FF7A18] transition-colors" />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Click to upload an image</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>JPG, PNG, WEBP — Max 5MB</p>
              </div>
            )}
          </label>
          <button type="submit" disabled={loading || !file}
            className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{ background: "linear-gradient(to right, #FF7A18, #E10600, #FF4DA6)", boxShadow: "0 0 35px rgba(255,122,24,0.4)" }}>
            {loading ? <><span>Analyzing</span><Loader2 className="animate-spin w-4 h-4" /></> : "Analyze Image →"}
          </button>
        </form>

        {result && (
          <div className="w-full max-w-3xl mt-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-lg">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ScanSearch className="w-4 h-4" style={{ color: "#FF7A18" }} />
                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>Analysis Result</span>
              </div>
              <button onClick={onCopyHandler} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs transition-all">
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="px-5 py-4">
              {result.output && <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>{result.output}</p>}
              {result.tags && result.tags.length > 0 && (
                <div>
                  <p className="text-xs mb-2 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Detected Labels</p>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 rounded-full text-xs"
                        style={{ background: "rgba(255,122,24,0.1)", border: "1px solid rgba(255,122,24,0.25)", color: "#FF7A18" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="w-full max-w-3xl mt-6 bg-white/5 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center h-48 gap-3">
            <ScanSearch className="w-8 h-8 text-white/10" />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Analysis results will appear here</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default ImageAnalyzer;