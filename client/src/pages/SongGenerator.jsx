import React, { useState } from "react";
import { Loader2, Music, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";

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

      const { data } = await axios.post(
        "/api/song/generate",
        { prompt },
        { responseType: "blob" },
      );

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
              Song Generator
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
              Describe a mood or style, and Aura-AI will compose a music clip
              for you instantly.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            <form
              onSubmit={onSubmitHandler}
              className="bg-black/30 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
            >
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A calm lo-fi beat with soft piano and rain sounds..."
                className="w-full bg-transparent outline-none text-white/90 placeholder:text-white/40 resize-none min-h-[60px] text-sm"
              />

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={loading || prompt.length === 0}
                  className="w-full sm:w-auto px-5 py-1.5 rounded-xl font-semibold text-white  
                             bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 
                             border-2 border-white/30 
                             hover:border-white/70 
                             hover:scale-105 
                             active:scale-95 
                             transition-all duration-300 shadow-lg flex items-center justify-center gap-2
                             disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" /> Composing...
                    </>
                  ) : (
                    "Generate Music"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="w-full max-w-3xl mt-12">
            {!audioUrl && !loading && (
              <div className="h-[400px] border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-white/40">
                <Music size={50} strokeWidth={1} className="mb-4" />
                <p>Your generated music will appear here</p>
              </div>
            )}

            {loading && (
              <div className="h-[200px] flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin w-10 h-10" />
                <p className="text-white/70 text-sm">
                  Composing your music, this may take 20–30 seconds...
                </p>
              </div>
            )}

            {audioUrl && !loading && (
              <div className="bg-black/30 border border-white/20 rounded-2xl overflow-hidden p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-orange-400" />
                    <span className="truncate">{prompt}</span>
                  </span>
                  <button
                    onClick={onDownloadHandler}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-sm flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
                <audio controls src={audioUrl} className="w-full" />
              </div>
            )}
          </div>
        </section>

        <FooterForFeature />
      </div>
    </div>
  );
};

export default SongGenerator;
