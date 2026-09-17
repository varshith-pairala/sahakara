import React from 'react';
import { Bell, Clock, CheckCircle2, XCircle, MapPin, Phone, Sparkles, UserCheck } from 'lucide-react';
import { BookingRecord, Language } from '../types';

interface WorkerRequestsQueueBannerProps {
  currentLang: Language;
  pendingBookings: BookingRecord[];
  onOpenRespondModal: (booking: BookingRecord) => void;
  onQuickRespond: (bookingId: string, action: 'accept' | 'reject') => void;
}

export const WorkerRequestsQueueBanner: React.FC<WorkerRequestsQueueBannerProps> = ({
  currentLang,
  pendingBookings,
  onOpenRespondModal,
  onQuickRespond,
}) => {
  if (pendingBookings.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl p-5 sm:p-6 border-2 border-amber-400/80 shadow-xl relative overflow-hidden animate-in slide-in-from-top-4 duration-300">
        {/* Glow Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900">
                  Incoming Gig Job Requests ({pendingBookings.length})
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Households have requested your verified cooperative service. Review and accept or decline below.
              </p>
            </div>
          </div>
        </div>

        {/* Requests Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl p-4 border border-amber-200 shadow-md flex flex-col justify-between text-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {booking.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {booking.serviceCategory}
                    </span>
                  </div>
                  {booking.isEmergency && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold animate-pulse">
                      SOS Emergency
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-slate-700 mb-3">
                  <div className="font-semibold text-slate-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{booking.customerName}</span>
                    </span>
                    <a
                      href={`tel:${booking.customerPhone}`}
                      className="inline-flex items-center gap-1 font-mono font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{booking.customerPhone}</span>
                    </a>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="line-clamp-1">{booking.customerAddress}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Slot: {booking.scheduledTime}</span>
                  </div>
                </div>

                {/* Earnings Highlight */}
                <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[10px] text-emerald-800 font-semibold">Your 90% Fair Payout:</div>
                    <div className="text-sm font-bold font-mono text-emerald-900">₹{booking.workerPayout}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-emerald-700">+₹{booking.welfareCess} to Welfare</div>
                    <div className="text-[9px] text-slate-500">Bill: ₹{booking.totalAmount}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  id={`queue-decline-btn-${booking.id}`}
                  onClick={() => onQuickRespond(booking.id, 'reject')}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-center flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Decline</span>
                </button>
                <button
                  type="button"
                  id={`queue-accept-btn-${booking.id}`}
                  onClick={() => onQuickRespond(booking.id, 'accept')}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accept Job</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
