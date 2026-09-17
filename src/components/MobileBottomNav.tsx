import React from 'react';
import { Briefcase, MapPin, Calendar, Calculator, AlertTriangle, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface MobileBottomNavProps {
  currentRole: UserRole;
  activeCitizenTab: 'services' | 'map' | 'bookings' | 'calculator';
  onSelectCitizenTab: (tab: 'services' | 'map' | 'bookings' | 'calculator') => void;
  bookingsCount: number;
  onOpenSOS: () => void;
  onOpenWorkerModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRole,
  activeCitizenTab,
  onSelectCitizenTab,
  bookingsCount,
  onOpenSOS,
}) => {
  if (currentRole !== 'citizen') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl md:hidden pb-safe">
      <div className="grid grid-cols-5 h-15 items-center px-1">
        {/* Services Tab */}
        <button
          type="button"
          onClick={() => onSelectCitizenTab('services')}
          className={`flex flex-col items-center justify-center gap-0.5 w-full h-full cursor-pointer transition-colors ${
            activeCitizenTab === 'services'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeCitizenTab === 'services' ? 'bg-emerald-100/70 text-emerald-800' : ''}`}>
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-none">Services</span>
        </button>

        {/* Map Tab */}
        <button
          type="button"
          onClick={() => onSelectCitizenTab('map')}
          className={`flex flex-col items-center justify-center gap-0.5 w-full h-full cursor-pointer transition-colors ${
            activeCitizenTab === 'map'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeCitizenTab === 'map' ? 'bg-emerald-100/70 text-emerald-800' : ''}`}>
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-none">Radar Map</span>
        </button>

        {/* SOS Center Action */}
        <div className="flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={onOpenSOS}
            className="-mt-5 w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/40 flex items-center justify-center cursor-pointer active:scale-95 transition-transform border-2 border-white"
            title="Emergency SOS Dispatch"
          >
            <AlertTriangle className="w-5 h-5 text-white" />
          </button>
          <span className="text-[9px] font-bold text-rose-700 leading-none mt-1">SOS</span>
        </div>

        {/* Bookings Tab */}
        <button
          type="button"
          onClick={() => onSelectCitizenTab('bookings')}
          className={`flex flex-col items-center justify-center gap-0.5 w-full h-full cursor-pointer transition-colors relative ${
            activeCitizenTab === 'bookings'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all relative ${activeCitizenTab === 'bookings' ? 'bg-emerald-100/70 text-emerald-800' : ''}`}>
            <Calendar className="w-5 h-5" />
            {bookingsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center">
                {bookingsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-none">Orders</span>
        </button>

        {/* Calculator Tab */}
        <button
          type="button"
          onClick={() => onSelectCitizenTab('calculator')}
          className={`flex flex-col items-center justify-center gap-0.5 w-full h-full cursor-pointer transition-colors ${
            activeCitizenTab === 'calculator'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeCitizenTab === 'calculator' ? 'bg-emerald-100/70 text-emerald-800' : ''}`}>
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-none">Rates</span>
        </button>
      </div>
    </div>
  );
};
