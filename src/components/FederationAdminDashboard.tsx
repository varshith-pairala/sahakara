import React, { useState } from 'react';
import { Building2, ShieldCheck, Users, CheckCircle, Award, PieChart, Sparkles } from 'lucide-react';
import { SocietyInfo, WorkerProfile, Language } from '../types';
import { t } from '../translations';

interface FederationAdminDashboardProps {
  currentLang: Language;
  societies: SocietyInfo[];
  pendingWorkers: WorkerProfile[];
  onVerifyWorker: (workerId: string) => void;
}

export const FederationAdminDashboard: React.FC<FederationAdminDashboardProps> = ({
  currentLang,
  societies,
  pendingWorkers,
  onVerifyWorker,
}) => {
  const strings = t[currentLang];
  const [selectedSocietyTab, setSelectedSocietyTab] = useState<string>('all');
  const [annualProfitSurplus, setAnnualProfitSurplus] = useState<number>(3240000);
  const [dividendDistributed, setDividendDistributed] = useState<boolean>(false);

  const totalAffiliatedWorkers = societies.reduce((acc, s) => acc + s.workersCount, 0);
  const totalActiveJobs = societies.reduce((acc, s) => acc + s.activeJobsCount, 0);
  const totalCorpus = societies.reduce((acc, s) => acc + s.welfareCorpusFund, 0);

  // Dividend math
  const perWorkerDividend = Math.round(annualProfitSurplus / (totalAffiliatedWorkers || 1));

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Federation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>State Labour Cooperative Federation Apex Council</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            {strings.roleFederation}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Supervising {societies.length} Primary Labour Cooperative Societies (LCS) & {totalAffiliatedWorkers} active artisans.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-900">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Federation Compliance Audit: <strong>100% Passed</strong></span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-medium">Affiliated Societies (LCS)</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">
            {societies.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Across 5 Industrial Districts</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-medium">Active Cooperative Artisans</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">
            {totalAffiliatedWorkers}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">100% e-Shram & KYC Checked</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-medium">Active Gigs Dispatched</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif mt-1">
            {totalActiveJobs}
          </div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">Real-time Geo Dispatch Grid</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-slate-400 text-xs font-medium">Accumulated Welfare Corpus</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-serif mt-1">
            ₹{(totalCorpus / 100000).toFixed(1)}L
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">5% Mandated Social Protection</div>
        </div>
      </div>

      {/* Primary Labour Cooperative Societies Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Affiliated Primary Labour Cooperative Societies</h3>
            <p className="text-xs text-slate-500">Registered with State Registrar of Cooperative Societies</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Society Registration #</th>
                <th className="p-3.5">Society Name</th>
                <th className="p-3.5">District / State</th>
                <th className="p-3.5">Elected President</th>
                <th className="p-3.5">Worker Base</th>
                <th className="p-3.5">Active Gigs</th>
                <th className="p-3.5">Welfare Corpus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {societies.map((soc) => (
                <tr key={soc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{soc.regNumber}</td>
                  <td className="p-3.5 font-semibold text-slate-800">{soc.name}</td>
                  <td className="p-3.5 text-slate-600">{soc.district}, {soc.state}</td>
                  <td className="p-3.5 text-slate-700">{soc.presidentName}</td>
                  <td className="p-3.5 font-bold text-slate-900">{soc.workersCount}</td>
                  <td className="p-3.5 font-bold text-emerald-700">{soc.activeJobsCount}</td>
                  <td className="p-3.5 font-bold text-emerald-800 font-mono">₹{soc.welfareCorpusFund.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Worker KYC Verification Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Artisan Verification & Police KYC Queue</span>
              {pendingWorkers.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  {pendingWorkers.length} Pending
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              Federation verification validates e-Shram link, police character verification & awards certified badges.
            </p>
          </div>
        </div>

        {pendingWorkers.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            All registered cooperative workers are verified and certified active!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingWorkers.map((worker) => (
              <div key={worker.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{worker.name}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">
                        {worker.trade}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Affiliation: <strong>{worker.societyName}</strong> • {worker.experienceYears} Years Exp
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      e-Shram: {worker.eShramId}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    id={`btn-approve-worker-${worker.id}`}
                    onClick={() => onVerifyWorker(worker.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve & Issue Badge</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cooperative Dividend Distribution Engine */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              <PieChart className="w-4 h-4" />
              <span>{strings.dividendTitle}</span>
            </div>
            <h3 className="text-2xl font-bold font-serif text-white">
              Worker Co-Ownership Dividend Calculator
            </h3>
            <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">
              {strings.dividendDesc}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 w-full lg:w-80 text-xs">
            <div className="text-slate-300 font-medium mb-1">Annual Federation Net Surplus</div>
            <div className="text-2xl font-black text-white font-serif mb-3">
              ₹{annualProfitSurplus.toLocaleString()}
            </div>

            <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-500/30 mb-4 space-y-1">
              <div className="text-slate-300 text-[10px]">Patronage Dividend per Worker:</div>
              <div className="text-lg font-extrabold text-emerald-400 font-serif">
                ₹{perWorkerDividend.toLocaleString()} / year
              </div>
              <div className="text-[10px] text-emerald-200">
                Transferred directly to Bank Account / RuPay Card
              </div>
            </div>

            <button
              id="btn-distribute-dividend"
              onClick={() => setDividendDistributed(true)}
              disabled={dividendDistributed}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dividendDistributed
                  ? 'bg-emerald-500 text-slate-950 font-extrabold'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {dividendDistributed ? '✓ Dividends Disbursed to 1,418 Workers!' : 'Authorize Annual Dividend Payout'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
