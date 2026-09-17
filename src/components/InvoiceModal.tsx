import React from 'react';
import { X, Printer, ShieldCheck, Download, CheckCircle2, Phone } from 'lucide-react';
import { BookingRecord, Language } from '../types';
import { t } from '../translations';

interface InvoiceModalProps {
  currentLang: Language;
  booking: BookingRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  currentLang,
  booking,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !booking) return null;
  const strings = t[currentLang];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          id="close-invoice-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Header */}
        <div className="border-b border-slate-200 pb-5 mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold font-serif text-slate-900">
                {strings.brandName}
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Registered Labour Cooperative Federation • Govt of India Co-Op Act
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Society Reg: TS/HYD/COOP/2018/104 • GST Exempt Co-Op Society
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              {booking.paymentStatus === 'paid' ? 'Paid in Full' : 'Escrow Secured'}
            </span>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">
              {booking.id}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {new Date(booking.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Parties Details */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Customer / Household
            </div>
            <div className="font-bold text-slate-900 mt-0.5">{booking.customerName}</div>
            <div className="text-slate-600 font-mono text-[11px]">{booking.customerPhone}</div>
            <div className="text-slate-500 text-[10px] mt-0.5">{booking.customerAddress}</div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Cooperative Artisan
            </div>
            <div className="font-bold text-slate-900 mt-0.5">{booking.workerName}</div>
            <div className="text-emerald-700 font-semibold text-[11px]">{booking.workerTrade}</div>
            <div className="text-slate-700 font-mono text-[11px] flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>{booking.workerPhone || '+91 98492 11223'}</span>
            </div>
            <div className="text-slate-500 text-[10px] mt-0.5">{booking.societyName}</div>
          </div>
        </div>

        {/* Itemized Service Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden mb-5 text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Service Description</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-3">
                  <div className="font-bold text-slate-900">{booking.serviceCategory}</div>
                  <div className="text-[11px] text-slate-500">{booking.serviceDescription}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Slot: {booking.scheduledTime}</div>
                </td>
                <td className="p-3 text-right font-bold text-slate-900 font-mono">
                  ₹{booking.totalAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cooperative Transparent Breakdown */}
        <div className="bg-emerald-950 text-white rounded-2xl p-4 border border-emerald-800 space-y-2 text-xs mb-6">
          <div className="text-[11px] font-bold text-emerald-300 pb-1 border-b border-emerald-800 uppercase tracking-wider">
            Mandated Cooperative Transparency Disclosure
          </div>

          <div className="flex justify-between items-center text-slate-200">
            <span>Direct Artisan Fair Payout (90%):</span>
            <span className="font-bold text-emerald-400 font-mono">₹{booking.workerPayout.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span>Worker Welfare & Mediclaim Corpus (5%):</span>
            <span className="font-mono">₹{booking.welfareCess.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span>Labour Cooperative Operations (5%):</span>
            <span className="font-mono">₹{booking.cooperativeFee.toFixed(2)}</span>
          </div>

          <div className="pt-2 border-t border-emerald-800/80 flex justify-between items-center font-bold text-sm">
            <span>Total Invoiced Amount:</span>
            <span className="text-emerald-400 font-mono">₹{booking.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
