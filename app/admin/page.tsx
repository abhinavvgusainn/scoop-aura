"use client";

import { useState, useEffect, useRef } from "react";
import "./admin.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminView = "login" | "dashboard";

interface Order {
  id: string;
  customer: string;
  email: string;
  scoop: string;
  total: number;
  preferences?: string;

  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  paymentId?: string;

  status: "pending" | "processing" | "shipped" | "delivered";

  date: string;
  createdAt: string;
}

const STATUS_CONFIG = {
  pending: { label: "Pending", dot: "🟡", cls: "adm-status-pending" },
  processing: { label: "Processing", dot: "🟣", cls: "adm-status-processing" },
  shipped: { label: "Shipped", dot: "🔵", cls: "adm-status-shipped" },
  delivered: { label: "Delivered", dot: "🟢", cls: "adm-status-delivered" },
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Read env credentials
  const ENV_USER = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
  const ENV_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  // Persist session in sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem("adm_auth") === "1") setView("dashboard");
  }, []);

  useEffect(() => {
    if (view !== "dashboard") return;

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);

        const res = await fetch("/api/orders");

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const docs = await res.json();

        setOrders(
          docs.map((doc: any) => ({
            id: doc.$id,
            customer: doc.fullName,
            email: doc.email,
            scoop: doc.scoop,
            total: Number(doc.amount),

            preferences: doc.preferences,
            phone: doc.phone,
            addressLine1: doc.addressLine1,
            addressLine2: doc.addressLine2,
            city: doc.city,
            state: doc.state,
            postalCode: doc.postalCode,
            country: doc.country,
            paymentId: doc.paymentId,

            status: doc.status,

            date: new Date(doc.$createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),

            createdAt: new Date(doc.$createdAt).toLocaleString("en-IN"),
          })),
        );
      } catch (err) {
        console.error(err);
        showToast("Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [view]);

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
    if (!username.trim()) {
      setError("Username is required.");
      triggerShake();
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      triggerShake();
      return;
    }

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
      prev.map((o) => (o.id === id ? { ...o, status: next } : o)),
    );
    showToast(`Order ${id} marked as ${next} ✦`);
  };

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.scoop.toLowerCase().includes(search.toLowerCase()),
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
        <div className="adm-root">
          <div className="adm-blob adm-blob-1" />
          <div className="adm-blob adm-blob-2" />
          <div className="adm-blob adm-blob-3" />
          <div className="adm-login-wrap">
            <div
              ref={cardRef}
              className={`adm-login-card${shake ? " shake" : ""}`}
            >
              {/* Brand */}
              <div className="adm-eyebrow">✦ Admin Portal</div>
              <div className="adm-date">Scoop Aura</div>

              <div className="adm-login-title">Welcome back 🌸</div>
              <div className="adm-login-sub">
                Sign in to manage your orders & content.
              </div>

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
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
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
                  <>
                    <span className="adm-spinner" /> Verifying…
                  </>
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
      <div className="adm-root">
        <div className="adm-blob adm-blob-1" />
        <div className="adm-blob adm-blob-2" />
        <div className="adm-blob adm-blob-3" />

        <div className="adm-dash">
          {/* Nav */}
          <nav className="adm-nav">
            <div className="adm-nav-left">
              <span className="adm-date" style={{ fontSize: "1rem" }}>
                {new Date().toLocaleString("en-IN")}
              </span>
              <span className="adm-nav-pill">Admin</span>
            </div>
            <button
              type="button"
              className="adm-logout-btn"
              onClick={handleLogout}
            >
              🚪 Sign out
            </button>
          </nav>

          {/* Body */}
          <main className="adm-body">
            {/* Header */}
            <div className="adm-dash-header">
              <div className="adm-dash-greeting">Good day, {ENV_USER} 🌸</div>
              <div className="adm-dash-sub">
                Here's what's happening with your scoops today.
              </div>
            </div>

            {/* Stats */}
            <div className="adm-stats-grid">
              {[
                { icon: "📦", val: stats.total, label: "Total Orders" },
                {
                  icon: "💰",
                  val: `₹${stats.revenue.toLocaleString("en-IN")}`,
                  label: "Total Revenue",
                },
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
                    {loadingOrders ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="adm-empty">Loading orders...</div>
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="adm-empty">No orders found 🌸</div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((order, i) => {
                        const cfg = STATUS_CONFIG[order.status];
                        const nextStatus: Record<
                          Order["status"],
                          Order["status"]
                        > = {
                          pending: "processing",
                          processing: "shipped",
                          shipped: "delivered",
                          delivered: "pending",
                        };
                        return (
                          <>
                            <tr
                              key={order.id}
                              onClick={() =>
                                setExpandedOrder(
                                  expandedOrder === order.id ? null : order.id,
                                )
                              }
                              style={{
                                animationDelay: `${i * 0.04}s`,
                                cursor: "pointer",
                              }}
                            >
                              <td>
                                <span className="adm-order-id">{order.id}</span>
                              </td>

                              <td>
                                <div className="adm-customer-name">
                                  {order.customer}
                                </div>
                                <div className="adm-customer-email">
                                  {order.email}
                                </div>
                              </td>

                              <td
                                style={{
                                  fontWeight: 600,
                                  color: "#7A5C8A",
                                  fontSize: "0.82rem",
                                }}
                              >
                                {order.scoop}
                              </td>

                              <td>
                                <span className="adm-amount">
                                  ₹{order.total.toLocaleString("en-IN")}
                                </span>
                              </td>

                              <td>
                                <span className={`adm-status-badge ${cfg.cls}`}>
                                  {cfg.dot} {cfg.label}
                                </span>
                              </td>

                              <td
                                style={{
                                  color: "#A887B8",
                                  fontSize: "0.78rem",
                                }}
                              >
                                {order.date}
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="adm-action-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    handleStatusChange(
                                      order.id,
                                      nextStatus[order.status],
                                    );
                                  }}
                                  title={`Mark as ${nextStatus[order.status]}`}
                                >
                                  → {nextStatus[order.status]}
                                </button>
                              </td>
                            </tr>

                            {expandedOrder === order.id && (
                              <tr>
                                <td colSpan={7}>
                                  <div className="adm-order-expand">
                                    <div className="adm-expand-grid">
                                      <div>
                                        <strong>Full Name</strong>
                                        <p>{order.customer}</p>
                                      </div>

                                      <div>
                                        <strong>Email</strong>
                                        <p>{order.email}</p>
                                      </div>

                                      <div>
                                        <strong>Phone</strong>
                                        <p>{order.phone || "-"}</p>
                                      </div>

                                      <div>
                                        <strong>Scoop</strong>
                                        <p>{order.scoop}</p>
                                      </div>

                                      <div>
                                        <strong>Payment ID</strong>
                                        <p>{order.paymentId || "-"}</p>
                                      </div>

                                      <div>
                                        <strong>Amount</strong>
                                        <p>₹{order.total}</p>
                                      </div>

                                      <div>
                                        <strong>Status</strong>
                                        <p>{order.status}</p>
                                      </div>

                                      <div>
                                        <strong>Created At</strong>
                                        <p>{order.createdAt}</p>
                                      </div>

                                      <div>
                                        <strong>Address Line 1</strong>
                                        <p>{order.addressLine1 || "-"}</p>
                                      </div>

                                      <div>
                                        <strong>Address Line 2</strong>
                                        <p>{order.addressLine2 || "-"}</p>
                                      </div>

                                      <div>
                                        <strong>City</strong>
                                        <p>{order.city || "-"}</p>
                                      </div>

                                      <div>
                                        <strong>State</strong>
                                        <p>{order.state || "-"}</p>
                                      </div>

                                      <div>
                                        <strong>Postal Code</strong>
                                        <p>{order.postalCode || "-"}</p>
                                      </div>

                                      <div>
                                        <strong>Country</strong>
                                        <p>{order.country || "-"}</p>
                                      </div>

                                      <div style={{ gridColumn: "1 / -1" }}>
                                        <strong>Preferences</strong>
                                        <p>
                                          {order.preferences ||
                                            "No preferences provided"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="adm-table-footer">
                <span>
                  {filtered.length} of {orders.length} orders
                </span>
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
