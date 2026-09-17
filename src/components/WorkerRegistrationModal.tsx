import React, { useState, useEffect } from 'react';
import { X, UserPlus, ShieldCheck, Sparkles, CheckCircle2, Award, FileText, MapPin, Navigation, Crosshair } from 'lucide-react';
import { WorkerProfile, SocietyInfo, Language } from '../types';
import { t } from '../translations';

interface WorkerRegistrationModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  societies: SocietyInfo[];
  onWorkerRegistered: (worker: WorkerProfile) => void;
  defaultLocation?: {
    district?: string;
    state?: string;
    locality?: string;
    lat?: number;
    lng?: number;
  };
}

export const WorkerRegistrationModal: React.FC<WorkerRegistrationModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  societies,
  onWorkerRegistered,
  defaultLocation,
}) => {
  if (!isOpen) return null;
  const strings = t[currentLang];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [trade, setTrade] = useState('Electrician');
  const [experienceYears, setExperienceYears] = useState(5);
  const [societyId, setSocietyId] = useState(societies[0]?.id || 'SOC-BLR-06');
  
  // Location States
  const [district, setDistrict] = useState(defaultLocation?.district || 'Bengaluru');
  const [state, setState] = useState(defaultLocation?.state || 'Karnataka');
  const [exactLocality, setExactLocality] = useState(defaultLocation?.locality || 'Koramangala 4th Block, Bengaluru');
  const [lat, setLat] = useState<number>(defaultLocation?.lat || 12.9352);
  const [lng, setLng] = useState<number>(defaultLocation?.lng || 77.6245);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string | null>(null);

  const [eShramId, setEShramId] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [hourlyRate, setHourlyRate] = useState(350);
  const [toolsOwned, setToolsOwned] = useState('Complete insulated tool kit, digital multimeter, safety harness');
  const [skillsList, setSkillsList] = useState('Domestic Wiring, Inverter Service, MCB Replacement');
  
  // AI Skill Certification state
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if district changes
  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    if (newDistrict === 'Bengaluru') {
      setState('Karnataka');
      setExactLocality('Koramangala, Bengaluru');
      setLat(12.9352);
      setLng(77.6245);
      const blrSoc = societies.find(s => s.district === 'Bengaluru');
      if (blrSoc) setSocietyId(blrSoc.id);
    } else if (newDistrict === 'Hyderabad') {
      setState('Telangana');
      setExactLocality('KPHB Colony / Madhapur, Hyderabad');
      setLat(17.4938);
      setLng(78.4018);
      const hydSoc = societies.find(s => s.district === 'Hyderabad');
      if (hydSoc) setSocietyId(hydSoc.id);
    } else if (newDistrict === 'Visakhapatnam') {
      setState('Andhra Pradesh');
      setExactLocality('MVP Colony, Visakhapatnam');
      setLat(17.7126);
      setLng(83.3178);
    } else if (newDistrict === 'Vijayawada') {
      setState('Andhra Pradesh');
      setExactLocality('Benz Circle, Vijayawada');
      setLat(16.5062);
      setLng(80.6480);
    } else if (newDistrict === 'Warangal') {
      setState('Telangana');
      setExactLocality('Hanamkonda, Warangal');
      setLat(17.9689);
      setLng(79.5941);
    } else if (newDistrict === 'Chennai') {
      setState('Tamil Nadu');
      setExactLocality('T. Nagar / Velachery, Chennai');
      setLat(13.0827);
      setLng(80.2707);
    } else if (newDistrict === 'Mumbai') {
      setState('Maharashtra');
      setExactLocality('Andheri East / Bandra, Mumbai');
      setLat(19.0760);
      setLng(72.8777);
    } else if (newDistrict === 'Delhi NCR') {
      setState('Delhi');
      setExactLocality('Connaught Place / Gurgaon, Delhi NCR');
      setLat(28.6139);
      setLng(77.2090);
    }
  };

  // GPS auto-locator
  const handleDetectGPS = () => {
    if (!('geolocation' in navigator)) {
      setGpsStatusMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGPS(true);
    setGpsStatusMsg('Fetching live satellite coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setLat(userLat);
        setLng(userLng);

        // Attempt reverse geocode to fetch real locality
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLng}&format=json`);
          const data = await res.json();
          const area = data.address?.suburb || data.address?.neighbourhood || data.address?.road || data.address?.city_district || 'Live Location';
          const city = data.address?.city || data.address?.town || data.address?.state_district || 'Bengaluru';
          const st = data.address?.state || state;

          setExactLocality(`${area}, ${city}`);
          if (city.toLowerCase().includes('bangalore') || city.toLowerCase().includes('bengaluru')) {
            setDistrict('Bengaluru');
            setState('Karnataka');
          } else if (city.toLowerCase().includes('hyderabad')) {
            setDistrict('Hyderabad');
            setState('Telangana');
          }
          setGpsStatusMsg(`📍 Fixed: ${area}, ${city} (${userLat.toFixed(4)}°N, ${userLng.toFixed(4)}°E)`);
        } catch {
          setExactLocality(`GPS Base Station (${userLat.toFixed(4)}°N, ${userLng.toFixed(4)}°E)`);
          setGpsStatusMsg(`📍 GPS Coordinates Fixed: ${userLat.toFixed(4)}°N, ${userLng.toFixed(4)}°E`);
        } finally {
          setIsDetectingGPS(false);
          setTimeout(() => setGpsStatusMsg(null), 6000);
        }
      },
      (err) => {
        console.warn('GPS detection failed:', err);
        setIsDetectingGPS(false);
        setGpsStatusMsg('GPS access permission denied. You can select your city manually below.');
        setTimeout(() => setGpsStatusMsg(null), 5000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Trigger Gemini AI Skill Certification
  const handleAISkillEvaluation = async () => {
    setIsAnalyzingAI(true);
    try {
      const res = await fetch('/api/ai/certify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trade,
          experienceYears,
          toolsOwned,
          trainingInstitute: "Cooperative Federation Vocational Training Center",
        }),
      });
      const data = await res.json();
      setAiEvaluation(data);
      if (data.recommendedRate) {
        setHourlyRate(data.recommendedRate);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/workers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          trade,
          experienceYears,
          societyId,
          district,
          state,
          exactLocality,
          lat,
          lng,
          eShramId: eShramId.trim() || `ESH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`,
          aadhaarMasked: aadhaarNumber.trim() ? `XXXX-XXXX-${aadhaarNumber.trim().slice(-4)}` : undefined,
          hourlyRate,
          skills: skillsList.split(',').map((s) => s.trim()).filter(Boolean),
          nsqfLevel: aiEvaluation?.skillLevel ? `NSQF ${aiEvaluation.skillLevel} (${trade})` : "NSQF Level 4 Certified",
        }),
      });

      const data = await res.json();
      if (data.worker) {
        onWorkerRegistered(data.worker);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          id="close-worker-register-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif text-slate-900">
              Cooperative Artisan Onboarding & Real KYC
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Registered artisans instantly appear on the real radar in your exact city and locality!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location & GPS Detection Block */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Work Location & Real GPS Coordinates
                </span>
              </div>
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isDetectingGPS}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isDetectingGPS ? 'animate-spin' : ''}`} />
                <span>{isDetectingGPS ? 'Detecting GPS...' : 'Auto-Detect Live GPS'}</span>
              </button>
            </div>

            {gpsStatusMsg && (
              <div className="text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 p-2 rounded-lg font-mono">
                {gpsStatusMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  City / District *
                </label>
                <select
                  id="reg-worker-district"
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-white rounded-xl focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Bengaluru">Bengaluru (Bangalore), Karnataka</option>
                  <option value="Hyderabad">Hyderabad, Telangana</option>
                  <option value="Visakhapatnam">Visakhapatnam, Andhra Pradesh</option>
                  <option value="Vijayawada">Vijayawada, Andhra Pradesh</option>
                  <option value="Warangal">Warangal, Telangana</option>
                  <option value="Chennai">Chennai, Tamil Nadu</option>
                  <option value="Mumbai">Mumbai, Maharashtra</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Exact Locality / Street Address *
                </label>
                <input
                  id="reg-worker-locality"
                  type="text"
                  required
                  value={exactLocality}
                  onChange={(e) => setExactLocality(e.target.value)}
                  placeholder="e.g. Koramangala 5th Block / Indiranagar"
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-white rounded-xl focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              <span>Coordinates: <strong className="font-mono text-emerald-400">{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</strong></span>
              <span>State: <strong className="text-slate-200">{state}</strong></span>
            </div>
          </div>

          {/* Personal KYC Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Artisan Full Name *
              </label>
              <input
                id="reg-worker-name"
                type="text"
                required
                value={name}
                placeholder="e.g. K. Narayana Swamy"
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile / WhatsApp Number *
              </label>
              <input
                id="reg-worker-phone"
                type="text"
                required
                value={phone}
                placeholder="+91 98801 23456"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Skilled Trade *
              </label>
              <select
                id="reg-worker-trade"
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer"
              >
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Domestic Helper & Cook">Domestic Helper & Cook</option>
                <option value="Caregiver & Elderly Support">Caregiver & Elderly Support</option>
                <option value="Appliance Technician">Appliance Technician</option>
                <option value="Gardener & Landscaper">Gardener & Landscaper</option>
                <option value="Deep Cleaning Specialist">Deep Cleaning Specialist</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Years of Professional Experience
              </label>
              <input
                id="reg-worker-exp"
                type="number"
                min={1}
                max={40}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Society Selection & e-Shram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Affiliated Labour Cooperative Society (LCS) *
              </label>
              <select
                id="reg-worker-society"
                value={societyId}
                onChange={(e) => setSocietyId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer"
              >
                {societies.map((soc) => (
                  <option key={soc.id} value={soc.id}>
                    {soc.name} ({soc.district})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aadhaar Number (Last 4 Digits for Verification)
              </label>
              <input
                id="reg-worker-aadhaar"
                type="text"
                maxLength={4}
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 8492"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skills & Specialties (comma separated)
            </label>
            <input
              id="reg-worker-skills"
              type="text"
              value={skillsList}
              onChange={(e) => setSkillsList(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          {/* AI Skill Profiling Trigger Banner */}
          <div className="bg-violet-50 rounded-2xl p-4 border border-violet-200">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-violet-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span>AI Skill Profiling & Federation Badge Evaluation (Gemini 3.8)</span>
              </div>
              <button
                type="button"
                id="btn-trigger-ai-certify"
                onClick={handleAISkillEvaluation}
                disabled={isAnalyzingAI}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                {isAnalyzingAI ? 'Evaluating with Gemini...' : 'Analyze Credentials'}
              </button>
            </div>

            {aiEvaluation ? (
              <div className="bg-white p-3 rounded-xl border border-violet-100 mt-2 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-violet-950">
                  <span>Suggested Badge: 🏅 {aiEvaluation.recommendedBadge}</span>
                  <span className="text-emerald-700 font-bold">
                    Rec. Rate: ₹{aiEvaluation.recommendedRate}/hr
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Competency Grade: <strong>{aiEvaluation.skillLevel}</strong> • Safety Rating: <strong>{aiEvaluation.safetyRating}</strong>
                </div>
                <div className="text-[10px] text-violet-700 italic">
                  💡 Recommendation: {aiEvaluation.upskillRecommendation}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-violet-700">
                Our Gemini AI assesses your trade experience, tools, and past jobs to award official Federation Badges: Master Artisan, Certified Craftsman, or Verified Specialist.
              </p>
            )}
          </div>

          {/* Declarations */}
          <div className="space-y-1.5 text-xs text-slate-600 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked required className="rounded text-emerald-600" />
              <span>I confirm active membership in my local Primary Labour Cooperative Society.</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked required className="rounded text-emerald-600" />
              <span>I agree to 90% direct payout and 5% contribution to Worker Health & Pension Corpus.</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-3">
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
              id="submit-worker-registration-btn"
              className="flex-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-900/20 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering with Federation...' : 'Submit Cooperative KYC'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
