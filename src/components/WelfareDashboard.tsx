import React, { useState } from 'react';
import { HeartHandshake, ShieldCheck, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { WelfareClaimRecord, Language } from '../types';
import { t } from '../translations';

interface WelfareDashboardProps {
  currentLang: Language;
  claims: WelfareClaimRecord[];
  onNewClaimSubmitted: (claim: WelfareClaimRecord) => void;
}

export const WelfareDashboard: React.FC<WelfareDashboardProps> = ({
  currentLang,
  claims,
  onNewClaimSubmitted,
}) => {
  const strings = t[currentLang];
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [workerName, setWorkerName] = useState('G. Ravi Kumar');
  const [claimType, setClaimType] = useState<'Ayushman Health Cover' | 'Accident Insurance' | 'Emergency Medical Grant' | 'Tool Kit Upgrade Subsidy'>('Tool Kit Upgrade Subsidy');
  const [amount, setAmount] = useState(6000);
  const [description, setDescription] = useState('Safety harness & digital insulation testing gear procurement');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/welfare/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerId: "WRK-101",
          claimType,
          amount,
          description,
        }),
      });
      const data = await res.json();
      if (data.claim) {
        onNewClaimSubmitted(data.claim);
        setShowClaimModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cooperative Social Security & Social Protection Net</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            {strings.welfareHub}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Every gig automatically allocates 5% to the Worker Welfare Corpus for healthcare, pensions & insurance.
          </p>
        </div>

        <button
          id="btn-file-welfare-claim"
          onClick={() => setShowClaimModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>File Welfare / Insurance Claim</span>
        </button>
      </div>

      {/* 3 Core Welfare Schemes Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Ayushman Bharat */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🩺</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 text-[10px] font-bold">
              Active Coverage
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">{strings.ayushmanCover}</h3>
          <p className="text-xs text-slate-600 mt-1 mb-3">
            ₹5,00,000 cashless secondary and tertiary hospitalization cover for worker and family members at network hospitals.
          </p>
          <div className="text-[11px] font-semibold text-emerald-800">
            ✓ Linked with e-Shram Registration ID
          </div>
        </div>

        {/* PM-SYM Pension Scheme */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🏦</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-bold">
              Co-Contributory
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">{strings.pmSymPension}</h3>
          <p className="text-xs text-slate-600 mt-1 mb-3">
            Assures ₹3,000 monthly pension after age 60. Cooperative Federation matches 50% of the worker's monthly contribution.
          </p>
          <div className="text-[11px] font-semibold text-amber-900">
            ✓ 1,240 Artisans Enrolled in Pension Pool
          </div>
        </div>

        {/* ₹5 Lakh On-Duty Accident Cover */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🛡️</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-200 text-blue-900 text-[10px] font-bold">
              100% Federation Funded
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">{strings.accidentInsurance}</h3>
          <p className="text-xs text-slate-600 mt-1 mb-3">
            24x7 coverage during transit and active service execution for electrical hazards, ladder falls, and transit collisions.
          </p>
          <div className="text-[11px] font-semibold text-blue-900">
            ✓ Instant cashless emergency admission
          </div>
        </div>
      </div>

      {/* Welfare Corpus Live Pool Stats */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Cooperative Federation Welfare Pool
            </span>
            <h3 className="text-3xl font-black font-serif text-white mt-1">
              ₹77,80,000 <span className="text-sm font-sans font-normal text-slate-400">Corpus Reserve</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Generated completely from the transparent 5% social security allocation across 18,400+ completed cooperative gigs.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <div className="text-slate-400 text-[10px]">Claims Disbursed</div>
              <div className="text-base font-bold text-white mt-0.5">₹14,92,000</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <div className="text-slate-400 text-[10px]">Avg Settlement Time</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">48 Hours</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 col-span-2 sm:col-span-1">
              <div className="text-slate-400 text-[10px]">Arbitration Approval</div>
              <div className="text-base font-bold text-teal-300 mt-0.5">Society Board</div>
            </div>
          </div>
        </div>
      </div>

      {/* Claims History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Welfare & Insurance Claims</h3>
          <span className="text-xs text-slate-500 font-medium">Auto-verified via e-Shram & Federation Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Claim ID</th>
                <th className="p-3.5">Worker Name</th>
                <th className="p-3.5">Scheme Type</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Submission Date</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{claim.id}</td>
                  <td className="p-3.5 font-semibold text-slate-800">{claim.workerName}</td>
                  <td className="p-3.5 text-slate-600">{claim.claimType}</td>
                  <td className="p-3.5 font-bold text-emerald-800">₹{claim.amount.toLocaleString()}</td>
                  <td className="p-3.5 text-slate-500 font-mono">{claim.dateSubmitted}</td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        claim.status === 'Approved & Disbursed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : claim.status === 'Under Verification'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {claim.status === 'Approved & Disbursed' && <CheckCircle2 className="w-3 h-3" />}
                      {claim.status === 'Under Verification' && <Clock className="w-3 h-3" />}
                      {claim.status === 'Submitted' && <AlertCircle className="w-3 h-3" />}
                      <span>{claim.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Submission Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">File Social Security Claim</h3>
              <button
                onClick={() => setShowClaimModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Beneficiary Worker</label>
                <input
                  type="text"
                  required
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Claim Scheme</label>
                <select
                  value={claimType}
                  onChange={(e: any) => setClaimType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                >
                  <option value="Tool Kit Upgrade Subsidy">Tool Kit Upgrade Subsidy</option>
                  <option value="Ayushman Health Cover">Ayushman Health Cover</option>
                  <option value="Accident Insurance">Accident Insurance</option>
                  <option value="Emergency Medical Grant">Emergency Medical Grant</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Claim Amount (INR)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Hospital Details</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="flex-1 py-2 px-3 bg-slate-100 text-slate-600 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 py-2 px-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Claim to Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
