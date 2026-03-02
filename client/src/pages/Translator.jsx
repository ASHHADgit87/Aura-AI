import React, { useState, useEffect, useRef } from "react";
import { Loader2, Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../configs/axios";
import Sidebar from "../components/Sidebar";
import FooterForFeature from "../components/FooterForFeature";


const languageCountryMap = {
  en: "US",
  ar: "SA",
  az: "AZ",
  bn: "BD",
  bs: "BA",
  bg: "BG",
  ca: "ES",
  zh: "CN",
  zt: "TW",
  hr: "HR",
  cs: "CZ",
  da: "DK",
  nl: "NL",
  eo: "UN",
  et: "EE",
  fi: "FI",
  fr: "FR",
  de: "DE",
  el: "GR",
  gu: "IN",
  he: "IL",
  hi: "IN",
  hu: "HU",
  id: "ID",
  ga: "IE",
  it: "IT",
  ja: "JP",
  kn: "IN",
  ko: "KR",
  lv: "LV",
  lt: "LT",
  ms: "MY",
  ml: "IN",
  mr: "IN",
  nb: "NO",
  fa: "IR",
  pl: "PL",
  pt: "PT",
  pa: "IN",
  ro: "RO",
  ru: "RU",
  sr: "RS",
  sk: "SK",
  sl: "SI",
  es: "ES",
  sw: "KE",
  sv: "SE",
  tl: "PH",
  ta: "IN",
  te: "IN",
  th: "TH",
  tr: "TR",
  uk: "UA",
  ur: "PK",
  vi: "VN",
};

const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "az", name: "Azerbaijani" },
  { code: "bn", name: "Bengali" },
  { code: "bs", name: "Bosnian" },
  { code: "bg", name: "Bulgarian" },
  { code: "ca", name: "Catalan" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "zt", name: "Chinese (Traditional)" },
  { code: "hr", name: "Croatian" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" },
  { code: "eo", name: "Esperanto" },
  { code: "et", name: "Estonian" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "gu", name: "Gujarati" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "hu", name: "Hungarian" },
  { code: "id", name: "Indonesian" },
  { code: "ga", name: "Irish" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "kn", name: "Kannada" },
  { code: "ko", name: "Korean" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "ms", name: "Malay" },
  { code: "ml", name: "Malayalam" },
  { code: "mr", name: "Marathi" },
  { code: "nb", name: "Norwegian" },
  { code: "fa", name: "Persian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "pa", name: "Punjabi" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sr", name: "Serbian" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "es", name: "Spanish" },
  { code: "sw", name: "Swahili" },
  { code: "sv", name: "Swedish" },
  { code: "tl", name: "Tagalog" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "ur", name: "Urdu" },
  { code: "vi", name: "Vietnamese" },
];

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("es");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  
  const fromFlagRef = useRef(null);
  const toFlagRef = useRef(null);

  const updateFlag = (langCode, ref) => {
    if (!ref.current) return;
    const countryCode = languageCountryMap[langCode];
    if (!countryCode) return;
    ref.current.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  };

  useEffect(() => {
    updateFlag(fromLang, fromFlagRef);
  }, [fromLang]);

  useEffect(() => {
    updateFlag(toLang, toFlagRef);
  }, [toLang]);

  const onTranslateHandler = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return toast.error("Please enter text to translate");
    if (fromLang === toLang)
      return toast.error("Source and target languages cannot be the same");
    try {
      setLoading(true);
      setOutputText("");
      const { data } = await axios.post("/api/translate", {
        text: inputText,
        from: fromLang,
        to: toLang,
      });
      setOutputText(data.translatedText || "");
      toast.success("Translation complete!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Translation failed");
    } finally {
      setLoading(false);
    }
  };

  const onCopyHandler = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const onResetHandler = () => {
    setInputText("");
    setOutputText("");
    setCopied(false);
  };

  const onSwapHandler = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(outputText);
    setOutputText(inputText);
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Translator</h1>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto">
              Translate text instantly between multiple languages With Aura AI.
            </p>
          </div>

          <form
            onSubmit={onTranslateHandler}
            className="w-full max-w-5xl bg-black/30 border border-white/20 rounded-2xl p-6 backdrop-blur-xl flex flex-col gap-4"
          >
            {/* Language selectors */}
            <div className="flex gap-3 flex-col sm:flex-row mb-4">
              <div className="flex items-center gap-2 flex-1">
                <img ref={fromFlagRef} className="w-6 h-6 rounded-sm" alt="from flag" />
                <select
                  value={fromLang}
                  onChange={(e) => setFromLang(e.target.value)}
                  className="flex-1 rounded-xl px-4 py-2 text-white bg-black/20 border border-white/10 cursor-pointer transition-all hover:border-white/30"
                >
                  {languages.map((l) => (
                    <option
                      key={l.code}
                      value={l.code}
                      className="bg-black/80 text-white"
                    >
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={onSwapHandler}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all text-white/70 text-lg font-bold"
              >
                ⇄
              </button>

              <div className="flex items-center gap-2 flex-1">
                <img ref={toFlagRef} className="w-6 h-6 rounded-sm" alt="to flag" />
                <select
                  value={toLang}
                  onChange={(e) => setToLang(e.target.value)}
                  className="flex-1 rounded-xl px-4 py-2 text-white bg-black/20 border border-white/10 cursor-pointer transition-all hover:border-white/30"
                >
                  {languages.map((l) => (
                    <option
                      key={l.code}
                      value={l.code}
                      className="bg-black/80 text-white"
                    >
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input & Output side by side */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Input */}
              <textarea
                rows={10}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate..."
                className="flex-1 bg-white/5 text-white/90 placeholder:text-white/40 rounded-xl p-4 outline-none resize-none"
              />

              {/* Output */}
              <textarea
                rows={10}
                value={outputText}
                readOnly
                placeholder={`Translation output will appear here...`}
                className="flex-1 bg-white/5 text-white/90 placeholder:text-white/40 rounded-xl p-4 outline-none resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onResetHandler}
                className="px-5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="px-5 py-1.5 rounded-xl font-semibold text-white flex items-center gap-2 bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 border-2 border-white/30 hover:border-white/70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" /> Translating...
                  </>
                ) : (
                  "Translate"
                )}
              </button>
            </div>
          </form>
        </section>

        <FooterForFeature />
      </div>
    </div>
  );
};

export default Translator;