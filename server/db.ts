import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "sahakarseva.sqlite");
const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for performance and concurrent read safety
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    district TEXT NOT NULL,
    worker_trade TEXT,
    society_name TEXT,
    worker_id TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS societies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    reg_number TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    president_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    workers_count INTEGER DEFAULT 0,
    active_jobs_count INTEGER DEFAULT 0,
    welfare_corpus_fund REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS workers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    trade TEXT NOT NULL,
    experience_years INTEGER DEFAULT 1,
    society_id TEXT NOT NULL,
    society_name TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    e_shram_id TEXT NOT NULL,
    rating REAL DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    completed_jobs INTEGER DEFAULT 0,
    hourly_rate REAL DEFAULT 300,
    is_verified INTEGER DEFAULT 1,
    kyc_status TEXT DEFAULT 'verified',
    skill_badge TEXT DEFAULT 'Verified Specialist',
    police_verified INTEGER DEFAULT 1,
    insurance_active INTEGER DEFAULT 1,
    available INTEGER DEFAULT 1,
    avatar TEXT,
    skills TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    exact_locality TEXT,
    aadhaar_masked TEXT,
    nsqf_level TEXT,
    police_cert_number TEXT,
    police_cert_date TEXT,
    coop_member_id TEXT,
    is_sample INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    worker_id TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    worker_phone TEXT,
    worker_trade TEXT NOT NULL,
    society_name TEXT NOT NULL,
    service_category TEXT NOT NULL,
    service_description TEXT,
    scheduled_time TEXT NOT NULL,
    is_emergency INTEGER DEFAULT 0,
    status TEXT NOT NULL,
    total_amount REAL NOT NULL,
    worker_payout REAL NOT NULL,
    welfare_cess REAL NOT NULL,
    cooperative_fee REAL NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    eta_minutes INTEGER DEFAULT 45
  );

  CREATE TABLE IF NOT EXISTS welfare_claims (
    id TEXT PRIMARY KEY,
    worker_id TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    claim_type TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL,
    date_submitted TEXT NOT NULL,
    society_name TEXT NOT NULL,
    description TEXT
  );
`);

// Safe column migrations for existing databases
const migrations = [
  "ALTER TABLE workers ADD COLUMN exact_locality TEXT;",
  "ALTER TABLE workers ADD COLUMN aadhaar_masked TEXT;",
  "ALTER TABLE workers ADD COLUMN nsqf_level TEXT;",
  "ALTER TABLE workers ADD COLUMN police_cert_number TEXT;",
  "ALTER TABLE workers ADD COLUMN police_cert_date TEXT;",
  "ALTER TABLE workers ADD COLUMN coop_member_id TEXT;",
  "ALTER TABLE workers ADD COLUMN is_sample INTEGER DEFAULT 0;",
];

for (const sql of migrations) {
  try {
    db.exec(sql);
  } catch {
    // Column already exists, ignore
  }
}

// Types matching application domain
export interface DbUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password?: string;
  role: 'citizen' | 'worker' | 'federation';
  district: string;
  workerTrade?: string;
  societyName?: string;
  workerId?: string;
  createdAt?: string;
}

export interface DbWorker {
  id: string;
  name: string;
  phone: string;
  trade: string;
  experienceYears: number;
  societyId: string;
  societyName: string;
  district: string;
  state: string;
  eShramId: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  hourlyRate: number;
  isVerified: boolean;
  kycStatus: 'verified' | 'pending' | 'rejected';
  skillBadge: 'Master Artisan' | 'Certified Craftsman' | 'Verified Specialist' | 'Apprentice';
  policeVerified: boolean;
  insuranceActive: boolean;
  available: boolean;
  avatar: string;
  skills: string[];
  lat: number;
  lng: number;
  exactLocality?: string;
  aadhaarMasked?: string;
  nsqfLevel?: string;
  policeCertNumber?: string;
  policeCertDate?: string;
  coopMemberId?: string;
  isSample?: boolean;
}

export interface DbSociety {
  id: string;
  name: string;
  regNumber: string;
  district: string;
  state: string;
  presidentName: string;
  contactNumber: string;
  workersCount: number;
  activeJobsCount: number;
  welfareCorpusFund: number;
}

export interface DbBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  workerId: string;
  workerName: string;
  workerPhone?: string;
  workerTrade: string;
  societyName: string;
  serviceCategory: string;
  serviceDescription: string;
  scheduledTime: string;
  isEmergency: boolean;
  status: 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  workerPayout: number;
  welfareCess: number;
  cooperativeFee: number;
  paymentMethod: 'UPI' | 'RuPay' | 'Cash' | 'Escrow';
  paymentStatus: 'paid' | 'pending' | 'escrowed';
  rating?: number;
  review?: string;
  createdAt: string;
  etaMinutes?: number;
}

export interface DbWelfareClaim {
  id: string;
  workerId: string;
  workerName: string;
  claimType: 'Ayushman Health Cover' | 'Accident Insurance' | 'Emergency Medical Grant' | 'Maternity / Child Support' | 'Tool Kit Upgrade Subsidy';
  amount: number;
  status: 'Approved & Disbursed' | 'Under Verification' | 'Submitted';
  dateSubmitted: string;
  societyName: string;
  description: string;
}

// Seed initial data if tables are empty
function seedDatabaseIfEmpty() {
  const userCount = (db.prepare("SELECT COUNT(*) as count FROM users").get() as any)?.count || 0;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, phone, email, password_hash, role, district, worker_trade, society_name, worker_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      "USR-001",
      "Ravi Kumar",
      "+91 98490 55123",
      "ravi.citizen@example.com",
      "password123",
      "citizen",
      "Hyderabad",
      null,
      null,
      null,
      new Date().toISOString()
    );

    insertUser.run(
      "USR-002",
      "K. Lakshmi Bai",
      "+91 98492 11223",
      "lakshmi.worker@example.com",
      "password123",
      "worker",
      "Hyderabad",
      "Electrician",
      "Cyberabad Electricians & Technicians Labour Cooperative",
      "WRK-101",
      new Date().toISOString()
    );

    insertUser.run(
      "USR-003",
      "Sri P. Ramana Murthy",
      "+91 98499 99999",
      "admin.federation@sahakarseva.gov.in",
      "password123",
      "federation",
      "Hyderabad HQ",
      null,
      null,
      null,
      new Date().toISOString()
    );
  }

  const socCount = (db.prepare("SELECT COUNT(*) as count FROM societies").get() as any)?.count || 0;
  if (socCount === 0) {
    const insertSoc = db.prepare(`
      INSERT INTO societies (id, name, reg_number, district, state, president_name, contact_number, workers_count, active_jobs_count, welfare_corpus_fund)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertSoc.run(
      "SOC-HYD-01",
      "Telangana Shramik Sahakara Sangham (LCS-104)",
      "TS/HYD/COOP/2018/104",
      "Hyderabad",
      "Telangana",
      "R. Venkatesh Goud",
      "+91 98490 23145",
      340,
      42,
      1845000
    );

    insertSoc.run(
      "SOC-RR-02",
      "Ranga Reddy District Kaarmika Cooperative Society",
      "TS/RR/COOP/2019/088",
      "Ranga Reddy",
      "Telangana",
      "K. Sujatha Bai",
      "+91 98494 88712",
      215,
      28,
      1120000
    );

    insertSoc.run(
      "SOC-VIZ-03",
      "Visakhapatnam Industrial Labour Cooperative Federation",
      "AP/VSP/FED/2017/042",
      "Visakhapatnam",
      "Andhra Pradesh",
      "M. Appalaraju",
      "+91 98481 99201",
      410,
      56,
      2450000
    );

    insertSoc.run(
      "SOC-VIJ-04",
      "Krishna District Artisans & Helpers Sahakara Sangham",
      "AP/KRI/COOP/2020/215",
      "Vijayawada",
      "Andhra Pradesh",
      "B. Nageswara Rao",
      "+91 99890 44321",
      285,
      33,
      1475000
    );

    insertSoc.run(
      "SOC-WAR-05",
      "Kakatiya Shramik Labour Cooperative Society",
      "TS/WGL/COOP/2021/019",
      "Warangal",
      "Telangana",
      "T. Rajender",
      "+91 97001 88432",
      175,
      19,
      890000
    );

    insertSoc.run(
      "SOC-BLR-06",
      "Bengaluru Labour Cooperatives Union & Artisans Guild (LCS-201)",
      "KA/BLR/COOP/2021/201",
      "Bengaluru",
      "Karnataka",
      "S. Manjunatha Gowda",
      "+91 98801 23456",
      260,
      35,
      1650000
    );
  }

  // NOTE: In accordance with user requirements for authentic registrations,
  // we do NOT auto-seed fake workers by default. Workers are populated only when
  // real users register, or when demo sample data is explicitly loaded for evaluation.

  const bookingCount = (db.prepare("SELECT COUNT(*) as count FROM bookings").get() as any)?.count || 0;
  if (bookingCount === 0) {
    const insertBk = db.prepare(`
      INSERT INTO bookings (
        id, customer_name, customer_phone, customer_address, worker_id, worker_name, worker_phone,
        worker_trade, society_name, service_category, service_description, scheduled_time,
        is_emergency, status, total_amount, worker_payout, welfare_cess, cooperative_fee,
        payment_method, payment_status, created_at, eta_minutes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBk.run(
      "BK-8291",
      "V. Ramesh Babu",
      "+91 98480 11223",
      "Plot 44, Madhapur, Cyberabad",
      "WRK-101",
      "G. Ravi Kumar",
      "+91 98765 43210",
      "Electrician",
      "Telangana Shramik Sahakara Sangham",
      "Electrician",
      "3-Phase main distribution board tripping inspection and inverter rewiring",
      "Today, 2:30 PM",
      0,
      "confirmed",
      525,
      472.5,
      26.25,
      26.25,
      "UPI",
      "paid",
      new Date(Date.now() - 3600000).toISOString(),
      25
    );

    insertBk.run(
      "BK-8292",
      "S. Padmavathi",
      "+91 99890 33445",
      "Flat 202, Banjara Hills Rd 12, Hyderabad",
      "WRK-102",
      "B. Lakshmi Bai",
      "+91 97654 32109",
      "Domestic Helper & Cook",
      "Telangana Shramik Sahakara Sangham",
      "Domestic Helper & Cook",
      "Traditional South Indian festive meal preparation and kitchen deep clean",
      "Tomorrow, 8:00 AM",
      0,
      "requested",
      560,
      504,
      28,
      28,
      "RuPay",
      "paid",
      new Date(Date.now() - 7200000).toISOString(),
      45
    );

    insertBk.run(
      "BK-8290",
      "Dr. Anjaneyulu",
      "+91 94401 55667",
      "Gachibowli Near ORR Junction, Hyderabad",
      "WRK-103",
      "M. Chandraiah",
      "+91 96543 21098",
      "Plumber",
      "Ranga Reddy District Kaarmika Cooperative Society",
      "Plumber",
      "Emergency overhead water pump pipeline burst and bathroom drainage overflow",
      "Immediate SOS (15 Min Response)",
      1,
      "completed",
      640,
      576,
      32,
      32,
      "UPI",
      "paid",
      new Date(Date.now() - 86400000).toISOString(),
      0
    );
  }

  const claimCount = (db.prepare("SELECT COUNT(*) as count FROM welfare_claims").get() as any)?.count || 0;
  if (claimCount === 0) {
    const insertClaim = db.prepare(`
      INSERT INTO welfare_claims (id, worker_id, worker_name, claim_type, amount, status, date_submitted, society_name, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertClaim.run(
      "CLM-901",
      "WRK-103",
      "M. Chandraiah",
      "Ayushman Health Cover",
      15000,
      "Approved & Disbursed",
      "2025-02-10",
      "Ranga Reddy District Kaarmika Cooperative Society",
      "Knee arthroscopy hospitalization subsidy reimbursed via cooperative corpus"
    );

    insertClaim.run(
      "CLM-902",
      "WRK-101",
      "G. Ravi Kumar",
      "Tool Kit Upgrade Subsidy",
      4500,
      "Approved & Disbursed",
      "2025-02-18",
      "Telangana Shramik Sahakara Sangham",
      "Digital insulation tester & safety arc-flash gear grant"
    );

    insertClaim.run(
      "CLM-903",
      "WRK-104",
      "S. Kameswari",
      "Emergency Medical Grant",
      8000,
      "Under Verification",
      "2025-02-24",
      "Telangana Shramik Sahakara Sangham",
      "Dependent mother acute medical prescription assistance"
    );
  }
}

// Run initial seed
seedDatabaseIfEmpty();

// Database Operations
export const Database = {
  // Users
  findUserByPhoneOrEmail(query: string): DbUser | null {
    const clean = query.trim().toLowerCase();
    const row = db.prepare(`
      SELECT * FROM users
      WHERE LOWER(phone) = ? OR LOWER(email) = ?
      LIMIT 1
    `).get(clean, clean) as any;

    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || undefined,
      password: row.password_hash,
      role: row.role as any,
      district: row.district,
      workerTrade: row.worker_trade || undefined,
      societyName: row.society_name || undefined,
      workerId: row.worker_id || undefined,
      createdAt: row.created_at,
    };
  },

  createUser(user: DbUser): DbUser {
    const id = user.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = user.createdAt || new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, name, phone, email, password_hash, role, district, worker_trade, society_name, worker_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      user.name,
      user.phone,
      user.email || null,
      user.password || "demo123",
      user.role,
      user.district,
      user.workerTrade || null,
      user.societyName || null,
      user.workerId || null,
      createdAt
    );

    return { ...user, id, createdAt };
  },

  // Workers
  getAllWorkers(filterTrade?: string, district?: string, query?: string): DbWorker[] {
    let sql = "SELECT * FROM workers WHERE 1=1";
    const params: any[] = [];

    if (filterTrade && filterTrade !== "All") {
      sql += " AND trade = ?";
      params.push(filterTrade);
    }

    if (district && district !== "All") {
      sql += " AND district = ?";
      params.push(district);
    }

    sql += " ORDER BY rating DESC, completed_jobs DESC";

    const rows = db.prepare(sql).all(...params) as any[];
    let workers = rows.map((r) => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      trade: r.trade,
      experienceYears: r.experience_years,
      societyId: r.society_id,
      societyName: r.society_name,
      district: r.district,
      state: r.state,
      eShramId: r.e_shram_id,
      rating: r.rating,
      reviewsCount: r.reviews_count,
      completedJobs: r.completed_jobs,
      hourlyRate: r.hourly_rate,
      isVerified: Boolean(r.is_verified),
      kycStatus: r.kyc_status,
      skillBadge: r.skill_badge,
      policeVerified: Boolean(r.police_verified),
      insuranceActive: Boolean(r.insurance_active),
      available: Boolean(r.available),
      avatar: r.avatar,
      skills: JSON.parse(r.skills || "[]"),
      lat: r.lat,
      lng: r.lng,
      exactLocality: r.exact_locality || undefined,
      aadhaarMasked: r.aadhaar_masked || undefined,
      nsqfLevel: r.nsqf_level || undefined,
      policeCertNumber: r.police_cert_number || undefined,
      policeCertDate: r.police_cert_date || undefined,
      coopMemberId: r.coop_member_id || undefined,
      isSample: Boolean(r.is_sample),
    }));

    if (query) {
      const q = query.toLowerCase();
      workers = workers.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.trade.toLowerCase().includes(q) ||
          w.skills.some((s) => s.toLowerCase().includes(q)) ||
          w.societyName.toLowerCase().includes(q) ||
          (w.exactLocality && w.exactLocality.toLowerCase().includes(q))
      );
    }

    return workers;
  },

  getWorkerById(id: string): DbWorker | null {
    const r = db.prepare("SELECT * FROM workers WHERE id = ?").get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      name: r.name,
      phone: r.phone,
      trade: r.trade,
      experienceYears: r.experience_years,
      societyId: r.society_id,
      societyName: r.society_name,
      district: r.district,
      state: r.state,
      eShramId: r.e_shram_id,
      rating: r.rating,
      reviewsCount: r.reviews_count,
      completedJobs: r.completed_jobs,
      hourlyRate: r.hourly_rate,
      isVerified: Boolean(r.is_verified),
      kycStatus: r.kyc_status,
      skillBadge: r.skill_badge,
      policeVerified: Boolean(r.police_verified),
      insuranceActive: Boolean(r.insurance_active),
      available: Boolean(r.available),
      avatar: r.avatar,
      skills: JSON.parse(r.skills || "[]"),
      lat: r.lat,
      lng: r.lng,
      exactLocality: r.exact_locality || undefined,
      aadhaarMasked: r.aadhaar_masked || undefined,
      nsqfLevel: r.nsqf_level || undefined,
      policeCertNumber: r.police_cert_number || undefined,
      policeCertDate: r.police_cert_date || undefined,
      coopMemberId: r.coop_member_id || undefined,
      isSample: Boolean(r.is_sample),
    };
  },

  createWorker(worker: DbWorker): DbWorker {
    db.prepare(`
      INSERT INTO workers (
        id, name, phone, trade, experience_years, society_id, society_name, district, state,
        e_shram_id, rating, reviews_count, completed_jobs, hourly_rate, is_verified, kyc_status,
        skill_badge, police_verified, insurance_active, available, avatar, skills, lat, lng,
        exact_locality, aadhaar_masked, nsqf_level, police_cert_number, police_cert_date, coop_member_id, is_sample
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      worker.id,
      worker.name,
      worker.phone,
      worker.trade,
      worker.experienceYears,
      worker.societyId,
      worker.societyName,
      worker.district,
      worker.state,
      worker.eShramId,
      worker.rating,
      worker.reviewsCount,
      worker.completedJobs,
      worker.hourlyRate,
      worker.isVerified ? 1 : 0,
      worker.kycStatus,
      worker.skillBadge,
      worker.policeVerified ? 1 : 0,
      worker.insuranceActive ? 1 : 0,
      worker.available ? 1 : 0,
      worker.avatar,
      JSON.stringify(worker.skills),
      worker.lat,
      worker.lng,
      worker.exactLocality || null,
      worker.aadhaarMasked || null,
      worker.nsqfLevel || null,
      worker.policeCertNumber || null,
      worker.policeCertDate || null,
      worker.coopMemberId || null,
      worker.isSample ? 1 : 0
    );

    // Update society count
    try {
      db.prepare("UPDATE societies SET workers_count = workers_count + 1 WHERE id = ?").run(worker.societyId);
    } catch {}

    return worker;
  },

  clearAllWorkers(): void {
    db.prepare("DELETE FROM workers").run();
  },

  clearSampleWorkers(): void {
    db.prepare("DELETE FROM workers WHERE is_sample = 1").run();
  },

  seedSampleWorkers(city: string = 'bengaluru'): DbWorker[] {
    const samples: DbWorker[] = city.toLowerCase().includes('bangalore') || city.toLowerCase().includes('bengaluru')
      ? [
          {
            id: `WRK-BLR-01`,
            name: "K. R. Venkatesh",
            phone: "+91 98801 84729",
            trade: "Electrician",
            experienceYears: 12,
            societyId: "SOC-BLR-06",
            societyName: "Bengaluru Labour Cooperatives Union (LCS-201)",
            district: "Bengaluru",
            state: "Karnataka",
            eShramId: "ESH-2023-8819-201",
            rating: 4.92,
            reviewsCount: 148,
            completedJobs: 390,
            hourlyRate: 350,
            isVerified: true,
            kycStatus: 'verified',
            skillBadge: 'Master Artisan',
            policeVerified: true,
            insuranceActive: true,
            available: true,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            skills: ["3-Phase DB Wiring", "Apartment Short-Circuit Repair", "Inverter & UPS Setup", "Smart Meter & MCB"],
            lat: 12.9345,
            lng: 77.6250,
            exactLocality: "Koramangala 4th Block, Bengaluru",
            aadhaarMasked: "XXXX-XXXX-9481",
            nsqfLevel: "NSQF Level 5 (Senior Wireman)",
            policeCertNumber: "KA-BLR-PCC-2024-811",
            coopMemberId: "BLR-LCS-201-901",
            isSample: true,
          },
          {
            id: `WRK-BLR-02`,
            name: "Sunitha Gowda",
            phone: "+91 99002 73819",
            trade: "Domestic Helper & Cook",
            experienceYears: 9,
            societyId: "SOC-BLR-06",
            societyName: "Bengaluru Labour Cooperatives Union (LCS-201)",
            district: "Bengaluru",
            state: "Karnataka",
            eShramId: "ESH-2022-7712-409",
            rating: 4.96,
            reviewsCount: 220,
            completedJobs: 540,
            hourlyRate: 280,
            isVerified: true,
            kycStatus: 'verified',
            skillBadge: 'Master Artisan',
            policeVerified: true,
            insuranceActive: true,
            available: true,
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            skills: ["Karnataka & South Indian Meals", "Hygienic Kitchen Sanitization", "Nutritious Family Cooking"],
            lat: 12.9719,
            lng: 77.6412,
            exactLocality: "Indiranagar 100ft Road, Bengaluru",
            aadhaarMasked: "XXXX-XXXX-6623",
            nsqfLevel: "Skill India - Hospitality & Culinary",
            policeCertNumber: "KA-BLR-PCC-2024-332",
            coopMemberId: "BLR-LCS-201-902",
            isSample: true,
          },
          {
            id: `WRK-BLR-03`,
            name: "M. Manjunatha",
            phone: "+91 97410 29384",
            trade: "Plumber",
            experienceYears: 14,
            societyId: "SOC-BLR-06",
            societyName: "Bengaluru Labour Cooperatives Union (LCS-201)",
            district: "Bengaluru",
            state: "Karnataka",
            eShramId: "ESH-2021-5510-918",
            rating: 4.88,
            reviewsCount: 165,
            completedJobs: 410,
            hourlyRate: 320,
            isVerified: true,
            kycStatus: 'verified',
            skillBadge: 'Master Artisan',
            policeVerified: true,
            insuranceActive: true,
            available: true,
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            skills: ["Concealed Pipe Leak Detection", "Hydro-pneumatic Motor Fixing", "Bathroom Sanitary Fitting"],
            lat: 12.9121,
            lng: 77.6446,
            exactLocality: "HSR Layout Sector 2, Bengaluru",
            aadhaarMasked: "XXXX-XXXX-7719",
            nsqfLevel: "NSQF Level 4 (Master Plumbing)",
            policeCertNumber: "KA-BLR-PCC-2024-541",
            coopMemberId: "BLR-LCS-201-903",
            isSample: true,
          },
          {
            id: `WRK-BLR-04`,
            name: "N. Suresh Babu",
            phone: "+91 98450 19283",
            trade: "Carpenter",
            experienceYears: 11,
            societyId: "SOC-BLR-06",
            societyName: "Bengaluru Labour Cooperatives Union (LCS-201)",
            district: "Bengaluru",
            state: "Karnataka",
            eShramId: "ESH-2020-4419-338",
            rating: 4.85,
            reviewsCount: 110,
            completedJobs: 285,
            hourlyRate: 360,
            isVerified: true,
            kycStatus: 'verified',
            skillBadge: 'Certified Craftsman',
            policeVerified: true,
            insuranceActive: true,
            available: true,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
            skills: ["Modular Wardrobes", "Door & Mortise Lock Repair", "Teak & Sheesham Polishing"],
            lat: 12.9698,
            lng: 77.7500,
            exactLocality: "Whitefield Inner Circle, Bengaluru",
            aadhaarMasked: "XXXX-XXXX-4102",
            nsqfLevel: "NSQF Level 4 (Joinery & Cabinetry)",
            policeCertNumber: "KA-BLR-PCC-2024-789",
            coopMemberId: "BLR-LCS-201-904",
            isSample: true,
          }
        ]
      : [
          {
            id: `WRK-HYD-01`,
            name: "G. Ravi Kumar",
            phone: "+91 98765 43210",
            trade: "Electrician",
            experienceYears: 11,
            societyId: "SOC-HYD-01",
            societyName: "Telangana Shramik Sahakara Sangham",
            district: "Hyderabad",
            state: "Telangana",
            eShramId: "ESH-2022-9841-002",
            rating: 4.9,
            reviewsCount: 142,
            completedJobs: 388,
            hourlyRate: 350,
            isVerified: true,
            kycStatus: 'verified',
            skillBadge: 'Master Artisan',
            policeVerified: true,
            insuranceActive: true,
            available: true,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            skills: ["3-Phase Wiring", "Inverter Installation", "MCB Short-Circuit Repair"],
            lat: 17.4938,
            lng: 78.4018,
            exactLocality: "KPHB Colony Phase 3, Hyderabad",
            aadhaarMasked: "XXXX-XXXX-8392",
            nsqfLevel: "NSQF Level 4 (Certified Wireman)",
            policeCertNumber: "TS-PCC-2024-001892",
            coopMemberId: "TSS-HYD-2022-019",
            isSample: true,
          },
          {
            id: `WRK-HYD-02`,
            name: "B. Lakshmi Bai",
            phone: "+91 97654 32109",
            trade: "Domestic Helper & Cook",
            experienceYears: 8,
            societyId: "SOC-HYD-01",
            societyName: "Telangana Shramik Sahakara Sangham",
            district: "Hyderabad",
            state: "Telangana",
            eShramId: "ESH-2021-4190-771",
            rating: 4.95,
            reviewsCount: 210,
            completedJobs: 512,
            hourlyRate: 280,
            isVerified: true,
            kycStatus: 'verified',
            skillBadge: 'Master Artisan',
            policeVerified: true,
            insuranceActive: true,
            available: true,
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            skills: ["South & North Indian Meals", "Deep Sanitization", "Child Care"],
            lat: 17.4483,
            lng: 78.3915,
            exactLocality: "Madhapur Near Metro, Hyderabad",
            aadhaarMasked: "XXXX-XXXX-5421",
            nsqfLevel: "Skill India - Certified Domestic Executive",
            policeCertNumber: "TS-PCC-2024-002144",
            coopMemberId: "TSS-HYD-2021-088",
            isSample: true,
          }
        ];

    for (const w of samples) {
      // Remove any existing with same id
      db.prepare("DELETE FROM workers WHERE id = ?").run(w.id);
      this.createWorker(w);
    }

    return samples;
  },

  verifyWorker(id: string): DbWorker | null {
    db.prepare(`
      UPDATE workers
      SET is_verified = 1, kyc_status = 'verified', police_verified = 1
      WHERE id = ?
    `).run(id);

    return this.getWorkerById(id);
  },

  // Societies
  getAllSocieties(): DbSociety[] {
    const rows = db.prepare("SELECT * FROM societies ORDER BY workers_count DESC").all() as any[];
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      regNumber: r.reg_number,
      district: r.district,
      state: r.state,
      presidentName: r.president_name,
      contactNumber: r.contact_number,
      workersCount: r.workers_count,
      activeJobsCount: r.active_jobs_count,
      welfareCorpusFund: r.welfare_corpus_fund,
    }));
  },

  getSocietyById(id: string): DbSociety | null {
    const r = db.prepare("SELECT * FROM societies WHERE id = ?").get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      name: r.name,
      regNumber: r.reg_number,
      district: r.district,
      state: r.state,
      presidentName: r.president_name,
      contactNumber: r.contact_number,
      workersCount: r.workers_count,
      activeJobsCount: r.active_jobs_count,
      welfareCorpusFund: r.welfare_corpus_fund,
    };
  },

  // Bookings
  getAllBookings(): DbBooking[] {
    const rows = db.prepare("SELECT * FROM bookings ORDER BY created_at DESC").all() as any[];
    return rows.map((r) => ({
      id: r.id,
      customerName: r.customer_name,
      customerPhone: r.customer_phone,
      customerAddress: r.customer_address,
      workerId: r.worker_id,
      workerName: r.worker_name,
      workerPhone: r.worker_phone,
      workerTrade: r.worker_trade,
      societyName: r.society_name,
      serviceCategory: r.service_category,
      serviceDescription: r.service_description,
      scheduledTime: r.scheduled_time,
      isEmergency: Boolean(r.is_emergency),
      status: r.status,
      totalAmount: r.total_amount,
      workerPayout: r.worker_payout,
      welfareCess: r.welfare_cess,
      cooperativeFee: r.cooperative_fee,
      paymentMethod: r.payment_method,
      paymentStatus: r.payment_status,
      createdAt: r.created_at,
      etaMinutes: r.eta_minutes,
    }));
  },

  getBookingById(id: string): DbBooking | null {
    const r = db.prepare("SELECT * FROM bookings WHERE id = ?").get(id) as any;
    if (!r) return null;
    return {
      id: r.id,
      customerName: r.customer_name,
      customerPhone: r.customer_phone,
      customerAddress: r.customer_address,
      workerId: r.worker_id,
      workerName: r.worker_name,
      workerPhone: r.worker_phone,
      workerTrade: r.worker_trade,
      societyName: r.society_name,
      serviceCategory: r.service_category,
      serviceDescription: r.service_description,
      scheduledTime: r.scheduled_time,
      isEmergency: Boolean(r.is_emergency),
      status: r.status,
      totalAmount: r.total_amount,
      workerPayout: r.worker_payout,
      welfareCess: r.welfare_cess,
      cooperativeFee: r.cooperative_fee,
      paymentMethod: r.payment_method,
      paymentStatus: r.payment_status,
      createdAt: r.created_at,
      etaMinutes: r.eta_minutes,
    };
  },

  createBooking(booking: DbBooking): DbBooking {
    db.prepare(`
      INSERT INTO bookings (
        id, customer_name, customer_phone, customer_address, worker_id, worker_name, worker_phone,
        worker_trade, society_name, service_category, service_description, scheduled_time,
        is_emergency, status, total_amount, worker_payout, welfare_cess, cooperative_fee,
        payment_method, payment_status, created_at, eta_minutes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      booking.id,
      booking.customerName,
      booking.customerPhone,
      booking.customerAddress,
      booking.workerId,
      booking.workerName,
      booking.workerPhone || null,
      booking.workerTrade,
      booking.societyName,
      booking.serviceCategory,
      booking.serviceDescription || null,
      booking.scheduledTime,
      booking.isEmergency ? 1 : 0,
      booking.status,
      booking.totalAmount,
      booking.workerPayout,
      booking.welfareCess,
      booking.cooperativeFee,
      booking.paymentMethod,
      booking.paymentStatus,
      booking.createdAt,
      booking.etaMinutes || 45
    );

    // Credit 5% welfare cess to the worker's society
    const worker = this.getWorkerById(booking.workerId);
    if (worker) {
      db.prepare(`
        UPDATE societies
        SET welfare_corpus_fund = welfare_corpus_fund + ?,
            active_jobs_count = active_jobs_count + 1
        WHERE id = ?
      `).run(booking.welfareCess, worker.societyId);
    }

    return booking;
  },

  updateBookingStatus(id: string, status: string, etaMinutes?: number): DbBooking | null {
    if (etaMinutes !== undefined) {
      db.prepare("UPDATE bookings SET status = ?, eta_minutes = ? WHERE id = ?").run(status, etaMinutes, id);
    } else {
      db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, id);
    }
    return this.getBookingById(id);
  },

  // Welfare Claims
  getAllWelfareClaims(): DbWelfareClaim[] {
    const rows = db.prepare("SELECT * FROM welfare_claims ORDER BY date_submitted DESC").all() as any[];
    return rows.map((r) => ({
      id: r.id,
      workerId: r.worker_id,
      workerName: r.worker_name,
      claimType: r.claim_type,
      amount: r.amount,
      status: r.status,
      dateSubmitted: r.date_submitted,
      societyName: r.society_name,
      description: r.description,
    }));
  },

  // Database Health & Stats
  getStats() {
    const userCount = (db.prepare("SELECT COUNT(*) as c FROM users").get() as any)?.c || 0;
    const workerCount = (db.prepare("SELECT COUNT(*) as c FROM workers").get() as any)?.c || 0;
    const bookingCount = (db.prepare("SELECT COUNT(*) as c FROM bookings").get() as any)?.c || 0;
    const societyCount = (db.prepare("SELECT COUNT(*) as c FROM societies").get() as any)?.c || 0;
    const totalWelfare = (db.prepare("SELECT SUM(welfare_corpus_fund) as s FROM societies").get() as any)?.s || 0;

    return {
      status: "connected",
      engine: "SQLite 3 (Persistent WAL Database)",
      databaseFile: DB_PATH,
      persistedRecords: {
        users: userCount,
        workers: workerCount,
        bookings: bookingCount,
        societies: societyCount,
        totalWelfareCorpusINR: totalWelfare,
      },
    };
  },
};
