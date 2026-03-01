import React, { useState } from "react";
import { Loader2, Download, ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return toast.error("Please enter a prompt");
    try {
      setLoading(true);
      setImageUrl("");
      const encodedPrompt = encodeURIComponent(prompt);
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&nologo=true`;
      setImageUrl(url);
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onDownloadHandler = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `aura-ai-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
        <div className="w-full max-w-3xl mt-10 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, #FF7A18, #E10600)" }}>🎨</div>
            <h1 className="text-2xl font-semibold" style={{ color: "#F5F5F7" }}>Image Generator</h1>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Describe anything and AI will generate it for you instantly.</p>
        </div>

        <form onSubmit={onSubmitHandler}
          className="bg-white/5 border border-white/10 rounded-xl p-4 w-full max-w-3xl transition-all backdrop-blur-lg"
          onFocus={(e) => e.currentTarget.style.borderColor = "rgba(255,122,24,0.4)"}
          onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
        >
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }}
            rows={3} placeholder="A futuristic city at night with neon lights and flying cars..."
            className="bg-transparent outline-none text-white/90 placeholder:text-white/20 resize-none w-full text-sm" />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>{prompt.length} chars</span>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110"
              style={{ background: "linear-gradient(to right, #FF7A18, #E10600, #FF4DA6)", boxShadow: "0 0 35px rgba(255,122,24,0.4)" }}>
              {loading ? <><span>Generating</span><Loader2 className="animate-spin w-4 h-4" /></> : "Generate →"}
            </button>
          </div>
        </form>

        <div className="w-full max-w-3xl mt-6">
          {!imageUrl && !loading && (
            <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center h-80 gap-3">
              <ImageIcon className="w-10 h-10 text-white/10" />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Your generated image will appear here</p>
            </div>
          )}
          {loading && (
            <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center h-80 gap-3">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#FF7A18" }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Generating your image...</p>
            </div>
          )}
          {imageUrl && !loading && (
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <img src={imageUrl} alt={prompt} className="w-full object-cover rounded-2xl"
                onError={() => { toast.error("Failed to load image. Try a different prompt."); setImageUrl(""); }} />
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                <p className="text-xs truncate max-w-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{prompt}</p>
                <button onClick={onDownloadHandler}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-xs font-medium transition-all">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default ImageGenerator;