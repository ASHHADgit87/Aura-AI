import React, { useState } from "react";
import { Loader2, Upload, Download, Scissors } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import DashboardLayout from "../components/DashboardLayout";

const BgRemover = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) return toast.error("Please upload an image file");
    if (selected.size > 5 * 1024 * 1024) return toast.error("Image size must be under 5MB");
    setFile(selected);
    setResultUrl("");
    setPreview(URL.createObjectURL(selected));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload an image first");
    try {
      setLoading(true);
      setResultUrl("");
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post("/api/bg/remove", formData, { headers: { "Content-Type": "multipart/form-data" }, responseType: "blob" });
      const url = URL.createObjectURL(new Blob([data], { type: "image/png" }));
      setResultUrl(url);
      toast.success("Background removed!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove background");
    } finally {
      setLoading(false);
    }
  };

  const onDownloadHandler = () => {
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `aura-ai-nobg-${Date.now()}.png`;
    a.click();
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
        <div className="w-full max-w-4xl mt-10 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-lg">✂️</div>
            <h1 className="text-2xl font-semibold">Background Remover</h1>
          </div>
          <p className="text-white/40 text-xs">Upload any image and AI will remove the background instantly.</p>
        </div>

        <form onSubmit={onSubmitHandler} className="w-full max-w-4xl flex flex-col gap-4">
          <label className="bg-white/5 border border-white/10 border-dashed hover:border-orange-500/50 rounded-xl cursor-pointer transition-all group overflow-hidden">
            <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            {preview ? (
              <img src={preview} alt="preview" className="w-full max-h-64 object-contain rounded-xl" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <Upload className="w-8 h-8 text-white/20 group-hover:text-orange-400 transition-colors" />
                <p className="text-white/40 text-sm">Click to upload an image</p>
                <p className="text-white/20 text-xs">JPG, PNG, WEBP — Max 5MB</p>
              </div>
            )}
          </label>
          <button type="submit" disabled={loading || !file}
            className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <><span>Removing Background</span><Loader2 className="animate-spin w-4 h-4" /></> : "Remove Background →"}
          </button>
        </form>

        {resultUrl && !loading && (
          <div className="w-full max-w-4xl mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <p className="text-white/30 text-xs px-4 py-2.5 border-b border-white/10 uppercase tracking-widest">Original</p>
              <div className="p-3"><img src={preview} alt="original" className="w-full object-contain rounded-xl max-h-64" /></div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                <p className="text-white/30 text-xs uppercase tracking-widest">Background Removed</p>
                <button onClick={onDownloadHandler} className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/15 rounded-lg text-xs transition-all">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
              <div className="p-3" style={{ backgroundImage: "linear-gradient(45deg, #1a1a2e 25%, transparent 25%), linear-gradient(-45deg, #1a1a2e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a2e 75%), linear-gradient(-45deg, transparent 75%, #1a1a2e 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px" }}>
                <img src={resultUrl} alt="result" className="w-full object-contain rounded-xl max-h-64" />
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full max-w-4xl mt-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center h-48 gap-3">
            <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
            <p className="text-white/40 text-xs">Removing background...</p>
          </div>
        )}

        {!preview && !loading && (
          <div className="w-full max-w-4xl mt-6 bg-white/5 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center h-48 gap-3">
            <Scissors className="w-8 h-8 text-white/10" />
            <p className="text-white/20 text-xs">Original and result will appear here side by side</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default BgRemover;