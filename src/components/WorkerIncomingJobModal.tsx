import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Send,
  MessageSquare,
  Navigation,
} from 'lucide-react';
import { BookingRecord, Language } from '../types';

interface WorkerIncomingJobModalProps {
  currentLang: Language;
  booking: BookingRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onRespond: (bookingId: string, action: 'accept' | 'reject', reason?: string) => void;
}

export const WorkerIncomingJobModal: React.FC<WorkerIncomingJobModalProps> = ({
  currentLang,
  booking,
  isOpen,
  onClose,
  onRespond,
}) => {
  if (!isOpen || !booking) return null;

  const [isResponding, setIsResponding] = useState(false);
  const [declineReason, setDeclineReason] = useState('Already on scheduled gig');
  const [showDeclineOptions, setShowDeclineOptions] = useState(false);

  const handleAction = async (action: 'accept' | 'reject') => {
    setIsResponding(true);
    try {
      await onRespond(booking.id, action, action === 'reject' ? declineReason : undefined);
    } finally {
      setIsResponding(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-emerald-500/40 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Simulated Incoming Dispatch Notification Bar */}
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl mb-5 flex items-center justify-between border border-slate-800 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 animate-pulse">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <span>Cooperative Dispatch Alert</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="text-xs font-semibold text-slate-200">
                SMS & App Notification delivered to Worker
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
            ID: {booking.id}
          </span>
        </div>

        {/* Header Content */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Awaiting Your Acceptance</span>
            </span>
            <h3 className="text-xl font-bold font-serif text-slate-900 mt-1">
              New Service Request for {booking.workerName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Cooperative Society: {booking.societyName}
            </p>
          </div>
          {booking.isEmergency && (
            <span className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold animate-pulse shadow-md shadow-rose-600/30">
              🚨 15m SOS Emergency
            </span>
          )}
        </div>

        {/* Customer & Location Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 mb-5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Customer:</span>
            <span className="font-bold text-slate-900">{booking.customerName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Customer Mobile:</span>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${booking.customerPhone}`}
                className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{booking.customerPhone}</span>
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Worker Mobile:</span>
            <span className="font-mono font-medium text-slate-700">
              {booking.workerPhone || '+91 98492 11223'}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-500 font-semibold shrink-0">Address:</span>
            <div className="text-right">
              <div className="font-medium text-slate-800 flex items-center justify-end gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{booking.customerAddress}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold font-mono">
                ~1.2 km away • ~12 mins travel ETA
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-slate-500 font-semibold">Service:</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              {booking.serviceCategory}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Scheduled:</span>
            <span className="font-semibold text-slate-800">{booking.scheduledTime}</span>
          </div>
        </div>

        {/* Worker Financial Transparency Card (Strict 90/5/5 Guarantee) */}
        <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-2xl p-4 border border-emerald-800/80 space-y-2.5 mb-5 text-xs">
          <div className="flex items-center justify-between font-bold text-emerald-300 pb-2 border-b border-emerald-800/80">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Your Guaranteed Fair Earnings</span>
            </span>
            <span className="text-sm font-bold font-mono">Total: ₹{booking.totalAmount}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-300">💰 Direct Worker Payout (90%):</span>
            <span className="text-base font-bold font-mono text-emerald-400">
              ₹{booking.workerPayout}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>🩺 Deposited to your Welfare Corpus (5%):</span>
            <span className="font-mono text-emerald-300">+₹{booking.welfareCess}</span>
          </div>

          <div className="text-[10px] text-emerald-300/80 pt-1 border-t border-emerald-800/60 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>Zero private middleman commission. Direct UPI / Bank settlement upon job completion.</span>
          </div>
        </div>

        {/* Prompt question as requested: "wheather u wll accept or not annattu" */}
        <div className="text-center mb-4">
          <p className="text-xs sm:text-sm font-bold text-slate-800">
            Will you accept this service booking request?
          </p>
          <p className="text-[11px] text-slate-500">
            మీరు ఈ సర్వీస్ బుకింగ్‌ను అంగీకరిస్తారా లేదా తిరస్కరిస్తారా?
          </p>
        </div>

        {/* Decline reason dropdown if user wants to decline */}
        {showDeclineOptions && (
          <div className="mb-4 p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs">
            <label className="block font-semibold text-rose-900 mb-1">
              Select Reason for Declining:
            </label>
            <select
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full p-2 rounded-xl border border-rose-300 bg-white text-slate-900"
            >
              <option value="Already on another scheduled gig">Already on another scheduled gig</option>
              <option value="Location too far from current position">Location too far from current position</option>
              <option value="Personal emergency or off duty">Personal emergency or off duty</option>
              <option value="Toolkit / parts unavailable">Toolkit / parts unavailable</option>
            </select>
          </div>
        )}

        {/* Decision Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {!showDeclineOptions ? (
            <button
              type="button"
              id="worker-decline-btn"
              onClick={() => setShowDeclineOptions(true)}
              className="py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Decline Job</span>
            </button>
          ) : (
            <button
              type="button"
              id="worker-confirm-decline-btn"
              disabled={isResponding}
              onClick={() => handleAction('reject')}
              className="py-3 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-rose-600/20"
            >
              <XCircle className="w-4 h-4" />
              <span>Confirm Decline</span>
            </button>
          )}

          <button
            type="button"
            id="worker-accept-btn"
            disabled={isResponding}
            onClick={() => handleAction('accept')}
            className="py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-600/30 hover:scale-[1.02]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isResponding ? 'Accepting...' : 'Accept & Dispatch'}</span>
          </button>
        </div>

        {/* Close without action */}
        <div className="text-center mt-3">
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
          >
            Decide later (keep in pending queue)
          </button>
        </div>
      </div>
    </div>
  );
};
