import { useState } from "react";
import { Loader2, Download, ImageIcon, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../configs/axios";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";

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

      const { data } = await api.post("/api/features/image-generator", {
        prompt,
      });

      if (data.success) {
        setImageUrl(data.image);
        toast.success("Image generated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setImageUrl("");
  };

  const onDownloadHandler = async () => {
    try {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `aura-ai-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error("Download failed");
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
              Image Generator
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
              Unleash your creativity. Describe your vision and Aura-AI will
              bring it to life instantly.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            <form
              onSubmit={imageUrl ? (e) => e.preventDefault() : onSubmitHandler}
              className="bg-black/30 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
            >
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what Image you want..."
                readOnly={!!imageUrl}
                className="w-full bg-transparent outline-none text-sm placeholder:text-white/40 resize-none min-h-[60px]"
              />

              <div className="flex justify-end mt-6">
                {imageUrl ? (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-1.5 rounded-xl font-semibold text-white   
                    bg-gradient-to-r from-gray-600 to-gray-800 
                    border-2 border-white/30 hover:border-white/70 
                    hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" /> Reset
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
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
                      "Generate Image"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="w-full max-w-3xl mt-12">
            {!imageUrl && !loading && (
              <div className="h-[400px] border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-white/40">
                <ImageIcon size={60} strokeWidth={1} className="mb-4" />
                <p>Your generated image will appear here</p>
              </div>
            )}

            {loading && (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-white" />
              </div>
            )}

            {imageUrl && !loading && (
              <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-black/20">
                <img
                  src={imageUrl}
                  alt="Generated"
                  className="w-full h-auto block min-h-[200px]"
                  onError={() => toast.error("Image data corrupted")}
                />
                <div className="absolute bottom-6 right-6">
                  <button
                    onClick={onDownloadHandler}
                    className="flex items-center gap-2 px-6 py-3 bg-black/80 backdrop-blur-md text-white rounded-full font-bold hover:bg-white hover:text-black transition-all shadow-lg"
                  >
                    <Download size={20} /> Download
                  </button>
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

export default ImageGenerator;
