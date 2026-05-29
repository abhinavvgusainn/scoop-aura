"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminView = "login" | "dashboard";

interface Order {
  id: string;
  customer: string;
  email: string;
  scoop: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  date: string;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const ADMIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Quicksand:wght@500;600;700;800&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes blobDrift {
    0%   { transform: translate(0,0)      scale(1);    }
    50%  { transform: translate(40px,30px) scale(1.07); }
    100% { transform: translate(0,0)      scale(1);    }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-7px); }
    40%     { transform: translateX(7px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.5; }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes rowFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .adm-root {
    min-height: 100vh;
    background: linear-gradient(145deg, #FDF6FF 0%, #F7EDFF 40%, #FFF0F5 100%);
    font-family: 'Quicksand', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Blobs ── */
  .adm-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
    animation: blobDrift 14s ease-in-out infinite alternate;
  }
  .adm-blob-1 {
    width: 520px; height: 520px;
    background: radial-gradient(circle, #F0C4FF, #E8A8FF);
    top: -120px; left: -140px;
    animation-delay: 0s;
  }
  .adm-blob-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #FFD6E8, #FFAACB);
    bottom: -100px; right: -100px;
    animation-delay: -5s;
  }
  .adm-blob-3 {
    width: 280px; height: 280px;
    background: radial-gradient(circle, #C8E8FF, #A8D4FF);
    top: 40%; right: 10%;
    animation-delay: -9s;
  }

  /* ── Login Screen ── */
  .adm-login-wrap {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .adm-login-card {
    background: rgba(255,255,255,0.80);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-radius: 28px;
    border: 1.5px solid rgba(200,178,232,0.28);
    box-shadow: 0 16px 56px rgba(200,100,232,0.12), 0 2px 8px rgba(0,0,0,0.04);
    padding: 3rem 2.6rem 2.6rem;
    width: 100%;
    max-width: 420px;
    animation: scaleIn 0.5s cubic-bezier(.34,1.56,.64,1) both;
  }
  .adm-login-card.shake {
    animation: shake 0.45s ease;
  }

  .adm-wordmark {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 900;
    background: linear-gradient(135deg, #C060E0, #FF8FAB);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
  }
  .adm-eyebrow {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #B890CC;
    margin-bottom: 6px;
  }
  .adm-login-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.55rem;
    font-weight: 900;
    color: #3D2C47;
    margin-top: 1.8rem;
    line-height: 1.2;
  }
  .adm-login-sub {
    font-size: 0.82rem;
    color: #A887B8;
    font-weight: 500;
    margin-top: 6px;
    margin-bottom: 1.8rem;
  }

  .adm-field {
    margin-bottom: 1rem;
  }
  .adm-field-label {
    display: block;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #A887B8;
    margin-bottom: 7px;
  }
  .adm-input-wrap {
    position: relative;
  }
  .adm-input {
    width: 100%;
    border-radius: 14px;
    padding: 13px 16px 13px 44px;
    border: 2px solid rgba(200,178,232,0.32);
    background: rgba(255,255,255,0.88);
    font-family: 'Quicksand', sans-serif;
    font-size: 0.92rem;
    font-weight: 600;
    color: #3D2C47;
    outline: none;
    transition: border-color 0.22s, box-shadow 0.22s;
  }
  .adm-input:focus {
    border-color: rgba(192,96,224,0.55);
    box-shadow: 0 0 0 4px rgba(192,96,224,0.09);
  }
  .adm-input.error {
    border-color: rgba(239,68,68,0.55);
    box-shadow: 0 0 0 4px rgba(239,68,68,0.07);
  }
  .adm-input::placeholder { color: #D0B0D8; font-weight: 500; }
  .adm-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
    pointer-events: none;
    opacity: 0.7;
  }
  .adm-eye-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    opacity: 0.55;
    padding: 4px;
    transition: opacity 0.2s;
    line-height: 1;
  }
  .adm-eye-btn:hover { opacity: 0.9; }

  .adm-error-msg {
    font-size: 0.72rem;
    font-weight: 600;
    color: #EF4444;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .adm-login-btn {
    width: 100%;
    margin-top: 1.4rem;
    border: none;
    border-radius: 50px;
    padding: 15px;
    background: linear-gradient(135deg, #C060E0, #FF8FAB);
    color: white;
    font-family: 'Quicksand', sans-serif;
    font-size: 0.95rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 8px 28px rgba(192,96,224,0.32);
    transition: transform 0.2s, filter 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .adm-login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    filter: brightness(1.07);
    box-shadow: 0 12px 34px rgba(192,96,224,0.38);
  }
  .adm-login-btn:active:not(:disabled) {
    transform: scale(0.98);
  }
  .adm-login-btn:disabled {
    cursor: not-allowed;
    opacity: 0.75;
  }
  .adm-spinner {
    width: 16px; height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  .adm-lock-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 1.2rem;
    font-size: 0.7rem;
    color: #B890CC;
    font-weight: 600;
  }

  /* ── Dashboard Layout ── */
  .adm-dash {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Top Nav */
  .adm-nav {
    background: rgba(255,255,255,0.80);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(200,178,232,0.22);
    padding: 0 2rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    animation: fadeUp 0.4s ease both;
  }
  .adm-nav-left { display: flex; align-items: center; gap: 12px; }
  .adm-nav-pill {
    background: linear-gradient(135deg, rgba(192,96,224,0.12), rgba(255,143,171,0.1));
    border: 1px solid rgba(192,96,224,0.2);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #C060E0;
  }
  .adm-logout-btn {
    background: rgba(200,178,232,0.15);
    border: 1.5px solid rgba(200,178,232,0.3);
    border-radius: 20px;
    padding: 7px 16px;
    font-family: 'Quicksand', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    color: #7A5C8A;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }
  .adm-logout-btn:hover {
    background: rgba(255,143,171,0.15);
    border-color: rgba(255,143,171,0.4);
    color: #C060E0;
  }

  /* Body */
  .adm-body {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .adm-dash-header {
    animation: fadeUp 0.4s 0.05s ease both;
    margin-bottom: 2rem;
  }
  .adm-dash-greeting {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 900;
    color: #3D2C47;
    line-height: 1.1;
  }
  .adm-dash-sub {
    font-size: 0.85rem;
    color: #A887B8;
    font-weight: 500;
    margin-top: 4px;
  }

  /* Stat Cards */
  .adm-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
    animation: fadeUp 0.45s 0.1s ease both;
  }
  .adm-stat-card {
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 20px;
    border: 1px solid rgba(200,178,232,0.22);
    box-shadow: 0 4px 20px rgba(200,100,232,0.08);
    padding: 1.4rem 1.6rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .adm-stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 32px rgba(200,100,232,0.14);
  }
  .adm-stat-icon {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  .adm-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 900;
    color: #3D2C47;
    line-height: 1;
  }
  .adm-stat-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #A887B8;
    margin-top: 6px;
  }

  /* Orders Table */
  .adm-section-card {
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 24px;
    border: 1px solid rgba(200,178,232,0.22);
    box-shadow: 0 4px 24px rgba(200,100,232,0.08);
    overflow: hidden;
    animation: fadeUp 0.5s 0.15s ease both;
  }
  .adm-section-head {
    padding: 1.4rem 1.8rem;
    border-bottom: 1px solid rgba(200,178,232,0.18);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }
  .adm-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 900;
    color: #3D2C47;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .adm-search-input {
    border-radius: 20px;
    padding: 8px 16px 8px 36px;
    border: 1.5px solid rgba(200,178,232,0.32);
    background: rgba(255,255,255,0.88);
    font-family: 'Quicksand', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: #3D2C47;
    outline: none;
    width: 200px;
    position: relative;
    transition: border-color 0.2s, width 0.3s;
  }
  .adm-search-input:focus {
    border-color: rgba(192,96,224,0.45);
    width: 240px;
  }
  .adm-search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .adm-search-icon {
    position: absolute;
    left: 12px;
    font-size: 0.8rem;
    opacity: 0.5;
    pointer-events: none;
  }

  .adm-table-wrap {
    overflow-x: auto;
  }
  .adm-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.83rem;
  }
  .adm-table th {
    padding: 0.8rem 1.2rem;
    text-align: left;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #B890CC;
    background: rgba(200,178,232,0.07);
    white-space: nowrap;
  }
  .adm-table th:first-child { padding-left: 1.8rem; }
  .adm-table th:last-child { padding-right: 1.8rem; }
  .adm-table td {
    padding: 1rem 1.2rem;
    border-top: 1px solid rgba(200,178,232,0.13);
    color: #3D2C47;
    font-weight: 600;
    vertical-align: middle;
  }
  .adm-table td:first-child { padding-left: 1.8rem; }
  .adm-table td:last-child { padding-right: 1.8rem; }
  .adm-table tr { animation: rowFadeIn 0.35s ease both; }
  .adm-table tr:hover td { background: rgba(200,178,232,0.06); }

  .adm-order-id {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    color: #C060E0;
    font-size: 0.85rem;
  }
  .adm-customer-name {
    font-weight: 700;
    color: #3D2C47;
  }
  .adm-customer-email {
    font-size: 0.72rem;
    color: #A887B8;
    font-weight: 500;
  }

  .adm-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }
  .adm-status-pending {
    background: rgba(251,191,36,0.12);
    color: #D97706;
    border: 1px solid rgba(251,191,36,0.25);
  }
  .adm-status-processing {
    background: rgba(192,96,224,0.1);
    color: #9333EA;
    border: 1px solid rgba(192,96,224,0.2);
  }
  .adm-status-shipped {
    background: rgba(59,130,246,0.1);
    color: #2563EB;
    border: 1px solid rgba(59,130,246,0.2);
  }
  .adm-status-delivered {
    background: rgba(34,197,94,0.1);
    color: #16A34A;
    border: 1px solid rgba(34,197,94,0.2);
  }

  .adm-amount {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    color: #3D2C47;
  }

  .adm-action-btn {
    background: rgba(200,178,232,0.12);
    border: 1px solid rgba(200,178,232,0.28);
    border-radius: 8px;
    padding: 5px 10px;
    font-family: 'Quicksand', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    color: #7A5C8A;
    cursor: pointer;
    transition: all 0.18s;
  }
  .adm-action-btn:hover {
    background: rgba(192,96,224,0.14);
    border-color: rgba(192,96,224,0.3);
    color: #C060E0;
  }

  .adm-empty {
    padding: 3rem;
    text-align: center;
    color: #B890CC;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .adm-table-footer {
    padding: 1rem 1.8rem;
    border-top: 1px solid rgba(200,178,232,0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #B890CC;
    font-weight: 600;
    flex-wrap: wrap;
    gap: 8px;
  }

  /* Toast */
  .adm-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 16px;
    border: 1px solid rgba(200,178,232,0.3);
    box-shadow: 0 8px 32px rgba(192,96,224,0.16);
    padding: 1rem 1.4rem;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.82rem;
    font-weight: 700;
    color: #3D2C47;
    z-index: 999;
    animation: slideInRight 0.4s cubic-bezier(.34,1.56,.64,1) both;
  }
  .adm-toast-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #C060E0, #FF8FAB);
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .adm-login-card { padding: 2.2rem 1.6rem 2rem; }
    .adm-body { padding: 1.2rem; }
    .adm-dash-greeting { font-size: 1.5rem; }
    .adm-nav { padding: 0 1rem; }
    .adm-search-input { width: 140px; }
    .adm-search-input:focus { width: 160px; }
  }
`;

// ─── Mock Orders Data ─────────────────────────────────────────────────────────
const MOCK_ORDERS: Order[] = [
  { id: "#SCO-1042", customer: "Priya Sharma", email: "priya.sharma@gmail.com", scoop: "Pastel Bliss Box", total: 1499, status: "delivered", date: "28 May 2026" },
  { id: "#SCO-1041", customer: "Ananya Gupta", email: "ananya.g@outlook.com", scoop: "Soft Girl Dream Kit", total: 2199, status: "shipped", date: "28 May 2026" },
  { id: "#SCO-1040", customer: "Meera Nair", email: "meera.nair@gmail.com", scoop: "Cottagecore Edit", total: 999, status: "processing", date: "27 May 2026" },
  { id: "#SCO-1039", customer: "Riya Joshi", email: "riya.joshi@yahoo.in", scoop: "Pastry Mood Box", total: 1799, status: "pending", date: "27 May 2026" },
  { id: "#SCO-1038", customer: "Diya Malhotra", email: "diya.m@gmail.com", scoop: "Cloud Nine Kit", total: 2499, status: "delivered", date: "26 May 2026" },
  { id: "#SCO-1037", customer: "Tara Singh", email: "tara.singh@proton.me", scoop: "Pastel Bliss Box", total: 1499, status: "shipped", date: "26 May 2026" },
  { id: "#SCO-1036", customer: "Ishita Kapoor", email: "ishita.k@gmail.com", scoop: "Aesthetic Care Box", total: 1299, status: "delivered", date: "25 May 2026" },
  { id: "#SCO-1035", customer: "Simran Batra", email: "simran.b@gmail.com", scoop: "Soft Girl Dream Kit", total: 2199, status: "processing", date: "25 May 2026" },
];

const STATUS_CONFIG = {
  pending:    { label: "Pending",    dot: "🟡", cls: "adm-status-pending" },
  processing: { label: "Processing", dot: "🟣", cls: "adm-status-processing" },
  shipped:    { label: "Shipped",    dot: "🔵", cls: "adm-status-shipped" },
  delivered:  { label: "Delivered",  dot: "🟢", cls: "adm-status-delivered" },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [view, setView] = useState<AdminView>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const cardRef = useRef<HTMLDivElement>(null);

  // Read env credentials
  const ENV_USER = process.env.NEXT_PUBLIC_ADMIN_USERNAME
  const ENV_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

  // Persist session in sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem("adm_auth") === "1") setView("dashboard");
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async () => {
    setError("");
    if (!username.trim()) { setError("Username is required."); triggerShake(); return; }
    if (!password.trim()) { setError("Password is required."); triggerShake(); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // brief UX delay

    if (username === ENV_USER && password === ENV_PASS) {
      sessionStorage.setItem("adm_auth", "1");
      setView("dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
      setPassword("");
      setLoading(false);
      triggerShake();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adm_auth");
    setView("login");
    setUsername("");
    setPassword("");
    setError("");
  };

  const handleStatusChange = (id: string, next: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: next } : o))
    );
    showToast(`Order ${id} marked as ${next} ✦`);
  };

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.scoop.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: orders.length,
    revenue: orders.reduce((s, o) => s + o.total, 0),
    pending: orders.filter((o) => o.status === "pending").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  // ── Login View ──────────────────────────────────────────────────────────────
  if (view === "login") {
    return (
      <>
        <style>{ADMIN_CSS}</style>
        <div className="adm-root">
          <div className="adm-blob adm-blob-1" />
          <div className="adm-blob adm-blob-2" />
          <div className="adm-blob adm-blob-3" />
          <div className="adm-login-wrap">
            <div ref={cardRef} className={`adm-login-card${shake ? " shake" : ""}`}>

              {/* Brand */}
              <div className="adm-eyebrow">✦ Admin Portal</div>
              <div className="adm-wordmark">Scoop Aura</div>

              <div className="adm-login-title">Welcome back 🌸</div>
              <div className="adm-login-sub">Sign in to manage your orders & content.</div>

              {/* Username */}
              <div className="adm-field">
                <label className="adm-field-label">Username</label>
                <div className="adm-input-wrap">
                  <span className="adm-input-icon">👤</span>
                  <input
                    className={`adm-input${error && !username ? " error" : ""}`}
                    type="text"
                    placeholder="your username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="adm-field">
                <label className="adm-field-label">Password</label>
                <div className="adm-input-wrap">
                  <span className="adm-input-icon">🔑</span>
                  <input
                    className={`adm-input${error && !password ? " error" : ""}`}
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="adm-eye-btn"
                    onClick={() => setShowPw((p) => !p)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="adm-error-msg">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="button"
                className="adm-login-btn"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <><span className="adm-spinner" /> Verifying…</>
                ) : (
                  <>Enter Dashboard ✦</>
                )}
              </button>

              <div className="adm-lock-badge">
                🔒 Secured · Admin access only
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Dashboard View ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{ADMIN_CSS}</style>
      <div className="adm-root">
        <div className="adm-blob adm-blob-1" />
        <div className="adm-blob adm-blob-2" />
        <div className="adm-blob adm-blob-3" />

        <div className="adm-dash">
          {/* Nav */}
          <nav className="adm-nav">
            <div className="adm-nav-left">
              <span className="adm-wordmark" style={{ fontSize: "1.3rem" }}>Scoop Aura</span>
              <span className="adm-nav-pill">Admin</span>
            </div>
            <button type="button" className="adm-logout-btn" onClick={handleLogout}>
              🚪 Sign out
            </button>
          </nav>

          {/* Body */}
          <main className="adm-body">
            {/* Header */}
            <div className="adm-dash-header">
              <div className="adm-dash-greeting">Good day, {ENV_USER} 🌸</div>
              <div className="adm-dash-sub">Here's what's happening with your scoops today.</div>
            </div>

            {/* Stats */}
            <div className="adm-stats-grid">
              {[
                { icon: "📦", val: stats.total, label: "Total Orders" },
                { icon: "💰", val: `₹${stats.revenue.toLocaleString("en-IN")}`, label: "Total Revenue" },
                { icon: "🕐", val: stats.pending, label: "Pending" },
                { icon: "✅", val: stats.delivered, label: "Delivered" },
              ].map((s) => (
                <div key={s.label} className="adm-stat-card">
                  <div className="adm-stat-icon">{s.icon}</div>
                  <div className="adm-stat-val">{s.val}</div>
                  <div className="adm-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Orders Table */}
            <div className="adm-section-card">
              <div className="adm-section-head">
                <div className="adm-section-title">✦ Orders</div>
                <div className="adm-search-wrap">
                  <span className="adm-search-icon">🔍</span>
                  <input
                    className="adm-search-input"
                    type="text"
                    placeholder="Search orders…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Scoop</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="adm-empty">No orders found 🌸</div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((order, i) => {
                        const cfg = STATUS_CONFIG[order.status];
                        const nextStatus: Record<Order["status"], Order["status"]> = {
                          pending: "processing",
                          processing: "shipped",
                          shipped: "delivered",
                          delivered: "pending",
                        };
                        return (
                          <tr key={order.id} style={{ animationDelay: `${i * 0.04}s` }}>
                            <td><span className="adm-order-id">{order.id}</span></td>
                            <td>
                              <div className="adm-customer-name">{order.customer}</div>
                              <div className="adm-customer-email">{order.email}</div>
                            </td>
                            <td style={{ fontWeight: 600, color: "#7A5C8A", fontSize: "0.82rem" }}>{order.scoop}</td>
                            <td><span className="adm-amount">₹{order.total.toLocaleString("en-IN")}</span></td>
                            <td>
                              <span className={`adm-status-badge ${cfg.cls}`}>
                                {cfg.dot} {cfg.label}
                              </span>
                            </td>
                            <td style={{ color: "#A887B8", fontSize: "0.78rem" }}>{order.date}</td>
                            <td>
                              <button
                                type="button"
                                className="adm-action-btn"
                                onClick={() => handleStatusChange(order.id, nextStatus[order.status])}
                                title={`Mark as ${nextStatus[order.status]}`}
                              >
                                → {nextStatus[order.status]}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="adm-table-footer">
                <span>{filtered.length} of {orders.length} orders</span>
                <span>Last updated: just now</span>
              </div>
            </div>
          </main>
        </div>

        {/* Toast */}
        {toast && (
          <div className="adm-toast">
            <span className="adm-toast-dot" />
            {toast}
          </div>
        )}
      </div>
    </>
  );
}