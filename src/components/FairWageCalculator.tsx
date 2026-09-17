import React, { useState } from 'react';
import { Percent, TrendingUp, ShieldCheck, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface FairWageCalculatorProps {
  currentLang: Language;
}

export const FairWageCalculator: React.FC<FairWageCalculatorProps> = ({ currentLang }) => {
  const strings = t[currentLang];
  const [monthlyGigs, setMonthlyGigs] = useState<number>(30);
  const [avgGigValue, setAvgGigValue] = useState<number>(1000);

  const totalRevenue = monthlyGigs * avgGigValue;

  // SahakarSeva Cooperative Model
  const coopWorkerPayout = Math.round(totalRevenue * 0.90);
  const coopWelfareFund = Math.round(totalRevenue * 0.05);
  const coopFedOps = Math.round(totalRevenue * 0.05);

  // Private Aggregator (Urban Company / aggregators)
  const privateCommissionRate = 0.28; // 28% typical commission + lead fee + gear deduction
  const privateWorkerPayout = Math.round(totalRevenue * (1 - privateCommissionRate));
  const privateAggregatorCut = Math.round(totalRevenue * privateCommissionRate);

  const extraWorkerEarnings = coopWorkerPayout - privateWorkerPayout;

  return (
    <section id="fair-wage-calc-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <Percent className="w-3.5 h-3.5 text-emerald-600" />
          <span>Socio-Economic Impact Simulator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
          {strings.coopVsPrivateTitle}
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Interactive mathematical comparison: Labour Cooperative Model vs Commercial Aggregator Monopoly.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-5">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
            <span>Monthly Completed Gigs per Artisan:</span>
            <span className="text-emerald-700 font-mono text-sm">{monthlyGigs} Gigs</span>
          </div>
          <input
            id="slider-monthly-gigs"
            type="range"
            min={10}
            max={80}
            step={5}
            value={monthlyGigs}
            onChange={(e) => setMonthlyGigs(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
            <span>Average Tariff per Gig:</span>
            <span className="text-emerald-700 font-mono text-sm">₹{avgGigValue}</span>
          </div>
          <input
            id="slider-gig-value"
            type="range"
            min={400}
            max={2500}
            step={50}
            value={avgGigValue}
            onChange={(e) => setAvgGigValue(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center text-xs font-semibold text-slate-700">
          Total Monthly Service Volume: <strong className="text-slate-900">₹{totalRevenue.toLocaleString()}</strong>
        </div>
      </div>

      {/* Side-by-Side Comparison Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* SahakarSeva Cooperative Model Card */}
        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-500 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
            Cooperative Model
          </div>

          <div>
            <h3 className="text-xl font-bold font-serif text-white mb-1">
              SahakarSeva Platform
            </h3>
            <p className="text-xs text-emerald-200 mb-5">
              Owned collectively by registered Labour Cooperative Federations
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/50">
                <div className="text-slate-300 text-[11px]">Worker Direct Take-Home (90%):</div>
                <div className="text-2xl font-black text-emerald-400 font-serif mt-0.5">
                  ₹{coopWorkerPayout.toLocaleString()}
                </div>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>🩺 Welfare & Health Corpus (5%):</span>
                <span className="font-bold text-teal-300 font-mono">+₹{coopWelfareFund.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>🏢 Federation Operations (5%):</span>
                <span className="font-mono">₹{coopFedOps.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>🎁 Annual Profit Dividend:</span>
                <span className="font-bold text-amber-300">Included as Member-Owner</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>🛡️ Social Security & Pension:</span>
                <span className="font-bold text-emerald-300">100% Fully Guaranteed</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-800 text-[11px] text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Artisan earns ₹{extraWorkerEarnings.toLocaleString()} more per month!</span>
          </div>
        </div>

        {/* Private Commercial Aggregator Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-300 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider mb-2">
              Private Commercial App
            </div>

            <h3 className="text-xl font-bold font-serif text-slate-900 mb-1">
              Private Aggregator Apps
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Investor-funded middleman maximizing corporate margin
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 text-[11px]">Worker Net Payout (~72%):</div>
                <div className="text-2xl font-black text-slate-800 font-serif mt-0.5">
                  ₹{privateWorkerPayout.toLocaleString()}
                </div>
              </div>

              <div className="flex justify-between items-center text-rose-700 font-semibold">
                <span>Predatory Commission Cut (28%):</span>
                <span className="font-mono font-bold">-₹{privateAggregatorCut.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span>Lead & Bidding Charges:</span>
                <span className="text-rose-600 font-semibold">Deducted from Worker</span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span>Annual Profit Dividend:</span>
                <span className="text-slate-400">0% (Goes to Investors)</span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span>Social Security & Pension:</span>
                <span className="text-rose-600 font-bold">None (Gig Contract Risk)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            ⚠️ High worker attrition, debt traps, and zero collective bargaining power.
          </div>
        </div>
      </div>
    </section>
  );
};
