import React, { useState } from "react";
import {
  Loader2,
  Upload,
  Download,
  ImageIcon,
  X,
  RotateCcw,
  Copy,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";
import api from "../configs/axios";

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
    if (e) e.preventDefault();
    if (!file) return toast.error("Please upload an image first");

    try {
      setLoading(true);
      setResultUrl("");

      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/api/features/remove-bg", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setResultUrl(data.image);
        toast.success("Background removed!");
      }
    } catch (error) {
      toast.error("Failed to remove background");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview("");
    setResultUrl("");
  };

  const onDownloadHandler = () => {
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `aura-ai-nobg-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const onCopyHandler = async () => {
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      toast.success("Image copied to clipboard");
    } catch {
      toast.error("Failed to copy image");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <section
          className="flex flex-col items-center text-white pb-20 px-4 sm:px-6 flex-1"
          style={{
            background: "linear-gradient(180deg, #FF7A18 0%, #E10600 60%)",
          }}
        >
          <div className="w-full max-w-4xl mt-10 mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Background Remover
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
              Upload any image and Aura-AI will remove the background instantly.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            <form
              onSubmit={onSubmitHandler}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (resultUrl) {
                    handleReset();
                  } else if (file && !loading) {
                    onSubmitHandler(e);
                  }
                }
              }}
              className="bg-black/30 border border-white/20 rounded-2xl p-5 sm:p-6 backdrop-blur-xl"
            >
              <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-6 cursor-pointer hover:bg-white/5 transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />

                {preview ? (
                  <div className="relative w-full flex justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-56 sm:max-h-64 object-contain rounded-xl"
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

              <div className="flex justify-end mt-4">
                {resultUrl ? (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-1.5 text-sm rounded-lg font-semibold text-white
                    bg-gradient-to-r from-orange-500 via-red-600 to-pink-500
                    border border-white/30 hover:border-white/70
                    hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="px-4 py-1.5 text-sm rounded-lg font-semibold text-white
                    bg-gradient-to-r from-orange-500 via-red-600 to-pink-500
                    border border-white/30 hover:border-white/70
                    hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center gap-2
                    disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Removing...
                      </>
                    ) : (
                      "Remove Background"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="w-full max-w-3xl mt-12">
            {!resultUrl && !loading && (
              <div className="h-[260px] sm:h-[300px] border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-white/40">
                <ImageIcon size={60} strokeWidth={1} className="mb-4" />
                <p>Your processed image will appear here</p>
              </div>
            )}

            {loading && (
              <div className="h-[260px] sm:h-[300px] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-white" />
              </div>
            )}

            {resultUrl && !loading && (
              <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-black/40 p-6 flex flex-col items-center">
                <div className="w-full flex justify-center items-center min-h-[350px] bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-white/10 rounded-2xl border border-white/10 overflow-hidden">
                  <img
                    src={resultUrl}
                    alt="Background Removed"
                    className="w-full h-auto block min-h-[200px]"
                    onError={(e) => {
                      e.target.style.display = "none";
                      toast.error("The processed image data is invalid.");
                    }}
                  />
                </div>

                <div className="absolute bottom-6 right-6 flex gap-4 mt-6">
                  <button
                    onClick={onDownloadHandler}
                    className="flex items-center gap-2 px-2 py-1 text-sm bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 border border-white/30 hover:border-white/70 hover:scale-105 active:scale-95 rounded-full font-bold transition-all duration-300 shadow-lg"
                  >
                    <Download size={18} /> Download
                  </button>
                  <button
                    onClick={onCopyHandler}
                    className="flex items-center gap-2 px-2 py-1 text-sm bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 border border-white/30 hover:border-white/70 hover:scale-105 active:scale-95 rounded-full font-bold transition-all duration-300 shadow-lg"
                  >
                    <Copy size={18} /> Copy
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

export default BgRemover;
