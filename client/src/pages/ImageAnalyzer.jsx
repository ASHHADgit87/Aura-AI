import React, { useState } from "react";
import {
  Loader2,
  Upload,
  Copy,
  Check,
  ImageIcon,
  X,
  MessageSquareQuote,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";
import api from "../configs/axios";

const ImageAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/"))
      return toast.error("Please upload an image file");
    if (selected.size > 5 * 1024 * 1024)
      return toast.error("Image size must be under 5MB");

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult("");
  };

  const removeFile = () => {
    setFile(null);
    setPreview("");
    setResult("");
    setUserPrompt("");
  };

  const handleReset = () => removeFile();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please upload an image first");

    try {
      setLoading(true);
      setResult("");

      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompt", userPrompt);

      const { data } = await api.post(
        "/api/features/image-analyzer",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      result ? handleReset() : onSubmitHandler(e);
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
              Image Analyzer
            </h1>
            <p className="text-white/90 text-sm max-w-lg mx-auto">
              Upload any image and give custom instructions, Aura AI will
              analyze objects, scenes, or details.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            <form
              onSubmit={result ? (e) => e.preventDefault() : onSubmitHandler}
              className="bg-black/30 border border-white/20 rounded-2xl p-6 backdrop-blur-xl space-y-4"
            >
              <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-6 cursor-pointer hover:bg-white/5 transition-all relative">
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
                      className="max-h-64 object-contain rounded-xl shadow-2xl"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full hover:bg-red-600 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Upload className="w-10 h-10 text-white/40 mx-auto mb-2" />
                    <span className="text-white/40 text-sm">
                      Click to upload image (Max 5MB)
                    </span>
                  </div>
                )}
              </label>

              <div className="relative">
                <div className="absolute top-3 left-3 text-white/40">
                  <MessageSquareQuote size={18} />
                </div>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Optional: Ask something specific (e.g. 'Identify the text', 'What color is the car?')"
                  onKeyDown={handleKeyDown}
                  readOnly={!!result}
                  className="w-full bg-transparent border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500 min-h-[100px] transition-all resize-none"
                />
              </div>

              <div className="flex justify-end mt-4 gap-3">
                {result ? (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-1.5 rounded-xl font-semibold text-white  
                    bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 
                    border-2 border-white/30 hover:border-white/70 
                    hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" /> Reset
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !file}
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
                      "Analyze Image"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="w-full max-w-3xl mt-12">
            {!result && !loading && (
              <div className="h-[300px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-white/30">
                <ImageIcon size={50} strokeWidth={1} className="mb-2" />
                <p>Waiting for an image to analyze...</p>
              </div>
            )}

            {loading && (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10" />
              </div>
            )}

            {result && !loading && (
              <div className="rounded-3xl border border-white/20 bg-black/40 p-8 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <h3 className="font-semibold text-orange-400 flex items-center gap-2">
                    <ImageIcon size={20} /> AI Analysis
                  </h3>
                  <button
                    onClick={onCopyHandler}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    {copied ? (
                      <Check size={18} className="text-green-400" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </div>
                <div className="text-white/90 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto custom-scrollbar">
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
