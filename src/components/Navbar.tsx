import React from 'react';
import { ShieldCheck, AlertTriangle, Globe, Headphones, User, BookOpen, LogOut, Bell, Database as DbIcon, MapPin, Briefcase, Calendar, Calculator } from 'lucide-react';
import { Language, UserRole, UserAccount } from '../types';
import { t } from '../translations';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSOS: () => void;
  onOpenPitch: () => void;
  onOpenRegister: () => void;
  onOpenAIChat: () => void;
  currentUser?: UserAccount | null;
  onSignOut?: () => void;
  onOpenLanguageModal?: () => void;
  pendingRequestsCount?: number;
  onOpenPendingRequests?: () => void;
  activeCitizenTab?: 'services' | 'map' | 'bookings' | 'calculator';
  onSelectCitizenTab?: (tab: 'services' | 'map' | 'bookings' | 'calculator') => void;
  bookingsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  currentRole,
  onRoleChange,
  onOpenSOS,
  onOpenPitch,
  onOpenRegister,
  onOpenAIChat,
  currentUser,
  onSignOut,
  onOpenLanguageModal,
  pendingRequestsCount = 0,
  onOpenPendingRequests,
  activeCitizenTab = 'services',
  onSelectCitizenTab,
  bookingsCount = 0,
}) => {
  const strings = t[currentLang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Ticker: Cooperative Pride & Live Metrics */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-700 text-white">
              SIH 2024–2025 Grand Challenge
            </span>
            <span className="hidden sm:inline font-medium">
              🇮🇳 Ministry of Cooperation Aligned • Primary Labour Cooperative Societies Network
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold bg-emerald-800/80 px-2 py-0.5 rounded">
              <DbIcon className="w-3 h-3 text-emerald-400" />
              <span>DB: SQLite Connected</span>
            </span>
            <span className="hidden md:inline">
              ⚡ <strong>1,418+</strong> Verified Artisans
            </span>
            <span className="hidden md:inline">
              🤝 <strong>90% Fair Wage</strong> Directly to Workers
            </span>
            <button
              id="nav-sih-pitch-btn"
              onClick={onOpenPitch}
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{strings.sihPitch}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">
                {strings.brandName}
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded">
                Co-Op
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden md:block">
              {strings.brandSubtitle}
            </p>
          </div>
        </div>

        {/* Center Role Navigation Switcher */}
        <div className="hidden lg:flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            id="role-btn-citizen"
            onClick={() => onRoleChange('citizen')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentRole === 'citizen'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-100 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {strings.roleCitizen}
          </button>
          <button
            id="role-btn-worker"
            onClick={() => onRoleChange('worker')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer relative ${
              currentRole === 'worker'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-100 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{strings.roleWorker}</span>
            {pendingRequestsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-bold animate-pulse">
                {pendingRequestsCount}
              </span>
            )}
          </button>
          <button
            id="role-btn-federation"
            onClick={() => onRoleChange('federation')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentRole === 'federation'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-100 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {strings.roleFederation}
          </button>
        </div>

        {/* Action Controls: Language, User Profile, SOS, Register */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1">
            <button
              id="open-language-dialog-btn"
              onClick={onOpenLanguageModal}
              title="Select Language / భాషను మార్చుకోండి"
              className="flex items-center bg-slate-100 hover:bg-slate-200/80 rounded-lg px-2.5 py-1.5 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
              <span className="font-bold">
                {currentLang === 'en' && 'English'}
                {currentLang === 'te' && 'తెలుగు'}
                {currentLang === 'hi' && 'हिन्दी'}
                {currentLang === 'ta' && 'தமிழ்'}
              </span>
            </button>
          </div>

          {/* Pending Job Alerts for Worker */}
          {pendingRequestsCount > 0 && onOpenPendingRequests && (
            <button
              id="worker-pending-alert-badge"
              onClick={onOpenPendingRequests}
              className="relative p-2 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors cursor-pointer"
              title={`${pendingRequestsCount} Incoming gig requests waiting for your acceptance`}
            >
              <Bell className="w-4 h-4 text-amber-700 animate-bounce" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {pendingRequestsCount}
              </span>
            </button>
          )}

          {/* Sahakar Mitra Helpdesk Button */}
          <button
            id="open-ai-chat-btn"
            onClick={onOpenAIChat}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Sahakar Mitra Helpdesk & Citizen Inquiries"
          >
            <Headphones className="w-3.5 h-3.5 text-emerald-700" />
            <span>Helpdesk</span>
          </button>

          {/* Direct Install PWA Button */}
          <PWAInstallButton currentLang={currentLang} />

          {/* Logged in User Profile badge */}
          {currentUser && (
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <div className="leading-tight text-left">
                <div className="font-bold text-slate-800 text-[11px] truncate max-w-[110px]">
                  {currentUser.name}
                </div>
                <div className="text-[9px] text-emerald-700 capitalize font-medium">
                  {currentUser.role}
                </div>
              </div>
              {onSignOut && (
                <button
                  id="user-sign-out-btn"
                  onClick={onSignOut}
                  title="Switch Account / Sign Out"
                  className="text-slate-400 hover:text-rose-600 ml-1 p-0.5 rounded cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* 15-Minute SOS Emergency Button */}
          <button
            id="nav-emergency-sos-btn"
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/25 transition-all animate-pulse cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SOS (15m)</span>
          </button>
        </div>
      </div>

      {/* Mobile Role Switcher Bar */}
      <div className="lg:hidden flex border-t border-slate-200 bg-slate-50 px-3 py-1.5 justify-around text-xs font-semibold">
        <button
          id="mobile-role-citizen"
          onClick={() => onRoleChange('citizen')}
          className={`px-2.5 py-1 rounded-md transition-colors ${
            currentRole === 'citizen' ? 'bg-emerald-700 text-white' : 'text-slate-600'
          }`}
        >
          {strings.roleCitizen}
        </button>
        <button
          id="mobile-role-worker"
          onClick={() => onRoleChange('worker')}
          className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
            currentRole === 'worker' ? 'bg-emerald-700 text-white' : 'text-slate-600'
          }`}
        >
          <span>{strings.roleWorker}</span>
          {pendingRequestsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-bold">
              {pendingRequestsCount}
            </span>
          )}
        </button>
        <button
          id="mobile-role-federation"
          onClick={() => onRoleChange('federation')}
          className={`px-2.5 py-1 rounded-md transition-colors ${
            currentRole === 'federation' ? 'bg-emerald-700 text-white' : 'text-slate-600'
          }`}
        >
          {strings.roleFederation}
        </button>
      </div>
    </header>
  );
};
