import React, { useState } from 'react';
import { ShieldCheck, Star, MapPin, Clock, Award, CheckCircle, Search, Filter, Phone, PhoneCall, Copy, Check } from 'lucide-react';
import { WorkerProfile, Language } from '../types';
import { t } from '../translations';

interface WorkerDirectoryProps {
  currentLang: Language;
  workers: WorkerProfile[];
  onBookWorker: (worker: WorkerProfile) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export const WorkerDirectory: React.FC<WorkerDirectoryProps> = ({
  currentLang,
  workers,
  onBookWorker,
  selectedCategory,
  onCategoryChange,
}) => {
  const strings = t[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [badgeFilter, setBadgeFilter] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPhone = (id: string, phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredWorkers = workers.filter((worker) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      worker.trade.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesSearch =
      searchTerm === '' ||
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.societyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDistrict =
      districtFilter === 'All' || worker.district.toLowerCase() === districtFilter.toLowerCase();

    const matchesBadge = badgeFilter === 'All' || worker.skillBadge === badgeFilter;

    return matchesCategory && matchesSearch && matchesDistrict && matchesBadge;
  });

  return (
    <section id="worker-directory-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cooperative Federation Verified Registry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            {strings.nearbyWorkers}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Showing {filteredWorkers.length} certified artisans with regulated cooperative wages.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="worker-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={strings.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 shadow-xs"
            />
          </div>

          {/* District Select */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs text-xs font-medium text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              id="worker-district-filter"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-transparent text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Districts</option>
              <option value="Bengaluru">Bengaluru (Bangalore)</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Ranga Reddy">Ranga Reddy</option>
              <option value="Visakhapatnam">Visakhapatnam</option>
              <option value="Vijayawada">Vijayawada</option>
              <option value="Warangal">Warangal</option>
              <option value="Chennai">Chennai</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi NCR">Delhi NCR</option>
            </select>
          </div>

          {/* Badge Filter */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs text-xs font-medium text-slate-700">
            <select
              id="worker-badge-filter"
              value={badgeFilter}
              onChange={(e) => setBadgeFilter(e.target.value)}
              className="bg-transparent text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Badges</option>
              <option value="Master Artisan">Master Artisan</option>
              <option value="Certified Craftsman">Certified Craftsman</option>
              <option value="Verified Specialist">Verified Specialist</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workers Grid */}
      {filteredWorkers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <p className="text-sm font-semibold">No cooperative artisans match the selected criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setDistrictFilter('All');
              setBadgeFilter('All');
              onCategoryChange('All');
            }}
            className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              id={`worker-card-${worker.id}`}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Header: Avatar, Name, Badge, Rating */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="relative">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-100"
                    />
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-600 text-white text-[9px]">
                      <ShieldCheck className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {worker.name}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{worker.rating}</span>
                        <span className="text-slate-400 text-[10px]">({worker.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-emerald-700 truncate">
                      {worker.trade}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate font-medium">{worker.exactLocality || `${worker.district}, ${worker.state}`}</span>
                    </div>
                  </div>
                </div>

                {/* Cooperative Society & Government Verification Badge */}
                <div className="bg-emerald-50/70 rounded-xl p-2.5 border border-emerald-200/80 mb-3 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between text-emerald-950 font-semibold">
                    <span className="truncate">🏢 {worker.societyName}</span>
                    <span className="shrink-0 px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded font-mono text-[9px] font-bold">
                      {worker.coopMemberId ? `ID: ${worker.coopMemberId}` : 'KYC Verified ✓'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-emerald-800 pt-1 border-t border-emerald-200/60 font-mono">
                    <div title="UIDAI Aadhaar Verification Status">
                      🆔 {worker.aadhaarMasked ? `Aadhaar: ${worker.aadhaarMasked}` : `e-Shram: ${worker.eShramId}`}
                    </div>
                    <div className="text-right text-emerald-700" title="State Police Verification Clearance">
                      🛡️ {worker.policeCertNumber ? `Police: ${worker.policeCertNumber.slice(-8)}` : 'Police Cleared ✓'}
                    </div>
                  </div>

                  {worker.nsqfLevel && (
                    <div className="text-[9.5px] text-emerald-900 font-sans font-medium flex items-center gap-1 pt-0.5">
                      <span>🏅</span>
                      <span className="truncate">{worker.nsqfLevel}</span>
                    </div>
                  )}
                </div>

                {/* Major Detail: Worker Mobile Number & Direct Calling */}
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/90 mb-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Direct Mobile:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${worker.phone}`}
                        className="font-mono font-bold text-emerald-700 hover:text-emerald-900 hover:underline tracking-wide text-xs"
                        title="Click to dial mobile number"
                      >
                        {worker.phone}
                      </a>
                      <button
                        type="button"
                        onClick={(e) => handleCopyPhone(worker.id, worker.phone, e)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Copy mobile number"
                      >
                        {copiedId === worker.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-200/60">
                    <span>Direct Artisan Dial</span>
                    <span className="text-emerald-700 font-semibold font-mono">Verified Active ✓</span>
                  </div>
                </div>

                {/* Key Stat Badges */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center mb-3">
                  <div>
                    <div className="text-[10px] text-slate-400">Experience</div>
                    <div className="text-xs font-bold text-slate-800">{worker.experienceYears} Yrs</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Gigs Done</div>
                    <div className="text-xs font-bold text-slate-800">{worker.completedJobs}+</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Fair Rate</div>
                    <div className="text-xs font-bold text-emerald-700">₹{worker.hourlyRate}/hr</div>
                  </div>
                </div>

                {/* Verified Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {worker.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Direct Call & Book Service */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <a
                  id={`btn-call-worker-${worker.id}`}
                  href={`tel:${worker.phone}`}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold border border-emerald-600 text-emerald-800 hover:bg-emerald-50 flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Call Worker</span>
                </a>
                <button
                  id={`btn-book-worker-${worker.id}`}
                  onClick={() => onBookWorker(worker)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs text-center"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{strings.bookService}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
