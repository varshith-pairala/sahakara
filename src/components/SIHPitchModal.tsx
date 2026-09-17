import React from 'react';
import { X, Award, ShieldCheck, CheckCircle2, TrendingUp, Users, HeartHandshake, Zap, BookOpen } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface SIHPitchModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const SIHPitchModal: React.FC<SIHPitchModalProps> = ({
  currentLang,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const strings = t[currentLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-900 shadow-md">
            <BookOpen className="w-6 h-6 text-emerald-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Multi-State Cooperative Societies Act (MSCS)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                National Federation Bylaws
              </span>
            </div>
            <h2 className="text-xl font-bold font-serif text-slate-900 mt-0.5">
              Cooperative Gig Services Platform Charter & Operating By-laws
            </h2>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-4 text-xs text-slate-700">
          <div className="bg-emerald-950 text-white rounded-2xl p-4 border border-emerald-800">
            <div className="font-bold text-emerald-400 text-sm mb-1">
              The Cooperative Economic Model: 90/5/5 Distribution
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              Private aggregators deduct 25% to 35% arbitrary cuts from workers' hard-earned fees and treat them as gig contractors with zero social protection.
              <strong> SahakarSeva enforces fair cooperative principles:</strong> 90% goes directly to the verified skilled artisan, 5% is reserved for the Worker Welfare & Healthcare Corpus, and 5% powers local Primary Labour Cooperative Society operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Labour Societies</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Federation-vetted artisans from registered Primary Labour Cooperative Societies (LCS) with police & e-Shram authentication.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Geo-Spatial Matching</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Direct GPS radar pairing citizens with closest neighborhood artisans, with instant transparent tariffs.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <HeartHandshake className="w-4 h-4 text-teal-600" />
                <span>Welfare & Social Security</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Direct integration with Ayushman Mediclaim, PM-SYM pensions, on-duty accident cover, and annual cooperative surplus dividend payouts.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Demand Cluster Allocation</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Federation workforce planning allocating skilled workers ahead of monsoon drain surges and festive seasons without price gouging.
              </p>
            </div>
          </div>

          <div className="bg-slate-100 p-3 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
            <span>Aligned with: National Cooperative Policy & Digital Public Infrastructure</span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition-colors cursor-pointer"
            >
              Continue to Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
