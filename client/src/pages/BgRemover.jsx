import React, { useState } from "react";
import { Loader2, Upload, Download, ImageIcon, X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";

const BgRemover = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      e.target.value = null;
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB");
      e.target.value = null;
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResultUrl("");
  };

  const removeImage = () => {
    setFile(null);
    setPreview("");
    setResultUrl("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload an image first");

    try {
      setLoading(true);
      setResultUrl("");

      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post("/api/bg/remove", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

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
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <section
          className="flex flex-col items-center text-white pb-20 px-6 flex-1"
          style={{ background: "linear-gradient(180deg, #FF7A18 0%, #E10600 60%)" }}
        >
          <div className="w-full max-w-4xl mt-10 mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Background Remover</h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
              Upload any image and Aura-AI will remove the background instantly.
            </p>
          </div>

          {/* Upload Form */}
          <div className="w-full max-w-3xl">
            <form
              onSubmit={onSubmitHandler}
              className="bg-black/30 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
            >
              <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-8 cursor-pointer hover:bg-white/5 transition-colors relative">
                <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                
                {preview ? (
                  <div className="relative w-full flex justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 object-contain rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full hover:bg-red-600 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-white/40 mb-3" />
                    <span className="text-white/40 text-sm">
                      Click to upload image (Max 5MB)
                    </span>
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
                      <Loader2 className="animate-spin w-5 h-5" /> Removing Background
                    </>
                  ) : (
                    "Remove Background"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Result Section */}
          <div className="w-full max-w-3xl mt-12">
            {!resultUrl && !loading && (
              <div className="h-[400px] border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-white/40">
                <ImageIcon size={60} strokeWidth={1} className="mb-4" />
                <p>Your processed image will appear here</p>
              </div>
            )}

            {loading && (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10" />
              </div>
            )}

            {resultUrl && !loading && (
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/20 p-8 backdrop-blur-md flex flex-col items-center">
                <img src={resultUrl} alt="Background Removed" className="max-h-[400px] object-contain rounded-xl mb-4" />
                <button
                  onClick={onDownloadHandler}
                  className="px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-white hover:text-black transition-colors"
                >
                  <Download className="inline w-4 h-4 mr-1" /> Download
                </button>
              </div>
            )}
          </div>
        </section>

        <FooterForFeature />
      </div>
    </div>
  );
};

export default BgRemover;