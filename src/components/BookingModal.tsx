import React, { useState } from 'react';
import { X, ShieldCheck, Calendar, Clock, CreditCard, Sparkles, CheckCircle2, QrCode, Phone, PhoneCall } from 'lucide-react';
import { WorkerProfile, BookingRecord, Language } from '../types';
import { t } from '../translations';

interface BookingModalProps {
  currentLang: Language;
  worker: WorkerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  currentLang,
  worker,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  if (!isOpen || !worker) return null;
  const strings = t[currentLang];

  const [customerName, setCustomerName] = useState('Ananya Rao');
  const [customerPhone, setCustomerPhone] = useState('+91 98490 55123');
  const [customerAddress, setCustomerAddress] = useState('Flat 304, Green Heights, Kondapur, Hyderabad');
  const [scheduledSlot, setScheduledSlot] = useState('Today (Within 45 mins)');
  const [hoursNeeded, setHoursNeeded] = useState(2);
  const [serviceDescription, setServiceDescription] = useState(`Household ${worker.trade} service`);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'RuPay' | 'Cash' | 'Escrow'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial Math - Strictly mandated cooperative model
  const totalAmount = worker.hourlyRate * hoursNeeded;
  const workerPayout = Math.round(totalAmount * 0.90);
  const welfareCess = Math.round(totalAmount * 0.05);
  const cooperativeFee = Math.round(totalAmount * 0.05);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerAddress,
          workerId: worker.id,
          serviceCategory: worker.trade,
          serviceDescription,
          scheduledTime: scheduledSlot,
          totalAmount,
          paymentMethod,
          isEmergency: false,
        }),
      });

      const data = await res.json();
      if (data.booking) {
        onBookingSuccess(data.booking);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="close-booking-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-slate-900">
              Cooperative Service Booking
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Verified Artisan from {worker.societyName}
            </p>
          </div>
        </div>

        {/* Worker Snapshot Banner */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 mb-5">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-3">
              <img
                src={worker.avatar}
                alt={worker.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-emerald-300"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{worker.name}</h4>
                <p className="text-xs text-emerald-700 font-semibold">{worker.trade}</p>
                <p className="text-[10px] text-slate-500">🏢 {worker.societyName}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-extrabold text-slate-900 font-serif">
                ₹{worker.hourlyRate}
                <span className="text-[11px] font-normal text-slate-500 font-sans"> / hr</span>
              </div>
              <div className="text-[10px] font-bold text-emerald-700">90% Direct Wage</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Worker Mobile:</span>
              <a href={`tel:${worker.phone}`} className="font-mono font-bold text-emerald-700 hover:underline">
                {worker.phone}
              </a>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              e-Shram: <strong className="text-slate-600">{worker.eShramId}</strong>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name
              </label>
              <input
                id="booking-customer-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number
              </label>
              <input
                id="booking-customer-phone"
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service Address & Landmark
            </label>
            <input
              id="booking-customer-address"
              type="text"
              required
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Duration
              </label>
              <select
                id="booking-hours-select"
                value={hoursNeeded}
                onChange={(e) => setHoursNeeded(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer"
              >
                <option value={1}>1 Hour (Standard Check/Fix)</option>
                <option value={2}>2 Hours (Standard Job)</option>
                <option value={3}>3 Hours (Extended Work)</option>
                <option value={4}>4 Hours (Half Day)</option>
                <option value={8}>8 Hours (Full Day)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Schedule Slot
              </label>
              <select
                id="booking-slot-select"
                value={scheduledSlot}
                onChange={(e) => setScheduledSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer"
              >
                <option value="Today (Within 45 mins)">Today (Within 45 mins)</option>
                <option value="Today Afternoon (2 PM - 4 PM)">Today Afternoon (2 PM - 4 PM)</option>
                <option value="Today Evening (5 PM - 7 PM)">Today Evening (5 PM - 7 PM)</option>
                <option value="Tomorrow Morning (9 AM - 11 AM)">Tomorrow Morning (9 AM - 11 AM)</option>
                <option value="Weekend Special Slot">Weekend Slot</option>
              </select>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Digital Payment & Fair Escrow
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {(['UPI', 'RuPay', 'Escrow', 'Cash'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  id={`payment-btn-${method.toLowerCase()}`}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-2 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                    paymentMethod === method
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {method === 'UPI' && '⚡ UPI QR'}
                  {method === 'RuPay' && '💳 RuPay'}
                  {method === 'Escrow' && '🔒 Escrow'}
                  {method === 'Cash' && '💵 Cash'}
                </button>
              ))}
            </div>

            {/* Realistic UPI / Escrow Interactive Widget */}
            {paymentMethod === 'UPI' && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-12 h-12 bg-white p-1 rounded-lg border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  <QrCode className="w-9 h-9 text-emerald-800" />
                </div>
                <div className="text-[11px] leading-tight">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Instant UPI Escrow Transfer</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">NPCI / BHIM</span>
                  </div>
                  <div className="text-slate-500 mt-0.5 font-mono text-[10px]">
                    VPA: <span className="text-slate-700 font-semibold">sahakar.coop@sbi</span> • Auto-disburses 90% to {worker.name} upon OTP completion.
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Escrow' && (
              <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-[11px] text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Cooperative Smart Escrow Active</strong>: Funds are locked in primary society trust account and released only when you confirm satisfaction with an OTP.
                </span>
              </div>
            )}
          </div>

          {/* Transparent Cooperative Fair Wage Breakdown Card */}
          <div className="bg-emerald-950 text-white rounded-2xl p-4 border border-emerald-800 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-emerald-300 pb-1 border-b border-emerald-800">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cooperative Transparent Invoice Breakdown</span>
              </span>
              <span>Total: ₹{totalAmount}</span>
            </div>

            <div className="flex items-center justify-between text-slate-200">
              <span>👨‍🔧 Direct Artisan Fair Wage (90%):</span>
              <span className="font-bold text-emerald-400">₹{workerPayout}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>🩺 Worker Welfare & Insurance Corpus (5%):</span>
              <span className="font-mono">₹{welfareCess}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>🏢 Cooperative Federation Ops (5%):</span>
              <span className="font-mono">₹{cooperativeFee}</span>
            </div>

            <div className="text-[10px] text-emerald-400/90 pt-1 border-t border-emerald-800/80 italic">
              💡 Zero predatory middleman cuts. You saved ~₹300 compared to private aggregator platforms!
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              id="confirm-booking-submit-btn"
              className="flex-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-900/20 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Confirming with Society...' : 'Confirm Cooperative Booking'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
