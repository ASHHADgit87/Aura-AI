import React, { useState } from "react";
import { Loader2, Music, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import DashboardLayout from "../components/DashboardLayout";

const SongGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return toast.error("Please enter a music prompt");
    try {
      setLoading(true);
      setAudioUrl("");
      const { data } = await axios.post("/api/song/generate", { prompt }, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([data], { type: "audio/wav" }));
      setAudioUrl(url);
      toast.success("Music generated!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate music");
    } finally {
      setLoading(false);
    }
  };

  const onDownloadHandler = () => {
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `aura-ai-song-${Date.now()}.wav`;
    a.click();
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
        <div className="w-full max-w-3xl mt-10 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, #FF7A18, #E10600)" }}>🎵</div>
            <h1 className="text-2xl font-semibold" style={{ color: "#F5F5F7" }}>Song Generator</h1>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Describe a mood or style and AI will generate a music clip for you.</p>
        </div>

        <form onSubmit={onSubmitHandler}
          className="bg-white/5 border border-white/10 rounded-xl p-4 w-full max-w-3xl transition-all backdrop-blur-lg"
          onFocus={(e) => e.currentTarget.style.borderColor = "rgba(255,122,24,0.4)"}
          onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
        >
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }}
            rows={3} placeholder="A calm lo-fi beat with soft piano and rain sounds..."
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

        {audioUrl && !loading && (
          <div className="w-full max-w-3xl mt-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-lg">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10">
              <Music className="w-4 h-4" style={{ color: "#FF7A18" }} />
              <span className="text-xs truncate flex-1" style={{ color: "rgba(255,255,255,0.6)" }}>{prompt}</span>
              <button onClick={onDownloadHandler}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs transition-all">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
            <div className="px-5 py-5">
              <audio controls src={audioUrl} className="w-full" />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full max-w-3xl mt-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center h-48 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#FF7A18" }} />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Composing your music, this may take 20–30 seconds...</p>
          </div>
        )}

        {!audioUrl && !loading && (
          <div className="w-full max-w-3xl mt-6 bg-white/5 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center h-48 gap-3">
            <Music className="w-8 h-8 text-white/10" />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Your generated music will appear here</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default SongGenerator;