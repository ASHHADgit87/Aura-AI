import React, { useState } from "react";
import { Loader2, Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import DashboardLayout from "../components/DashboardLayout";

const GrammarFixer = () => {
  const [inputText, setInputText] = useState("");
  const [matches, setMatches] = useState([]);
  const [fixedText, setFixedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checked, setChecked] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return toast.error("Please enter some text first");
    try {
      setLoading(true);
      setMatches([]);
      setFixedText("");
      setChecked(false);
      const { data } = await axios.post("/api/grammar/check", { text: inputText });
      setMatches(data.matches || []);
      setFixedText(data.fixedText || inputText);
      setChecked(true);
      if (data.matches.length === 0) toast.success("No grammar issues found!");
      else toast.success(`Found ${data.matches.length} issue(s)`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Grammar check failed");
    } finally {
      setLoading(false);
    }
  };

  const onCopyHandler = () => {
    navigator.clipboard.writeText(fixedText);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const onResetHandler = () => { setInputText(""); setMatches([]); setFixedText(""); setChecked(false); };
  const applyAllFixes = () => { setInputText(fixedText); setMatches([]); setChecked(false); toast.success("All fixes applied!"); };

  return (
    <DashboardLayout>
      <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
        <div className="w-full max-w-4xl mt-10 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, #FF7A18, #E10600)" }}>✍️</div>
            <h1 className="text-2xl font-semibold" style={{ color: "#F5F5F7" }}>Grammar Fixer</h1>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Paste your text and AI will find and fix grammar, spelling and punctuation errors.</p>
        </div>

        <form onSubmit={onSubmitHandler} className="w-full max-w-4xl flex flex-col gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all backdrop-blur-lg"
            onFocus={(e) => e.currentTarget.style.borderColor = "rgba(255,122,24,0.4)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Your Text</p>
              {inputText && (
                <button type="button" onClick={onResetHandler} className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/15 rounded-lg text-xs transition-all">
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            <textarea value={inputText} onChange={(e) => { setInputText(e.target.value); setChecked(false); setMatches([]); }}
              rows={7} placeholder="Paste or type your text here to check for grammar mistakes..."
              className="bg-transparent outline-none text-white/90 placeholder:text-white/20 resize-none w-full text-sm" />
            <p className="text-xs mt-2 text-right" style={{ color: "rgba(255,255,255,0.2)" }}>
              {inputText.length} chars · {inputText.trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
          <button type="submit" disabled={loading || !inputText.trim()}
            className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{ background: "linear-gradient(to right, #FF7A18, #E10600, #FF4DA6)", boxShadow: "0 0 35px rgba(255,122,24,0.4)" }}>
            {loading ? <><span>Checking</span><Loader2 className="animate-spin w-4 h-4" /></> : "Check Grammar →"}
          </button>
        </form>

        {checked && (
          <div className="w-full max-w-4xl mt-6 flex flex-col gap-4">
            <div className={`flex items-center justify-between px-5 py-3 rounded-xl border ${matches.length === 0 ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{matches.length === 0 ? "✅" : "⚠️"}</span>
                <p className="text-sm font-medium">{matches.length === 0 ? "No issues found — your text looks great!" : `${matches.length} issue${matches.length > 1 ? "s" : ""} found`}</p>
              </div>
              {matches.length > 0 && (
                <button onClick={applyAllFixes}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110"
                  style={{ background: "linear-gradient(to right, #FF7A18, #E10600)" }}>
                  Apply All Fixes
                </button>
              )}
            </div>

            {matches.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Issues Detected</p>
                {matches.map((match, index) => (
                  <div key={index} className="bg-white/5 border border-red-500/20 rounded-xl px-5 py-4 flex flex-col gap-2 backdrop-blur-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-red-400 text-xs font-medium mb-1">{match.rule?.description || "Grammar Issue"}</p>
                        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{match.message}</p>
                      </div>
                      <span className="text-xs shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>#{index + 1}</span>
                    </div>
                    {match.context?.text && (
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-red-300 text-xs line-through">
                          {match.context.text.slice(match.context.offset, match.context.offset + match.context.length)}
                        </span>
                        {match.replacements?.length > 0 && (
                          <><span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>→</span>
                            <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-green-300 text-xs">{match.replacements[0].value}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {fixedText && matches.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-lg">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Fixed Text</p>
                  <button onClick={onCopyHandler} className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/15 rounded-lg text-xs transition-all">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.7)" }}>{fixedText}</p>
              </div>
            )}
          </div>
        )}

        {!checked && !loading && (
          <div className="w-full max-w-4xl mt-6 bg-white/5 border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center h-48 gap-3">
            <span className="text-4xl">✍️</span>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Grammar issues and fixes will appear here</p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default GrammarFixer;