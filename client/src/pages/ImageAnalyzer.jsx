import React, { useState } from "react";
import { Loader2, Upload, Copy, Check, ImageIcon, X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";

const ImageAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
    setResult("");
  };
  const removeImage = () => {
    setFile(null);
    setPreview("");
    setResult("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload an image first");

    try {
      setLoading(true);
      setResult("");

      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post("/api/image/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setResult(data.output);
        toast.success("Image analyzed successfully!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  const onCopyHandler = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
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
              Image Analyzer
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
              Upload any image and Aura-AI will analyze objects, scene details,
              colors and more.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            <form
              onSubmit={onSubmitHandler}
              className="bg-black/30 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
            >
              <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-8 cursor-pointer hover:bg-white/5 transition-colors relative">
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
                      <Loader2 className="animate-spin w-5 h-5" /> Processing...
                    </>
                  ) : (
                    "Analyze Image"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="w-full max-w-3xl mt-12">
            {!result && !loading && (
              <div className="h-[400px] border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-white/40">
                <ImageIcon size={60} strokeWidth={1} className="mb-4" />
                <p>Your AI analysis will appear here</p>
              </div>
            )}

            {loading && (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10" />
              </div>
            )}

            {result && !loading && (
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/20 p-8 backdrop-blur-md">
                <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                  <h3 className="text-lg font-semibold text-orange-400">
                    Analysis Result
                  </h3>
                  <button
                    onClick={onCopyHandler}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                  >
                    {copied ? (
                      <Check size={18} className="text-green-400" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </div>

                <div className="text-white/80 leading-relaxed text-sm md:text-base whitespace-pre-wrap max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {result}
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

export default ImageAnalyzer;
