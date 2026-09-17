import React from 'react';
import { ShieldCheck, Percent, HeartHandshake, Zap, Sparkles, Award } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface HeroCoopBannerProps {
  currentLang: Language;
  onOpenSOS?: () => void;
  onOpenCalculator?: () => void;
  onSelectCategory?: (trade: string) => void;
  selectedCategory?: string;
  onExploreServices?: () => void;
  onTriggerEmergency?: () => void;
}

export const HeroCoopBanner: React.FC<HeroCoopBannerProps> = ({
  currentLang,
  onOpenSOS,
  onOpenCalculator,
  onSelectCategory,
  selectedCategory = 'All',
  onExploreServices,
  onTriggerEmergency,
}) => {
  const strings = t[currentLang];

  const handleOpenSOS = () => {
    if (typeof onOpenSOS === 'function') {
      onOpenSOS();
    } else if (typeof onTriggerEmergency === 'function') {
      onTriggerEmergency();
    }
  };

  const handleOpenCalculator = () => {
    if (typeof onOpenCalculator === 'function') {
      onOpenCalculator();
    } else {
      document.getElementById('fair-wage-calc-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (id: string) => {
    if (typeof onSelectCategory === 'function') {
      onSelectCategory(id);
    }
  };

  const popularTrades = [
    { id: 'All', label: strings.allTrades, icon: '🏠' },
    { id: 'Electrician', label: strings.electrician, icon: '⚡' },
    { id: 'Plumber', label: strings.plumber, icon: '🔧' },
    { id: 'Domestic Helper & Cook', label: strings.domesticHelper, icon: '🍲' },
    { id: 'Caregiver & Elderly Support', label: strings.caregiver, icon: '🩺' },
    { id: 'Carpenter', label: strings.carpenter, icon: '🪚' },
    { id: 'Painter', label: strings.painter, icon: '🎨' },
    { id: 'Appliance Technician', label: strings.technician, icon: '❄️' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-800">
      {/* Subtle Background Geometric Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-200 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cooperative-Owned Alternative to Exploitative Private Gig Platforms</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif text-white mb-4">
            {strings.tagline}
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {strings.subtagline}
          </p>
        </div>

        {/* 3 Core Cooperative Pillars Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">90% Direct Fair Wage</h4>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Workers keep 90% of fee. Private apps charge 25-30% predatory cuts.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-teal-500/20 text-teal-300">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">5% Worker Welfare Corpus</h4>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Funds Ayushman Bharat Mediclaim, PM-SYM pensions & accident security.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Federation Verified</h4>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Physical society membership, police-verified badges & e-Shram credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Bar: Book Artisan, Fair Wage Calculator & Emergency SOS */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            type="button"
            id="hero-book-artisan-btn"
            onClick={() => {
              if (typeof onExploreServices === 'function') {
                onExploreServices();
              } else {
                document.getElementById('services-catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25 cursor-pointer ring-2 ring-emerald-300/50"
          >
            <Zap className="w-4 h-4 text-emerald-950 fill-emerald-950" />
            <span>⚡ Instant Book Verified Artisan</span>
          </button>

          <button
            type="button"
            id="hero-open-calculator-btn"
            onClick={handleOpenCalculator}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-all shadow-md shadow-black/10 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{strings.fairWageCalc}</span>
          </button>

          <button
            type="button"
            id="hero-open-emergency-btn"
            onClick={handleOpenSOS}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-rose-900/30 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{strings.emergencySOS}</span>
          </button>
        </div>

        {/* Trade Category Quick Pills */}
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider text-center mb-3">
            Select Household / Community Service Category
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {popularTrades.map((tItem) => {
              const isSelected = selectedCategory === tItem.id;
              return (
                <button
                  type="button"
                  key={tItem.id}
                  id={`cat-pill-${tItem.id.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleCategoryClick(tItem.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-400 text-emerald-950 shadow-xs font-bold scale-105'
                      : 'bg-emerald-900/80 text-emerald-100 hover:bg-emerald-800 border border-emerald-700/60'
                  }`}
                >
                  <span>{tItem.icon}</span>
                  <span>{tItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
