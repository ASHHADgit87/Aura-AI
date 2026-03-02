import  { useState } from "react";
import { Loader2, Download, ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
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

      // Express backend endpoint
      const { data } = await axios.post("/api/image/generate", {
        prompt,
      });

      if (data.success) {
        setImageUrl(data.imageUrl);
        toast.success("Image generated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const onDownloadHandler = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `aura-ai-${Date.now()}.jpg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      

      {/* Right Side Content */}
      <div className="flex flex-col flex-1">
        
        {/* Main Content */}
        <section
          className="flex flex-col items-center text-white pb-20 px-6 flex-1"
          style={{
            background:
              "linear-gradient(180deg, #FF7A18 0%, #E10600 60%)",
          }}
        >
          <div className="w-full max-w-4xl mt-10 mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Image Generator
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
              Unleash your creativity. Describe your vision and Aura-AI will bring it to life instantly.
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
  placeholder="Describe what Image you want..."
  className="w-full bg-transparent outline-none text-sm placeholder:text-white/40 resize-none min-h-[60px]" 
/>

              <div className="flex justify-end mt-6">
                <button
  type="submit"
  disabled={loading}
  className="w-full sm:w-auto px-5 py-1.5 rounded-xl font-semibold text-white  
             bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 
             border-2 border-white/30 
             hover:border-white/70 
             hover:scale-105 
             active:scale-95 
             transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
>
  {loading ? (
    <>
      <Loader2 className="animate-spin w-5 h-5" /> Processing
    </>
  ) : (
    "Generate Image"
  )}
</button>
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
                <Loader2 className="animate-spin w-10 h-10" />
              </div>
            )}

            {imageUrl && !loading && (
              <div className="relative overflow-hidden rounded-3xl border border-white/20">
                <img
                  src={imageUrl}
                  alt="Generated"
                  className="w-full object-cover"
                />
                <div className="absolute bottom-6 right-6">
                  <button
                    onClick={onDownloadHandler}
                    className="px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-white hover:text-black transition-colors"
                  >
                    Download
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