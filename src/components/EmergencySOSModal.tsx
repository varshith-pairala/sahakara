import React, { useState } from 'react';
import { X, AlertTriangle, Zap, Clock, ShieldAlert, PhoneCall, CheckCircle2 } from 'lucide-react';
import { BookingRecord, Language } from '../types';
import { t } from '../translations';

interface EmergencySOSModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  onEmergencyDispatched: (booking: BookingRecord) => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  onEmergencyDispatched,
}) => {
  if (!isOpen) return null;
  const strings = t[currentLang];

  const [emergencyType, setEmergencyType] = useState('Severe Water Pipe Burst / Flooding');
  const [address, setAddress] = useState('Road No. 10, Banjara Hills / Hitec City, Hyderabad');
  const [phone, setPhone] = useState('+91 98491 88990');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  const emergencyOptions = [
    { title: "Severe Water Pipe Burst / Flooding", trade: "Plumber", icon: "🌊", sla: "12 mins" },
    { title: "Electrical Short-Circuit / Burning Smell", trade: "Electrician", icon: "⚡", sla: "10 mins" },
    { title: "Urgent Elderly Fall / Medical Mobility Care", trade: "Caregiver & Elderly Support", icon: "🩺", sla: "15 mins" },
    { title: "Broken Main Door Lock / Locked Out Hazard", trade: "Carpenter", icon: "🔑", sla: "15 mins" },
  ];

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);

    const matchedTrade = emergencyOptions.find(o => o.title === emergencyType)?.trade || "Plumber";

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: "SOS Urgent Citizen",
          customerPhone: phone,
          customerAddress: address,
          serviceCategory: matchedTrade,
          serviceDescription: `🚨 EMERGENCY SOS: ${emergencyType}`,
          scheduledTime: "Immediate SOS Dispatch",
          totalAmount: 650,
          paymentMethod: 'Escrow',
          isEmergency: true,
        }),
      });

      const data = await res.json();
      setIsDispatching(false);
      setDispatchedSuccess(true);
      if (data.booking) {
        setTimeout(() => {
          onEmergencyDispatched(data.booking);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setIsDispatching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-rose-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          id="close-sos-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SOS Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 animate-pulse">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-rose-600">
              <Zap className="w-3.5 h-3.5 fill-rose-600" />
              <span>15-Minute Guaranteed Response SLA</span>
            </div>
            <h3 className="text-xl font-extrabold font-serif text-slate-900">
              {strings.emergencyHeading}
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          {strings.emergencyDesc}
        </p>

        {dispatchedSuccess ? (
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-emerald-950">
              🚨 Nearest Cooperative Unit Dispatched!
            </h4>
            <p className="text-xs text-emerald-800">
              Mohammad Farooq (Master Artisan, 1.2 km away) has accepted the alert. Estimated arrival: <strong>11 minutes</strong>.
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-200 max-w-sm mx-auto flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Artisan Mobile:</span>
              <a href="tel:+919654321098" className="font-mono font-bold text-emerald-700 flex items-center gap-1 hover:underline">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>+91 96543 21098</span>
              </a>
            </div>
            <div className="text-[11px] font-mono text-emerald-700 bg-white py-1 px-3 rounded-lg border border-emerald-200 inline-block">
              Emergency Booking Reference: BK-SOS-882
            </div>
          </div>
        ) : (
          <form onSubmit={handleDispatch} className="space-y-4">
            {/* Emergency Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Select Critical Emergency Type
              </label>
              <div className="space-y-2">
                {emergencyOptions.map((opt) => (
                  <label
                    key={opt.title}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      emergencyType === opt.title
                        ? 'border-rose-500 bg-rose-50/70 text-slate-900 font-semibold ring-2 ring-rose-500/20'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="emergencyType"
                        checked={emergencyType === opt.title}
                        onChange={() => setEmergencyType(opt.title)}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-base">{opt.icon}</span>
                      <span>{opt.title}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md shrink-0">
                      ETA: {opt.sla}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Address & Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Exact Location
              </label>
              <input
                id="sos-address-input"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Contact Phone
              </label>
              <input
                id="sos-phone-input"
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-rose-500 font-mono"
              />
            </div>

            {/* Emergency Guarantee Badge */}
            <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center gap-3 text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-300">Cooperative Emergency Protocol:</span>
                <p className="text-[11px] text-slate-300">
                  Fixed emergency tariff ₹650. Worker receives ₹585 immediately upon verification.
                </p>
              </div>
            </div>

            {/* Submit SOS Button */}
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
                disabled={isDispatching}
                id="confirm-sos-dispatch-btn"
                className="flex-2 py-3 px-4 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{isDispatching ? 'Broadcasting to Nearest Node...' : 'DISPATCH SOS EMERGENCY NOW'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
