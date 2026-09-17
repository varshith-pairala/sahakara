import React from 'react';
import { Clock, Shield, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface ServiceCatalogProps {
  currentLang: Language;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onSelectTrade?: (trade: string) => void;
  onBookDirect?: (trade: string, basePrice: number) => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  currentLang,
  selectedCategory,
  onSelectCategory,
  onSelectTrade,
  onBookDirect,
}) => {
  const strings = t[currentLang];

  const handleSelectTrade = (trade: string) => {
    if (typeof onSelectTrade === 'function') {
      onSelectTrade(trade);
    }
    if (typeof onSelectCategory === 'function') {
      onSelectCategory(trade);
    }
    const elem = document.getElementById('worker-directory-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookDirect = (trade: string, baseRate: number) => {
    if (typeof onBookDirect === 'function') {
      onBookDirect(trade, baseRate);
    } else if (typeof onSelectCategory === 'function') {
      onSelectCategory(trade);
      const elem = document.getElementById('worker-directory-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const catalog = [
    {
      trade: "Electrician",
      label: strings.electrician,
      icon: "⚡",
      baseRate: 350,
      turnaround: "30-45 mins",
      features: ["Short circuit & MCB repair", "Inverter & wiring diagnostics", "Safety earthing testing"],
      coopTariff: "₹350 / hr (Worker gets ₹315)",
      privateAppSurge: "₹650+ surge in private apps",
    },
    {
      trade: "Plumber",
      label: strings.plumber,
      icon: "🔧",
      baseRate: 320,
      turnaround: "20-40 mins",
      features: ["Leak detection & CPVC fittings", "Taps, mixers & motor fixing", "Emergency blockage removal"],
      coopTariff: "₹320 / hr (Worker gets ₹288)",
      privateAppSurge: "₹599+ in private apps",
    },
    {
      trade: "Domestic Helper & Cook",
      label: strings.domesticHelper,
      icon: "🍲",
      baseRate: 280,
      turnaround: "Flexible slots",
      features: ["Hygienic daily cooking", "Kitchen deep sanitation", "Cooperative background clearance"],
      coopTariff: "₹280 / hr (Worker gets ₹252)",
      privateAppSurge: "₹500+ broker cut in private agencies",
    },
    {
      trade: "Caregiver & Elderly Support",
      label: strings.caregiver,
      icon: "🩺",
      baseRate: 300,
      turnaround: "Scheduled & Full-Day",
      features: ["Mobility & vitals assistance", "Medication compliance reminder", "Compassionate trained support"],
      coopTariff: "₹300 / hr (Worker gets ₹270)",
      privateAppSurge: "₹600+ in private agencies",
    },
    {
      trade: "Carpenter",
      label: strings.carpenter,
      icon: "🪚",
      baseRate: 360,
      turnaround: "1-2 hours",
      features: ["Locks & hinges alignment", "Modular furniture repair", "Wood finishing & restoration"],
      coopTariff: "₹360 / hr (Worker gets ₹324)",
      privateAppSurge: "₹700+ in private apps",
    },
    {
      trade: "Painter",
      label: strings.painter,
      icon: "🎨",
      baseRate: 310,
      turnaround: "Custom project",
      features: ["Damp-proof waterproofing", "Interior texture & royal coats", "Pre-festival touch-ups"],
      coopTariff: "₹310 / hr (Worker gets ₹279)",
      privateAppSurge: "₹650+ in private apps",
    },
    {
      trade: "Appliance Technician",
      label: strings.technician,
      icon: "❄️",
      baseRate: 380,
      turnaround: "45-60 mins",
      features: ["Inverter AC & Gas charge", "Washing machine motor checks", "RO water purifier filter fix"],
      coopTariff: "₹380 / hr (Worker gets ₹342)",
      privateAppSurge: "₹750+ in private apps",
    },
    {
      trade: "Gardener & Landscaper",
      label: strings.gardener,
      icon: "🌱",
      baseRate: 260,
      turnaround: "1-3 hours",
      features: ["Terrace garden & drip lines", "Bonsai, lawn & pruning", "Organic vermicompost care"],
      coopTariff: "₹260 / hr (Worker gets ₹234)",
      privateAppSurge: "₹550+ in private apps",
    }
  ];

  return (
    <section id="services-catalog-section" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Regulated Cooperative Tariff Card</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            Household & Community Services
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Standardized rates fixed by Labour Cooperative Federations. No hidden surge pricing.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>90% goes to artisan • 5% to health/pension corpus</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {catalog.map((item) => {
          const isSelected = selectedCategory === item.trade;
          return (
            <div
              key={item.trade}
              id={`service-card-${item.trade.replace(/\s+/g, '-').toLowerCase()}`}
              className={`group bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                isSelected ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-emerald-400'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`text-3xl p-2.5 rounded-xl transition-colors ${isSelected ? 'bg-emerald-100' : 'bg-slate-50 group-hover:bg-emerald-50'}`}>
                    {item.icon}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.turnaround}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                  {item.label}
                </h3>

                <div className="mb-3">
                  <div className="text-lg font-extrabold text-emerald-800 font-serif">
                    ₹{item.baseRate}{" "}
                    <span className="text-xs font-medium text-slate-500 font-sans">
                      / base hr
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700">
                    {item.coopTariff}
                  </div>
                  <div className="text-[10px] text-slate-400 line-through">
                    {item.privateAppSurge}
                  </div>
                </div>

                <ul className="space-y-1.5 mb-4 text-xs text-slate-600">
                  {item.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  id={`btn-view-workers-${item.trade.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleSelectTrade(item.trade)}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 text-center transition-colors cursor-pointer"
                >
                  View Artisans
                </button>
                <button
                  type="button"
                  id={`btn-instant-book-${item.trade.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleBookDirect(item.trade, item.baseRate)}
                  className="py-2 px-3.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors cursor-pointer"
                >
                  Book
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
