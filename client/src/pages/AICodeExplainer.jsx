import { useState } from "react";
import { Loader2, RotateCcw, Copy, Code, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../configs/axios";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";

const AICodeExplainer = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
      setCopied(true);
      toast.success("Explanation copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
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
              <div className="relative animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="bg-[#1e1e2e]/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative">
                  <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h3 className="font-semibold text-orange-400 flex items-center gap-2">
                      <Code size={20} /> Explanation
                    </h3>
                    <button
                      onClick={onCopyHandler}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check size={18} className="text-green-400" />
                      ) : (
                        <Copy size={18} className="text-white/70" />
                      )}
                    </button>
                  </div>

                  <div className="text-gray-200 font-sans text-[15px] leading-relaxed tracking-wide space-y-4">
                    {explanation.split("\n").map((line, index) => {
                      if (line.trim().startsWith("###")) {
                        return (
                          <h3
                            key={index}
                            className="text-xl font-bold text-white mt-8 mb-2 border-l-4 border-orange-500 pl-4"
                          >
                            {line.replace(/###/g, "").trim()}
                          </h3>
                        );
                      }
                      if (
                        line.trim().startsWith("*") ||
                        line.trim().startsWith("-")
                      ) {
                        return (
                          <div
                            key={index}
                            className="ml-4 text-gray-300 flex gap-3 items-start"
                          >
                            <span className="text-orange-500 mt-1.5 text-[10px]">
                              ●
                            </span>
                            <span>{line.replace(/^[*-]/, "").trim()}</span>
                          </div>
                        );
                      }

                      return (
                        <p key={index} className="mb-2">
                          {line.split("**").map((part, i) =>
                            i % 2 === 1 ? (
                              <strong
                                key={i}
                                className="text-white font-semibold"
                              >
                                {part}
                              </strong>
                            ) : (
                              part
                            ),
                          )}
                        </p>
                      );
                    })}
                  </div>
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
