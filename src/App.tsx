import React, { useState, useEffect } from 'react';
import {
  Language,
  UserRole,
  WorkerProfile,
  SocietyInfo,
  BookingRecord,
  WelfareClaimRecord,
  UserAccount,
} from './types';
import { t } from './translations';
import { Navbar } from './components/Navbar';
import { HeroCoopBanner } from './components/HeroCoopBanner';
import { ServiceCatalog } from './components/ServiceCatalog';
import { GeoMatchingMap } from './components/GeoMatchingMap';
import { WorkerDirectory } from './components/WorkerDirectory';
import { BookingModal } from './components/BookingModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { WorkerRegistrationModal } from './components/WorkerRegistrationModal';
import { WelfareDashboard } from './components/WelfareDashboard';
import { FederationAdminDashboard } from './components/FederationAdminDashboard';
import { AIDemandForecasting } from './components/AIDemandForecasting';
import { FairWageCalculator } from './components/FairWageCalculator';
import { InvoiceModal } from './components/InvoiceModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { AuthModal } from './components/AuthModal';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';
import { WorkerIncomingJobModal } from './components/WorkerIncomingJobModal';
import { WorkerRequestsQueueBanner } from './components/WorkerRequestsQueueBanner';
import { SIHPitchModal } from './components/SIHPitchModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  Sparkles,
  Headphones,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  FileText,
  UserPlus,
  Compass,
  TrendingUp,
  HeartHandshake,
  Layers,
  Bell,
  Clock,
  Phone,
  ArrowRight,
  Briefcase,
  MapPin,
  Calculator,
  RotateCcw,
  Check,
} from 'lucide-react';

export default function App() {
  // Default language strictly in English as requested by user
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return (localStorage.getItem('sahakarseva_lang') as Language) || 'en';
  });

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('sahakarseva_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('sahakarseva_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role) return u.role;
      } catch (e) {}
    }
    return 'citizen';
  });

  // Citizen sub-tab navigation: 'services' | 'map' | 'bookings' | 'calculator'
  const [activeCitizenTab, setActiveCitizenTab] = useState<'services' | 'map' | 'bookings' | 'calculator'>('services');
  const [highlightedBookingId, setHighlightedBookingId] = useState<string | null>(null);

  // App Onboarding Modals (default closed so user sees the real application right away)
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isSIHPitchOpen, setIsSIHPitchOpen] = useState<boolean>(false);

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Server Data States
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [societies, setSocieties] = useState<SocietyInfo[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [claims, setClaims] = useState<WelfareClaimRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Drawers
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<WorkerProfile | null>(null);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isRegisterWorkerOpen, setIsRegisterWorkerOpen] = useState<boolean>(false);
  const [workerRegLocation, setWorkerRegLocation] = useState<{ district?: string; state?: string; locality?: string; lat?: number; lng?: number } | undefined>(undefined);
  const [selectedInvoice, setSelectedInvoice] = useState<BookingRecord | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Worker Incoming Job Request modal & dispatch simulation
  const [activeWorkerPromptBooking, setActiveWorkerPromptBooking] = useState<BookingRecord | null>(null);
  const [isWorkerJobModalOpen, setIsWorkerJobModalOpen] = useState<boolean>(false);

  const strings = t[currentLang] || t.en;

  // Filter pending bookings that need worker action
  const pendingWorkerBookings = bookings.filter((b) => b.status === 'requested');

  // Fetch initial data from backend
  const fetchData = async () => {
    try {
      const [workersRes, societiesRes, bookingsRes, claimsRes] = await Promise.all([
        fetch('/api/workers'),
        fetch('/api/societies'),
        fetch('/api/bookings'),
        fetch('/api/welfare/claims'),
      ]);

      const [workersData, societiesData, bookingsData, claimsData] = await Promise.all([
        workersRes.json(),
        societiesRes.json(),
        bookingsRes.json(),
        claimsRes.json(),
      ]);

      if (Array.isArray(workersData)) setWorkers(workersData);
      if (Array.isArray(societiesData)) setSocieties(societiesData);
      if (Array.isArray(bookingsData)) setBookings(bookingsData);
      if (Array.isArray(claimsData)) setClaims(claimsData);
    } catch (err) {
      console.error('Failed to fetch platform state', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auth & Language Handlers
  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsAuthOpen(false);
    // After registration/login, user is immediately asked to select their language as requested
    setIsLanguageModalOpen(true);
    setRecentNotification(`Welcome ${user.name}! Signed in as ${user.role}.`);
    setTimeout(() => setRecentNotification(null), 6000);
  };

  const handleLanguageSelect = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('sahakarseva_lang', lang);
  };

  const handleConfirmLanguage = () => {
    setIsLanguageModalOpen(false);
    setRecentNotification(
      `Language set to ${currentLang === 'en' ? 'English' : currentLang === 'te' ? 'తెలుగు' : currentLang === 'hi' ? 'हिन्दी' : 'தமிழ்'}.`
    );
    setTimeout(() => setRecentNotification(null), 5000);
  };

  const handleSignOut = () => {
    localStorage.removeItem('sahakarseva_user');
    setCurrentUser(null);
    setIsAuthOpen(true);
  };

  // Booking Creation Handler
  const handleBookingSuccess = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);
    setSelectedWorkerForBooking(null);
    setActiveWorkerPromptBooking(newBooking);
    setActiveCitizenTab('bookings');
    setHighlightedBookingId(newBooking.id);

    setRecentNotification(
      `🎉 Booking #${newBooking.id} created! Dispatched to ${newBooking.workerName} with 90% direct fair wage.`
    );
    setTimeout(() => setRecentNotification(null), 9000);
  };

  const handleEmergencyDispatched = (emergencyBooking: BookingRecord) => {
    setBookings((prev) => [emergencyBooking, ...prev]);
    setIsEmergencyOpen(false);
    setActiveWorkerPromptBooking(emergencyBooking);
    setActiveCitizenTab('bookings');
    setHighlightedBookingId(emergencyBooking.id);

    setRecentNotification(
      `🚨 Emergency SOS Alert Dispatched! Alert delivered to worker with 15-minute SLA.`
    );
    setTimeout(() => setRecentNotification(null), 9000);
  };

  // Worker Accept / Reject Handler
  const handleWorkerRespond = async (bookingId: string, action: 'accept' | 'reject', reason?: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });

      const data = await res.json();
      if (data.booking) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? data.booking : b)));

        if (action === 'accept') {
          setRecentNotification(
            `✅ Worker ${data.booking.workerName} accepted booking ${bookingId}! Payout of ₹${data.booking.workerPayout} (90%) guaranteed.`
          );
        } else {
          setRecentNotification(
            `Booking ${bookingId} was declined by worker${reason ? ` (${reason})` : ''}. Alternate cooperative artisan matching.`
          );
        }
        setTimeout(() => setRecentNotification(null), 8000);
      }
    } catch (err) {
      console.error('Failed to respond to booking', err);
    }
  };

  const handleOpenRegisterWorker = (loc?: { district: string; state: string; locality: string; lat: number; lng: number }) => {
    setWorkerRegLocation(loc);
    setIsRegisterWorkerOpen(true);
  };

  const handleWorkerRegistered = (newWorker: WorkerProfile) => {
    setWorkers((prev) => [newWorker, ...prev.filter((w) => w.id !== newWorker.id)]);
    setActiveCitizenTab('map');
    setRecentNotification(`✅ Success! ${newWorker.name} is now registered in ${newWorker.exactLocality || newWorker.district} under ${newWorker.societyName}. Your location is live on the radar!`);
    setTimeout(() => setRecentNotification(null), 8000);
  };

  const handleSeedSamples = async (city?: string) => {
    try {
      const res = await fetch('/api/workers/seed-samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: city || 'bengaluru' }),
      });
      const data = await res.json();
      if (data.workers) {
        setWorkers(data.workers);
        setActiveCitizenTab('map');
        setRecentNotification(`✨ Loaded sample verified cooperative artisans for ${city || 'Bengaluru'}. Real registration still works alongside!`);
        setTimeout(() => setRecentNotification(null), 8000);
      }
    } catch (err) {
      console.error('Failed to seed sample workers:', err);
    }
  };

  const handleClearWorkers = async () => {
    try {
      const res = await fetch('/api/workers/clear-all', { method: 'POST' });
      await res.json();
      setWorkers([]);
      setRecentNotification('🧹 Database cleared. Zero fake or dummy workers.');
      setTimeout(() => setRecentNotification(null), 6000);
    } catch (err) {
      console.error('Failed to clear workers:', err);
    }
  };

  const handleVerifyWorker = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, isVerified: true, policeVerificationStatus: 'verified' as const } : w))
    );
    setRecentNotification(`Worker ${workerId} successfully verified and issued Federation Master Artisan Badge!`);
    setTimeout(() => setRecentNotification(null), 5000);
  };

  const handleNewClaimSubmitted = (newClaim: WelfareClaimRecord) => {
    setClaims((prev) => [newClaim, ...prev]);
    setRecentNotification(`Welfare Claim ${newClaim.id} submitted for Federation Board review.`);
    setTimeout(() => setRecentNotification(null), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageSelect}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenSOS={() => setIsEmergencyOpen(true)}
        onOpenPitch={() => setIsSIHPitchOpen(true)}
        onOpenRegister={() => setIsRegisterWorkerOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        pendingRequestsCount={pendingWorkerBookings.length}
        onOpenPendingRequests={() => {
          if (pendingWorkerBookings.length > 0) {
            setActiveWorkerPromptBooking(pendingWorkerBookings[0]);
            setIsWorkerJobModalOpen(true);
          }
        }}
        activeCitizenTab={activeCitizenTab}
        onSelectCitizenTab={setActiveCitizenTab}
        bookingsCount={bookings.length}
      />

      {/* Floating Alert / Toast Notification */}
      {recentNotification && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-emerald-950 text-white p-4 rounded-2xl shadow-2xl border border-emerald-600 flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-bold text-emerald-300">Cooperative Platform Update</div>
            <p className="mt-0.5 text-slate-100 leading-snug">{recentNotification}</p>
          </div>
          <button
            onClick={() => setRecentNotification(null)}
            className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Role Perspective Indicator Banner */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 text-center border-b border-emerald-800 font-medium flex flex-wrap items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>
          Viewing Perspective:{' '}
          <strong className="text-white uppercase tracking-wider">
            {currentRole === 'citizen' && strings.roleCitizen}
            {currentRole === 'worker' && strings.roleWorker}
            {currentRole === 'federation' && strings.roleFederation}
          </strong>
        </span>
        <span className="text-emerald-300/80">
          (Switch roles anytime from the top bar to inspect citizen, worker, and admin flows)
        </span>
      </div>

      {/* Citizen View: Interactive Sub-Navigation Bar */}
      {currentRole === 'citizen' && (
        <div className="sticky top-18 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                id="tab-citizen-services"
                onClick={() => setActiveCitizenTab('services')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCitizenTab === 'services'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Services & Directory</span>
              </button>

              <button
                type="button"
                id="tab-citizen-map"
                onClick={() => setActiveCitizenTab('map')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCitizenTab === 'map'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Artisan Radar (Map)</span>
              </button>

              <button
                type="button"
                id="tab-citizen-bookings"
                onClick={() => setActiveCitizenTab('bookings')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
                  activeCitizenTab === 'bookings'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>My Bookings & Orders</span>
                {bookings.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    activeCitizenTab === 'bookings'
                      ? 'bg-white text-emerald-900'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {bookings.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                id="tab-citizen-calculator"
                onClick={() => setActiveCitizenTab('calculator')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCitizenTab === 'calculator'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Fair Wage Calculator</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Persistent SQLite DB Connected</span>
            </div>
          </div>
        </div>
      )}

      {/* Citizen View: Floating Worker Notification Simulator Trigger */}
      {currentRole === 'citizen' && pendingWorkerBookings.length > 0 && (
        <div className="bg-amber-500/15 border-b border-amber-300/80 py-2.5 px-4 text-xs text-amber-950 font-semibold flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-amber-700 animate-bounce" />
            <span>
              Worker Alert Dispatched for <strong>{pendingWorkerBookings[0].workerName}</strong> (Booking #{pendingWorkerBookings[0].id})
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveWorkerPromptBooking(pendingWorkerBookings[0]);
              setIsWorkerJobModalOpen(true);
            }}
            className="px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs flex items-center gap-1"
          >
            <span>Simulate Worker Accept / Reject</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        {/* CITIZEN VIEW */}
        {currentRole === 'citizen' && (
          <>
            {/* Tab 1: Services & Directory */}
            {activeCitizenTab === 'services' && (
              <div className="space-y-6">
                <HeroCoopBanner
                  currentLang={currentLang}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(trade) => {
                    setSelectedCategory(trade);
                    document.getElementById('worker-directory-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onExploreServices={() => {
                    document.getElementById('services-catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onTriggerEmergency={() => setIsEmergencyOpen(true)}
                  onOpenSOS={() => setIsEmergencyOpen(true)}
                  onOpenCalculator={() => setActiveCitizenTab('calculator')}
                />

                <ServiceCatalog
                  currentLang={currentLang}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onSelectTrade={(trade) => {
                    setSelectedCategory(trade);
                    document.getElementById('worker-directory-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onBookDirect={(trade) => {
                    const match = workers.find(
                      (w) => w.trade.toLowerCase().includes(trade.toLowerCase()) && w.isVerified
                    ) || workers.find(
                      (w) => w.trade.toLowerCase().includes(trade.toLowerCase())
                    ) || workers[0];
                    if (match) {
                      setSelectedWorkerForBooking(match);
                    }
                  }}
                />

                <WorkerDirectory
                  currentLang={currentLang}
                  workers={workers}
                  onBookWorker={(w) => setSelectedWorkerForBooking(w)}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />

                {bookings.length > 0 && (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-emerald-700" />
                        <div>
                          <h4 className="text-xs font-bold text-emerald-950">You have {bookings.length} active booking(s)</h4>
                          <p className="text-[11px] text-emerald-700">Track status, contact workers, or view cooperative invoices.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveCitizenTab('bookings')}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
                      >
                        View My Bookings & Orders →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Artisan Radar Map */}
            {activeCitizenTab === 'map' && (
              <div className="pt-6 space-y-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span>Real-Time Artisan Geo-Radar</span>
                        </div>
                        <h2 className="text-xl font-bold font-serif text-slate-900">
                          Verified Cooperative Artisans in Your Cluster
                        </h2>
                        <p className="text-xs text-slate-500">
                          Directly matched from Primary Labour Cooperative Societies (LCS) within 5–10 km radius.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveCitizenTab('services')}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold self-start sm:self-center transition-colors cursor-pointer"
                      >
                        ← Back to Catalog
                      </button>
                    </div>
                  </div>
                </div>

                <GeoMatchingMap
                  currentLang={currentLang}
                  workers={workers.filter((w) => w.isVerified)}
                  onSelectWorker={(w) => setSelectedWorkerForBooking(w)}
                  onBookWorker={(w) => setSelectedWorkerForBooking(w)}
                  onRegisterArtisan={(loc) => handleOpenRegisterWorker(loc)}
                  onSeedSamples={handleSeedSamples}
                  onClearWorkers={handleClearWorkers}
                />
              </div>
            )}

            {/* Tab 3: My Bookings & Live Tracking View */}
            {activeCitizenTab === 'bookings' && (
              <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
                {/* Highlight banner if user just booked */}
                {highlightedBookingId && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white shadow-xl border border-emerald-500/50 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          🎉 Booking Request Confirmed & Persisted in SQLite Database!
                        </h3>
                        <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed">
                          Your request (<strong>#{highlightedBookingId}</strong>) has been routed to the verified labour cooperative society. 90% direct wage escrow has been recorded.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setHighlightedBookingId(null)}
                      className="text-emerald-300 hover:text-white text-xs font-bold p-1 cursor-pointer"
                      title="Dismiss notice"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Live Service Tracker</span>
                      </div>
                      <h2 className="text-2xl font-bold font-serif text-slate-900">
                        My Cooperative Bookings ({bookings.length})
                      </h2>
                      <p className="text-xs text-slate-500">
                        Real-time order statuses, artisan communication, and certified cooperative invoices.
                      </p>
                    </div>

                    <button
                      type="button"
                      id="btn-book-another-service"
                      onClick={() => setActiveCitizenTab('services')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-900/10 self-start sm:self-center"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Book Another Service</span>
                    </button>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-16 px-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">No bookings yet</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                        Support local cooperative artisans! 90% of your service payment goes directly to skilled workers with zero platform middlemen exploitation.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveCitizenTab('services')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                      >
                        Explore Verified Artisans & Book Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((bk) => (
                        <div
                          key={bk.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            highlightedBookingId === bk.id
                              ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-md'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-extrabold text-sm text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                                #{bk.id}
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold">
                                {bk.serviceCategory}
                              </span>
                              {bk.isEmergency && (
                                <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold animate-pulse">
                                  🚨 SOS Emergency (15m SLA)
                                </span>
                              )}
                            </div>

                            {/* Status Badge */}
                            <div>
                              {bk.status === 'requested' && (
                                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold animate-pulse inline-flex items-center gap-1.5 border border-amber-300">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Awaiting Worker Acceptance</span>
                                </span>
                              )}
                              {bk.status === 'confirmed' && (
                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold inline-flex items-center gap-1.5 border border-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Worker Accepted & En Route</span>
                                </span>
                              )}
                              {bk.status === 'in_progress' && (
                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold inline-flex items-center gap-1.5 border border-blue-300">
                                  <Clock className="w-3.5 h-3.5 text-blue-700" />
                                  <span>Service In Progress</span>
                                </span>
                              )}
                              {bk.status === 'completed' && (
                                <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold inline-flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Service Completed</span>
                                </span>
                              )}
                              {bk.status === 'cancelled' && (
                                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold inline-flex items-center gap-1.5 border border-rose-300">
                                  <span>Declined / Cancelled</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Multi-step Visual Tracker */}
                          <div className="py-4">
                            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                              <div className="flex flex-col items-center">
                                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-1 shadow-xs">
                                  ✓
                                </div>
                                <span className="font-semibold text-slate-800">1. Escrow Placed</span>
                                <span className="text-[10px] text-slate-400">90% fair wage safe</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 shadow-xs ${
                                  bk.status === 'confirmed' || bk.status === 'in_progress' || bk.status === 'completed'
                                    ? 'bg-emerald-600 text-white'
                                    : bk.status === 'requested'
                                    ? 'bg-amber-500 text-white animate-pulse'
                                    : 'bg-slate-200 text-slate-500'
                                }`}>
                                  {bk.status === 'confirmed' || bk.status === 'in_progress' || bk.status === 'completed' ? '✓' : '2'}
                                </div>
                                <span className="font-semibold text-slate-800">2. Artisan Assigned</span>
                                <span className="text-[10px] text-slate-400">{bk.status === 'requested' ? 'Pending reply' : 'Accepted'}</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 shadow-xs ${
                                  bk.status === 'in_progress' || bk.status === 'completed'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}>
                                  {bk.status === 'completed' ? '✓' : '3'}
                                </div>
                                <span className="font-semibold text-slate-800">3. Doorstep Service</span>
                                <span className="text-[10px] text-slate-400">{bk.scheduledTime}</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1 shadow-xs ${
                                  bk.status === 'completed'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}>
                                  4
                                </div>
                                <span className="font-semibold text-slate-800">4. Settlement</span>
                                <span className="text-[10px] text-slate-400">5% to welfare</span>
                              </div>
                            </div>
                          </div>

                          {/* Artisan & Details Breakdown */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-200/80 text-xs">
                            <div className="space-y-1">
                              <span className="text-slate-400 text-[11px] block">Assigned Artisan:</span>
                              <div className="font-bold text-slate-900 text-sm">{bk.workerName}</div>
                              <div className="text-[11px] text-slate-600">🏢 {bk.societyName}</div>
                              <div className="pt-1">
                                <a
                                  href={`tel:${bk.workerPhone || '+91 98492 11223'}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-mono font-bold transition-colors cursor-pointer"
                                  title="Call worker phone directly"
                                >
                                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{bk.workerPhone || '+91 98492 11223'}</span>
                                </a>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-slate-400 text-[11px] block">Service Slot & Location:</span>
                              <div className="font-semibold text-slate-800">⏱️ {bk.scheduledTime}</div>
                              <div className="text-slate-600 truncate max-w-xs">📍 {bk.customerAddress}</div>
                              <div className="text-slate-500">Service: {bk.serviceDescription}</div>
                            </div>

                            <div className="space-y-1 sm:text-right">
                              <span className="text-slate-400 text-[11px] block">Cooperative Payment:</span>
                              <div className="font-extrabold text-base text-slate-900 font-mono">₹{bk.totalAmount}</div>
                              <div className="text-[11px] text-emerald-700 font-semibold">
                                ✓ ₹{bk.workerPayout} (90% directly to worker)
                              </div>
                              <div className="text-[10px] text-slate-500">
                                ✓ ₹{bk.welfareCess} (5% to Welfare Fund)
                              </div>
                            </div>
                          </div>

                          {/* Card Action Controls */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-200/80">
                            <div className="flex items-center gap-2">
                              {bk.status === 'requested' && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                                    Test Artisan Response:
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleWorkerRespond(bk.id, 'accept')}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                                    title="Simulate worker accepting the booking"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Accept (Worker Sim)</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleWorkerRespond(bk.id, 'reject', 'Artisan is busy with ongoing work')}
                                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
                                    title="Simulate worker declining"
                                  >
                                    <span>Decline</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${bk.workerPhone || '+91 98492 11223'}`}
                                className="px-3 py-1.5 rounded-xl border border-emerald-600 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Call Artisan</span>
                              </a>

                              <button
                                id={`btn-view-invoice-${bk.id}`}
                                onClick={() => setSelectedInvoice(bk)}
                                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                              >
                                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Co-op Invoice</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Fair Wage & Welfare Calculator */}
            {activeCitizenTab === 'calculator' && (
              <div className="pt-6 space-y-6">
                <FairWageCalculator currentLang={currentLang} />
              </div>
            )}
          </>
        )}

        {/* WORKER VIEW */}
        {currentRole === 'worker' && (
          <div className="space-y-8 pt-6">
            {/* Worker Welcome Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Affiliated Cooperative Member Portal</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                    {strings.workerDashboardHeading || "Cooperative Worker Portal"}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
                    Every service you deliver deposits 90% straight to your account, while 5% builds your personal health, accident, and pension corpus.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    id="btn-worker-onboard-cta"
                    onClick={() => setIsRegisterWorkerOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{strings.registerAsWorker}</span>
                  </button>
                  <button
                    onClick={() => setIsAIChatOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Headphones className="w-4 h-4 text-emerald-300" />
                    <span>Sahakar Mitra Helpdesk</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Worker Incoming Requests Queue - Action Required */}
            <WorkerRequestsQueueBanner
              currentLang={currentLang}
              pendingBookings={pendingWorkerBookings}
              onOpenRespondModal={(bk) => {
                setActiveWorkerPromptBooking(bk);
                setIsWorkerJobModalOpen(true);
              }}
              onQuickRespond={(bookingId, action) => handleWorkerRespond(bookingId, action)}
            />

            {/* Welfare & Social Security Schemes Hub */}
            <WelfareDashboard
              currentLang={currentLang}
              claims={claims}
              onNewClaimSubmitted={handleNewClaimSubmitted}
            />

            {/* Economic Earnings Simulator */}
            <FairWageCalculator currentLang={currentLang} />

            {/* Worker Directory View for self comparison */}
            <WorkerDirectory
              currentLang={currentLang}
              workers={workers}
              onBookWorker={(w) => setSelectedWorkerForBooking(w)}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        )}

        {/* FEDERATION APEX ADMIN VIEW */}
        {currentRole === 'federation' && (
          <div className="space-y-8 pt-6">
            <FederationAdminDashboard
              currentLang={currentLang}
              societies={societies}
              pendingWorkers={workers.filter((w) => !w.isVerified)}
              onVerifyWorker={handleVerifyWorker}
            />

            <AIDemandForecasting currentLang={currentLang} />

            <GeoMatchingMap
              currentLang={currentLang}
              workers={workers}
              onSelectWorker={(w) => setSelectedWorkerForBooking(w)}
              onBookWorker={(w) => setSelectedWorkerForBooking(w)}
            />

            <WelfareDashboard
              currentLang={currentLang}
              claims={claims}
              onNewClaimSubmitted={handleNewClaimSubmitted}
            />
          </div>
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {/* Emergency SOS Button */}
        <button
          id="floating-sos-btn"
          onClick={() => setIsEmergencyOpen(true)}
          className="pointer-events-auto p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-2 shadow-xl shadow-rose-600/40 hover:scale-105 transition-all cursor-pointer border border-rose-500 animate-pulse"
        >
          <Zap className="w-5 h-5 fill-white" />
          <span className="hidden sm:inline">15-Min SOS Emergency</span>
        </button>

        {/* Cooperative Helpdesk Button */}
        <button
          id="floating-ai-assistant-btn"
          onClick={() => setIsAIChatOpen(true)}
          className="pointer-events-auto p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-emerald-950/40 hover:scale-105 transition-all cursor-pointer border border-emerald-600"
        >
          <Headphones className="w-5 h-5 text-emerald-300" />
          <span className="hidden sm:inline">Sahakar Helpdesk</span>
        </button>
      </div>

      {/* App Authentication Onboarding Modal */}
      <AuthModal
        currentLang={currentLang}
        isOpen={isAuthOpen}
        onSuccess={handleAuthSuccess}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        isOpen={isLanguageModalOpen}
        selectedLang={currentLang}
        onSelectLanguage={handleLanguageSelect}
        onConfirm={handleConfirmLanguage}
      />

      {/* Worker Incoming Job Alert Modal (Accept or Reject) */}
      <WorkerIncomingJobModal
        currentLang={currentLang}
        booking={activeWorkerPromptBooking}
        isOpen={isWorkerJobModalOpen}
        onClose={() => setIsWorkerJobModalOpen(false)}
        onRespond={handleWorkerRespond}
      />

      {/* SIH Jury Pitch Deck Modal */}
      <SIHPitchModal
        currentLang={currentLang}
        isOpen={isSIHPitchOpen}
        onClose={() => setIsSIHPitchOpen(false)}
      />

      {/* Regular Booking Modal */}
      <BookingModal
        currentLang={currentLang}
        worker={selectedWorkerForBooking}
        isOpen={Boolean(selectedWorkerForBooking)}
        onClose={() => setSelectedWorkerForBooking(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Emergency SOS Modal */}
      <EmergencySOSModal
        currentLang={currentLang}
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onEmergencyDispatched={handleEmergencyDispatched}
      />

      {/* Worker Registration Modal */}
      <WorkerRegistrationModal
        currentLang={currentLang}
        isOpen={isRegisterWorkerOpen}
        onClose={() => {
          setIsRegisterWorkerOpen(false);
          setWorkerRegLocation(undefined);
        }}
        societies={societies}
        onWorkerRegistered={handleWorkerRegistered}
        defaultLocation={workerRegLocation}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        currentLang={currentLang}
        booking={selectedInvoice}
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
      />

      {/* AI / Official Helpdesk Drawer */}
      <AIChatDrawer
        currentLang={currentLang}
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      {/* Native-App Mobile Bottom Navigation */}
      <MobileBottomNav
        currentRole={currentRole}
        activeCitizenTab={activeCitizenTab}
        onSelectCitizenTab={setActiveCitizenTab}
        bookingsCount={bookings.length}
        onOpenSOS={() => setIsEmergencyOpen(true)}
        onOpenWorkerModal={() => setIsRegisterWorkerOpen(true)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              🤝
            </div>
            <span className="text-white font-serif font-bold text-sm">{strings.brandName}</span>
            <span className="text-[10px] text-emerald-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              Cooperative Owned
            </span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-400">
            National Labour Cooperative Federation • Dedicated to Primary Labour Cooperative Societies & Social Security
          </div>
        </div>
      </footer>
    </div>
  );
}
