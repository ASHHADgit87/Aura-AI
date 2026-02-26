import React, { useState } from "react";
import { Loader2, Copy, Check, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import DashboardLayout from "../components/DashboardLayout";

const languages = [
  { code: "en", name: "English" }, { code: "ar", name: "Arabic" }, { code: "az", name: "Azerbaijani" },
  { code: "bn", name: "Bengali" }, { code: "bs", name: "Bosnian" }, { code: "bg", name: "Bulgarian" },
  { code: "ca", name: "Catalan" }, { code: "zh", name: "Chinese (Simplified)" }, { code: "zt", name: "Chinese (Traditional)" },
  { code: "hr", name: "Croatian" }, { code: "cs", name: "Czech" }, { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" }, { code: "eo", name: "Esperanto" }, { code: "et", name: "Estonian" },
  { code: "fi", name: "Finnish" }, { code: "fr", name: "French" }, { code: "de", name: "German" },
  { code: "el", name: "Greek" }, { code: "gu", name: "Gujarati" }, { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" }, { code: "hu", name: "Hungarian" }, { code: "id", name: "Indonesian" },
  { code: "ga", name: "Irish" }, { code: "it", name: "Italian" }, { code: "ja", name: "Japanese" },
  { code: "kn", name: "Kannada" }, { code: "ko", name: "Korean" }, { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" }, { code: "ms", name: "Malay" }, { code: "ml", name: "Malayalam" },
  { code: "mr", name: "Marathi" }, { code: "nb", name: "Norwegian" }, { code: "fa", name: "Persian" },
  { code: "pl", name: "Polish" }, { code: "pt", name: "Portuguese" }, { code: "pa", name: "Punjabi" },
  { code: "ro", name: "Romanian" }, { code: "ru", name: "Russian" }, { code: "sr", name: "Serbian" },
  { code: "sk", name: "Slovak" }, { code: "sl", name: "Slovenian" }, { code: "es", name: "Spanish" },
  { code: "sw", name: "Swahili" }, { code: "sv", name: "Swedish" }, { code: "tl", name: "Tagalog" },
  { code: "ta", name: "Tamil" }, { code: "te", name: "Telugu" }, { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" }, { code: "uk", name: "Ukrainian" }, { code: "ur", name: "Urdu" },
  { code: "vi", name: "Vietnamese" },
];

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ar");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return toast.error("Please enter text to translate");
    if (sourceLang === targetLang) return toast.error("Source and target language cannot be the same");
    try {
      setLoading(true);
      setTranslatedText("");
      const { data } = await axios.post("/api/translate", { text: inputText, source: sourceLang, target: targetLang });
      setTranslatedText(data.translatedText);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Translation failed");
    } finally {
      setLoading(false);
    }
  };

  const onCopyHandler = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const onSwapHandler = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
        <div className="w-full max-w-4xl mt-10 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-lg">🌍</div>
            <h1 className="text-2xl font-semibold">AI Translator</h1>
          </div>
          <p className="text-white/40 text-xs">Translate text across 50+ languages with neural quality.</p>
        </div>

        <div className="w-full max-w-4xl flex items-center gap-3 mb-4">
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 focus:border-sky-500/50 outline-none rounded-lg px-4 py-2.5 text-sm text-white transition-colors cursor-pointer">
            {languages.map((l) => <option key={l.code} value={l.code} className="bg-[#1a0533]">{l.name}</option>)}
          </select>
          <button type="button" onClick={onSwapHandler} className="p-2.5 bg-white/5 border border-white/10 hover:border-sky-500/50 rounded-lg transition-all hover:bg-white/10">
            <ArrowRight className="w-4 h-4 text-white/50" />
          </button>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 focus:border-sky-500/50 outline-none rounded-lg px-4 py-2.5 text-sm text-white transition-colors cursor-pointer">
            {languages.map((l) => <option key={l.code} value={l.code} className="bg-[#1a0533]">{l.name}</option>)}
          </select>
        </div>

        <form onSubmit={onSubmitHandler} className="w-full max-w-4xl flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 focus-within:border-sky-500/50 rounded-xl p-4 transition-all flex flex-col">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-3">{languages.find((l) => l.code === sourceLang)?.name}</p>
              <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} rows={7} placeholder="Type or paste text here..."
                className="bg-transparent outline-none text-white/90 placeholder:text-white/20 resize-none w-full text-sm flex-1" />
              <p className="text-white/20 text-xs mt-2 text-right">{inputText.length} chars</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/30 text-xs uppercase tracking-widest">{languages.find((l) => l.code === targetLang)?.name}</p>
                {translatedText && (
                  <button type="button" onClick={onCopyHandler} className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/15 rounded-lg text-xs transition-all">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
              {loading ? (
                <div className="flex-1 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                  <span className="text-white/30 text-xs">Translating...</span>
                </div>
              ) : (
                <p className="text-white/70 text-sm leading-relaxed flex-1 whitespace-pre-wrap">
                  {translatedText || <span className="text-white/20">Translation will appear here...</span>}
                </p>
              )}
            </div>
          </div>
          <button type="submit" disabled={loading || !inputText.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:brightness-110 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <><span>Translating</span><Loader2 className="animate-spin w-4 h-4" /></> : "Translate →"}
          </button>
        </form>
      </section>
    </DashboardLayout>
  );
};

export default Translator;