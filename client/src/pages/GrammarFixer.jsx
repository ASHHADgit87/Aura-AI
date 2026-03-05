import React, { useState } from "react";
import { Loader2, Copy, Check, RotateCcw, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";
import api from "../configs/axios";

const GrammarFixer = () => {
  const [inputText, setInputText] = useState("");
  const [matches, setMatches] = useState([]);
  const [fixedText, setFixedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && inputText.trim()) {
        onSubmitHandler(e);
      }
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return toast.error("Please enter some text first");
    try {
      setLoading(true);
      setMatches([]);
      setFixedText("");
      setChecked(false);
      const { data } = await api.post("/api/features/grammer-fix", {
        text: inputText,
      });
      setMatches(data.matches || []);
      setFixedText(data.fixedText || inputText);
      setChecked(true);
      if ((data.matches || []).length === 0)
        toast.success("No grammar issues found!");
      else toast.success(`Found ${data.matches.length} issue(s)`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Grammar check failed");
    } finally {
      setLoading(false);
    }
  };

  const onCopyHandler = () => {
    if (!fixedText) return;
    navigator.clipboard.writeText(fixedText);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const onResetHandler = () => {
    setInputText("");
    setMatches([]);
    setFixedText("");
    setChecked(false);
  };

  const applyAllFixes = () => {
    setInputText(fixedText);
    setMatches([]);
    setChecked(false);
    toast.success("All fixes applied!");
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
              Grammar Fixer
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
              Paste your text and Aura AI will find and fix grammar, spelling
              and punctuation errors.
            </p>
          </div>

          <div className="w-full max-w-3xl">
            <form
              onSubmit={onSubmitHandler}
              className="bg-black/30 border border-white/20 rounded-2xl p-6 backdrop-blur-xl flex flex-col gap-4"
            >
              <div
                className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all backdrop-blur-lg"
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,122,24,0.4)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Your Text
                  </p>
                  {inputText && (
                    <button
                      type="button"
                      onClick={onResetHandler}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/15 rounded-lg text-xs transition-all"
                    >
                      <RotateCcw className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setChecked(false);
                    setMatches([]);
                  }}
                  onKeyDown={handleKeyDown}
                  rows={7}
                  placeholder="Paste or type your text here to check for grammar mistakes..."
                  className="bg-transparent outline-none text-white/90 placeholder:text-white/40 resize-none w-full text-sm"
                />
                <p className="text-xs mt-2 text-right text-white/30">
                  {inputText.length} chars ·{" "}
                  {inputText.trim().split(/\s+/).filter(Boolean).length} words
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="w-full sm:w-auto px-5 py-1.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 border-2 border-white/30 hover:border-white/70 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" /> Checking...
                    </>
                  ) : (
                    "Check Grammar"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="w-full max-w-3xl mt-12">
            {!checked && !loading && (
              <div className="h-[400px] border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-white/40">
                <FileText size={60} strokeWidth={1} className="mb-4" />
                <p>Grammar issues and fixes will appear here</p>
              </div>
            )}

            {loading && (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10" />
              </div>
            )}

            {checked && !loading && (
              <div className="relative animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="bg-[#1e1e2e]/90 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                    <h3 className="font-semibold text-orange-400 flex items-center gap-2">
                      <FileText size={20} /> Grammar Summary
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

                  {matches.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {matches.map((match, index) => (
                        <div
                          key={index}
                          className="bg-white/5 border border-red-500/20 rounded-xl px-5 py-4 flex flex-col gap-2 backdrop-blur-lg"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-red-400 text-xs font-medium mb-1">
                                {match.rule?.description || "Grammar Issue"}
                              </p>
                              <p className="text-xs leading-relaxed text-white/70">
                                {match.message}
                              </p>
                            </div>
                            <span className="text-xs shrink-0 text-white/30">
                              #{index + 1}
                            </span>
                          </div>
                          {match.context?.text && (
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-red-300 text-xs line-through">
                                {match.context.text.slice(
                                  match.context.offset,
                                  match.context.offset + match.context.length,
                                )}
                              </span>
                              {match.replacements?.length > 0 && (
                                <>
                                  <span className="text-xs text-white/30">
                                    →
                                  </span>
                                  <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-green-300 text-xs">
                                    {match.replacements[0].value}
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {matches.length > 0 && (
                    <div className="flex justify-end">
                      <button
                        onClick={applyAllFixes}
                        className="px-5 py-1.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 border-2 border-white/30 hover:border-white/70 hover:scale-105 active:scale-95 transition-all duration-300"
                      >
                        Apply All Fixes
                      </button>
                    </div>
                  )}
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

export default GrammarFixer;
