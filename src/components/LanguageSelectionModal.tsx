import React, { useState } from 'react';
import { Globe, Check, Volume2, ArrowRight, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  selectedLang: Language;
  onSelectLanguage: (lang: Language) => void;
  onConfirm: () => void;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  selectedLang,
  onSelectLanguage,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const [activeLang, setActiveLang] = useState<Language>(selectedLang || 'en');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const languages: {
    id: Language;
    name: string;
    nativeName: string;
    regionDesc: string;
    greeting: string;
    flag: string;
    speechLang: string;
  }[] = [
    {
      id: 'en',
      name: 'English (Default)',
      nativeName: 'English',
      regionDesc: 'Official National Interface • Cooperative Federations',
      greeting: 'Welcome to SahakarSeva, empowering cooperative workers with fair wages.',
      flag: '🇮🇳',
      speechLang: 'en-IN',
    },
    {
      id: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      regionDesc: 'తెలంగాణ & ఆంధ్రప్రదేశ్ లేబర్ కోఆపరేటివ్ సొసైటీలు',
      greeting: 'సహకార సేవకు స్వాగతం. శ్రామికులకు 90 శాతం ప్రత్యక్ష న్యాయమైన వేతనం.',
      flag: '🇮🇳',
      speechLang: 'te-IN',
    },
    {
      id: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      regionDesc: 'राष्ट्रीय श्रम सहकारी महासंघ एवं कल्याणकारी योजनाएं',
      greeting: 'सहकार सेवा में आपका स्वागत है। श्रमिकों को 90% सीधा पारिश्रमिक।',
      flag: '🇮🇳',
      speechLang: 'hi-IN',
    },
    {
      id: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      regionDesc: 'தமிழ்நாடு தொழிலாளர் கூட்டுறவு சங்கங்களின் கூட்டமைப்பு',
      greeting: 'சஹகார சேவாவிற்கு வரவேற்கிறோம். தொழிலாளர்களுக்கு நியாயமான ஊதியம்.',
      flag: '🇮🇳',
      speechLang: 'ta-IN',
    },
  ];

  const handleSpeakSample = (e: React.MouseEvent, greeting: string, speechLang: string, langId: string) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(greeting);
      utterance.lang = speechLang;
      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingAudio(langId);
      utterance.onend = () => setIsPlayingAudio(null);
      utterance.onerror = () => setIsPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleChoose = (id: Language) => {
    setActiveLang(id);
    onSelectLanguage(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Globe className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-slate-900">
            Select Your Preferred Language
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            మీ భాషను ఎంచుకోండి • अपनी भाषा चुनें • உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Default language set to English. You can switch anytime from the top bar.</span>
          </div>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {languages.map((lang) => {
            const isSelected = activeLang === lang.id;
            return (
              <div
                key={lang.id}
                id={`lang-card-${lang.id}`}
                onClick={() => handleChoose(lang.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-md shadow-emerald-600/10 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {lang.name}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="text-xl font-bold text-slate-900 font-serif mb-1">
                    {lang.nativeName}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {lang.regionDesc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleSpeakSample(e, lang.greeting, lang.speechLang, lang.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    title="Listen to native voice sample"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio === lang.id ? 'animate-bounce text-emerald-600' : ''}`} />
                    <span>{isPlayingAudio === lang.id ? 'Playing...' : 'Audio Preview'}</span>
                  </button>

                  <span className="text-xs">{lang.flag}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation CTA */}
        <button
          type="button"
          id="confirm-language-btn"
          onClick={onConfirm}
          className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-900/20 hover:scale-[1.01]"
        >
          <span>Continue to SahakarSeva Hub ({languages.find(l => l.id === activeLang)?.nativeName})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
