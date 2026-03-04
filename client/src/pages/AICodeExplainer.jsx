import { useState } from "react";
import { Loader2, RotateCcw, Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../configs/axios";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";

const AICodeExplainer = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!code.trim()) return toast.error("Please enter your code snippet");

    try {
      setLoading(true);
      setExplanation("");

      const { data } = await api.post("/api/features/code-explainer", {
        code,
        language,
      });

      if (data.success) {
        setExplanation(data.explanation);
        toast.success("Code explanation generated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode("");
    setLanguage("");
    setExplanation("");
  };

  const onCopyHandler = async () => {
    try {
      await navigator.clipboard.writeText(explanation);
      toast.success("Explanation copied to clipboard");
    } catch {
      toast.error("Failed to copy explanation");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      explanation ? handleReset() : onSubmitHandler(e);
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
              AI Code Explainer
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
              Paste your code snippet, specify the language (optional), and
              Aura-AI will explain it in simple terms.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            <form
              onSubmit={
                explanation ? (e) => e.preventDefault() : onSubmitHandler
              }
              className="bg-black/30 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
            >
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste your code here..."
                readOnly={!!explanation}
                className="w-full bg-transparent outline-none text-sm placeholder:text-white/40 resize-none min-h-[120px] font-mono"
              />
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Programming language (optional)"
                readOnly={!!explanation}
                className="w-full mt-4 bg-transparent outline-none text-sm placeholder:text-white/40 border-b border-white/30 pb-1"
              />
              <div className="flex justify-end mt-6">
                {explanation ? (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-1.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 border-2 border-white/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" /> Reset
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !code.trim()}
                    className="w-full sm:w-auto px-5 py-1.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 border-2 border-white/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />{" "}
                        Processing...
                      </>
                    ) : (
                      "Explain Code"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="w-full max-w-3xl mt-12">
            {!explanation && !loading && (
              <div className="h-[200px] border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-white/40 text-center">
                <p>Your code explanation will appear here</p>
              </div>
            )}
            {loading && (
              <div className="h-[200px] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-white" />
              </div>
            )}
            {explanation && !loading && (
              <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-black/20 p-6">
                <pre className="text-sm whitespace-pre-wrap break-words text-white leading-relaxed">
                  {explanation}
                </pre>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={onCopyHandler}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold transition-all"
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

export default AICodeExplainer;
