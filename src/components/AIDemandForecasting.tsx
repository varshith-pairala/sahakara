import React, { useState } from 'react';
import { TrendingUp, Users, Calendar, ArrowRight, ShieldCheck, MapPin, BarChart3, CheckCircle2 } from 'lucide-react';
import { AIDemandForecastResult, Language } from '../types';
import { t } from '../translations';

interface AIDemandForecastingProps {
  currentLang: Language;
}

export const AIDemandForecasting: React.FC<AIDemandForecastingProps> = ({ currentLang }) => {
  const strings = t[currentLang];

  const [district, setDistrict] = useState('Hyderabad Metropolitan & Cyberabad');
  const [season, setSeason] = useState('Monsoon & Pre-Festival Surge');
  const [festival, setFestival] = useState('Diwali & Bathukamma / Dasara');
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<AIDemandForecastResult | null>({
    summary: "High seasonal demand surge detected in Hyderabad North & West clusters ahead of festive celebrations.",
    peakCategories: [
      {
        trade: "Painter",
        demandSurge: "+110%",
        reason: "Pre-festive home whitewashing, damp-proof interior wall coating before Diwali & Bathukamma.",
        recommendedAllocation: "Deploy 75 painters from East Rural cluster to residential high-rise corridors."
      },
      {
        trade: "Plumber",
        demandSurge: "+82%",
        reason: "Monsoon drain backflow clearance, sump pump checkups, and terrace drainage sealing.",
        recommendedAllocation: "Form 12 rapid-action motorcycle plumber squads for West Zone."
      },
      {
        trade: "Electrician",
        demandSurge: "+64%",
        reason: "Waterproofing MCB inspections, festival decorative lighting, and inverter battery testing.",
        recommendedAllocation: "Reserve 45 certified electricians for night-shift emergency coverage."
      },
      {
        trade: "Domestic Helper & Cook",
        demandSurge: "+48%",
        reason: "Festival deep kitchen sanitation and traditional sweet preparation support.",
        recommendedAllocation: "Shift 35 workers to flexible 4-hour morning festive slots."
      }
    ],
    cooperativeFederationActionPlan: [
      "Re-allocate 120 verified artisans from low-demand peripheral clusters to core urban residential societies.",
      "Activate advance toolkit subsidies and waterproof safety equipment from the Cooperative Welfare Fund.",
      "Maintain fixed cooperative transparent tariff: prevent artificial private platform 2x surge pricing!"
    ],
    projectedFederationTurnover: "₹42,50,000",
    projectedWorkerFairWages: "₹38,25,000 (90% directly to cooperative members)"
  });

  const handleGenerateForecast = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district, season, upcomingFestival: festival }),
      });
      const data = await res.json();
      if (data.peakCategories) {
        setForecast(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            <span>Federation Workforce Intelligence • Demand Planning & Balancing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            {strings.aiForecasting}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Predictive community service demand modeling and inter-society workforce balancing.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-900 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Engine: <strong>Federation Labour Dispatch Optimizer</strong></span>
        </div>
      </div>

      {/* Simulator Inputs Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Cluster / District
            </label>
            <select
              id="ai-forecast-district-select"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer"
            >
              <option value="Hyderabad Metropolitan & Cyberabad">Hyderabad & Cyberabad</option>
              <option value="Ranga Reddy Industrial Belt">Ranga Reddy Industrial Belt</option>
              <option value="Visakhapatnam Coastal Zone">Visakhapatnam Coastal Zone</option>
              <option value="Vijayawada & Amaravati Region">Vijayawada & Amaravati Region</option>
              <option value="Warangal Urban District">Warangal Urban District</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Weather & Seasonal Factor
            </label>
            <select
              id="ai-forecast-season-select"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer"
            >
              <option value="Monsoon & Pre-Festival Surge">Monsoon & Pre-Festival Surge</option>
              <option value="Peak Summer (AC & Cooling Crisis)">Peak Summer (AC & Cooling Crisis)</option>
              <option value="Winter Wedding & Painting Season">Winter Wedding & Painting Season</option>
              <option value="Spring General Maintenance">Spring General Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upcoming Festival / Regional Event
            </label>
            <select
              id="ai-forecast-festival-select"
              value={festival}
              onChange={(e) => setFestival(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer"
            >
              <option value="Diwali & Bathukamma / Dasara">Diwali & Bathukamma / Dasara</option>
              <option value="Sankranti / Pongal Harvest">Sankranti / Pongal Harvest</option>
              <option value="Ramadan & Eid Ul Fitr">Ramadan & Eid Ul Fitr</option>
              <option value="Ganesh Chaturthi Festive Season">Ganesh Chaturthi Festive Season</option>
            </select>
          </div>
        </div>

        <button
          id="btn-run-ai-forecast"
          onClick={handleGenerateForecast}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-900/10 disabled:opacity-50"
        >
          <TrendingUp className="w-4 h-4" />
          <span>{loading ? 'Modeling Seasonal Demand Trends...' : 'Run Seasonal Demand Analysis & Workforce Allocation'}</span>
        </button>
      </div>

      {/* Forecast Output */}
      {forecast && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Executive Summary Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-7 border border-emerald-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Strategic Demand Summary
                </span>
                <h3 className="text-xl font-bold font-serif text-white mt-0.5">
                  {forecast.summary}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-slate-400 text-[10px] block">Projected Turnover</span>
                  <span className="text-emerald-400 font-bold">{forecast.projectedFederationTurnover}</span>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-slate-400 text-[10px] block">Direct Worker Payout (90%)</span>
                  <span className="text-emerald-300 font-bold">{forecast.projectedWorkerFairWages}</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                Cooperative Federation Tactical Directive
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {forecast.cooperativeFederationActionPlan.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trade Specific Surge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {forecast.peakCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-bold text-slate-900">{cat.trade}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-black">
                      {cat.demandSurge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {cat.reason}
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 font-medium">
                  <strong className="text-emerald-900 block mb-0.5">Allocation:</strong>
                  {cat.recommendedAllocation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
