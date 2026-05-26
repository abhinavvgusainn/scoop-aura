"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { getScoopById, type Scoop } from "@/lib/scoops";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const PAGE_CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }
  @keyframes overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes dialogIn {
    from { opacity: 0; transform: translateY(30px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes pulse-dot {
    0%,100% { transform: scale(1);   opacity: 1;   }
    50%      { transform: scale(1.5); opacity: 0.6; }
  }

  .order-page-section { animation: fadeUp 0.6s ease both; }
  .order-card-anim    { animation: scaleIn 0.5s ease both; }

  .pref-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(61,44,71,0.45);
    backdrop-filter: blur(6px);
    animation: overlayIn 0.25s ease;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
  }
  .pref-dialog {
    animation: dialogIn 0.3s cubic-bezier(0.34,1.4,0.64,1);
    width: 100%; max-width: 560px;
    background: rgba(255,249,240,0.97);
    backdrop-filter: blur(24px);
    border-radius: 28px;
    border: 1px solid rgba(200,178,232,0.3);
    box-shadow: 0 24px 80px rgba(200,178,232,0.35);
    overflow: hidden;
    max-height: 90vh;
    overflow-y: auto;
  }

  .chip-quick {
    border-radius: 50px;
    padding: 7px 14px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s ease;
    border: 1.5px solid transparent;
    font-family: var(--font-quicksand, 'Quicksand', sans-serif);
  }
  .chip-quick.on {
    background: linear-gradient(135deg, #FF8FAB, #C8B2E8);
    color: white;
    box-shadow: 0 4px 14px rgba(255,143,171,0.3);
  }
  .chip-quick.off {
    background: rgba(255,255,255,0.8);
    border-color: rgba(200,178,232,0.4);
    color: #7A5C8A;
  }
  .chip-quick.off:hover {
    border-color: #FF8FAB;
    color: #FF8FAB;
  }

  .order-btn-main {
    transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
  }
  .order-btn-main:hover {
    transform: translateY(-2px);
    filter: brightness(1.06);
  }
  .order-btn-main:active {
    transform: translateY(0) scale(0.98);
  }

  .perk-row {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 0;
    border-bottom: 1px solid rgba(200,178,232,0.12);
    font-size: 0.88rem;
    font-weight: 600;
    color: #7A5C8A;
  }
  .perk-row:last-child { border-bottom: none; }

  .faq-item { border-bottom: 1px solid rgba(200,178,232,0.15); }
  .faq-item:last-child { border-bottom: none; }
  .faq-btn {
    width: 100%; text-align: left; background: none; border: none;
    cursor: pointer; padding: 16px 0;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px;
    font-family: var(--font-quicksand, 'Quicksand', sans-serif);
    font-size: 0.88rem; font-weight: 700; color: #3D2C47;
    transition: color 0.18s;
  }
  .faq-btn:hover { color: #FF8FAB; }
  .faq-answer {
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }

  .textarea-pref {
    width: 100%;
    border-radius: 16px;
    padding: 1rem 1.2rem;
    border: 2px solid rgba(200,178,232,0.3);
    resize: none;
    height: 110px;
    font-family: var(--font-quicksand, 'Quicksand', sans-serif);
    font-size: 0.88rem;
    color: #7A5C8A;
    background: rgba(255,255,255,0.85);
    outline: none;
    transition: border-color 0.2s;
    line-height: 1.6;
  }
  .textarea-pref:focus { border-color: rgba(255,143,171,0.5); }
  .textarea-pref::placeholder { color: #D0B0D8; }
`;

const QUICK_CHIPS = [
  "No Earrings", "No Makeup", "No Skincare", "No Pink",
  "No Perfume", "Vegan Only", "No Keychains", "No Red/Orange",
];

export default function OrderPage({
  params,
}: {
  params: Promise<{ scoop: string }>;
}) {
  const router = useRouter();
  const cssRef = useRef(false);

  // Next.js 15: params is a Promise — unwrap with React.use()
  const { scoop: scoopId } = use(params);
  const scoop: Scoop | undefined = getScoopById(scoopId);

  // ── State
  const [dialogOpen, setDialogOpen]   = useState(false);
  const [chips, setChips]             = useState<Record<string, boolean>>({});
  const [prefText, setPrefText]       = useState("");
  const [savedPrefs, setSavedPrefs]   = useState<{ chips: string[]; text: string } | null>(null);
  const [openFaq, setOpenFaq]         = useState<number | null>(null);
  const [loading, setLoading]         = useState(false);

  // Inject CSS once
  useEffect(() => {
    if (cssRef.current) return;
    cssRef.current = true;
    const s = document.createElement("style");
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
  }, []);

  // Lock body scroll when dialog open
  useEffect(() => {
    document.body.style.overflow = dialogOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [dialogOpen]);

  // ── 404 guard
  if (!scoop) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
        <h1 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.8rem", color: "#3D2C47", marginBottom: "0.5rem" }}>
          Scoop not found
        </h1>
        <p style={{ color: "#A887B8", marginBottom: "1.5rem" }}>That scoop doesn&apos;t exist. Try Pearl, Crystal, or Diamond.</p>
        <button
          onClick={() => router.push("/#scoops")}
          style={{ background: "linear-gradient(135deg,#FF8FAB,#C8B2E8)", color: "white", border: "none", borderRadius: "50px", padding: "12px 28px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer" }}
        >
          ← Back to Scoops
        </button>
      </div>
    );
  }

  // ── Pricing
  const basePrice      = scoop.price;
  const deliveryCharge = scoop.deliveryCharge;
  const subtotal       = basePrice + deliveryCharge;
  const tax            = Math.round(subtotal * scoop.taxRate);
  const total          = subtotal + tax;

  // ── Handlers
  const toggleChip = (chip: string) =>
    setChips((prev) => ({ ...prev, [chip]: !prev[chip] }));

  const savePrefs = () => {
    const selected = Object.entries(chips).filter(([, v]) => v).map(([k]) => k);
    setSavedPrefs({ chips: selected, text: prefText.trim() });
    setDialogOpen(false);
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // POST to your API route which creates a Razorpay order
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scoopId:   scoop.id,
          amount:    total * 100,           // Razorpay wants paise
          currency:  "INR",
          preferences: savedPrefs,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      // Open Razorpay checkout widget
      const rzp = new (window as typeof window & { Razorpay: new (opts: Record<string, unknown>) => { open(): void } }).Razorpay({
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      data.amount,
        currency:    data.currency,
        order_id:    data.id,
        name:        "ScoopAura ✨",
        description: `${scoop.name} — Mystery Scoop`,
        image:       "/logo.png",
        theme:       { color: "#FF8FAB" },
        handler: (response: { razorpay_payment_id: string }) => {
          // Payment success → redirect to confirmation
          router.push(
            `/order-success?payment_id=${response.razorpay_payment_id}&scoop=${scoop.id}`
          );
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        prefill: {
          name:  "",
          email: "",
          contact: "",
        },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // ── Rendered
  const activeChips = Object.entries(chips).filter(([, v]) => v).map(([k]) => k);

  return (
    <>
      {/* Blobs — same as rest of site */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        {[
          { w: 500, bg: "radial-gradient(circle,#FFB6C1,#E8DCFF)", top: "-100px", left: "-80px",  delay: "0s"  },
          { w: 380, bg: "radial-gradient(circle,#B8D8F8,#C8B2E8)", top: "35%",    right: "-80px", delay: "3s"  },
          { w: 320, bg: "radial-gradient(circle,#FFCBA4,#FFB6C1)", bottom: "5%",  left: "15%",    delay: "6s"  },
        ].map((b, i) => (
          <div key={i} style={{ position: "absolute", width: b.w, height: b.w, borderRadius: "50%", background: b.bg, filter: "blur(80px)", opacity: 0.3, top: (b as {top?:string}).top, left: (b as {left?:string}).left, right: (b as {right?:string}).right, bottom: (b as {bottom?:string}).bottom, animation: "blobDrift 12s ease-in-out infinite alternate", animationDelay: b.delay }} />
        ))}
      </div>

      <div
        style={{
          position: "relative", zIndex: 1,
          maxWidth: "1100px", margin: "0 auto",
          padding: "40px 5% 100px",
        }}
      >
        {/* ── Back link */}
        <button
          onClick={() => router.push("/#scoops")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "#A887B8", fontWeight: 700, fontSize: "0.85rem", marginBottom: "2rem", padding: 0, fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)" }}
        >
          ← Back to Scoops
        </button>

        {/* ── Main grid: left (details) + right (order summary) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr min(360px, 100%)",
            gap: "2rem",
            alignItems: "start",
          }}
          className="order-responsive-grid"
        >

          {/* ════ LEFT COLUMN ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Hero card */}
            <div
              className="order-card-anim"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: "28px",
                border: `1px solid ${scoop.glowColor}`,
                boxShadow: `0 12px 48px ${scoop.glowColor}`,
                padding: "2.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glow blob */}
              <div aria-hidden style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: scoop.accentColor, opacity: 0.08, filter: "blur(40px)", pointerEvents: "none" }} />

              {/* Badge */}
              {scoop.badge && (
                <div style={{ display: "inline-flex", marginBottom: "1rem", background: "linear-gradient(135deg,#FF8FAB,#C8B2E8)", color: "white", borderRadius: "50px", padding: "4px 12px", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                  {scoop.badge}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
                {/* Emoji box */}
                <div style={{ width: "90px", height: "90px", borderRadius: "22px", background: "rgba(255,255,255,0.9)", boxShadow: `0 8px 28px ${scoop.glowColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", flexShrink: 0 }}>
                  {scoop.emoji}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: scoop.accentColor, marginBottom: "4px" }}>
                    ✦ {scoop.tier}
                  </div>
                  <h1 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "#3D2C47", lineHeight: 1.1, marginBottom: "0.5rem" }}>
                    {scoop.name}
                  </h1>
                  <p style={{ color: "#A887B8", fontSize: "0.95rem", fontWeight: 500 }}>{scoop.tagline}</p>
                </div>
              </div>

              {/* Category chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "1.5rem" }}>
                {scoop.categories.map((c) => (
                  <span key={c.label} style={{ background: `rgba(${scoop.id === "pearl" ? "255,143,171" : scoop.id === "crystal" ? "200,178,232" : "212,186,255"},0.12)`, border: `1px solid ${scoop.glowColor}`, borderRadius: "50px", padding: "5px 12px", fontSize: "0.78rem", fontWeight: 600, color: scoop.accentColor }}>
                    {c.emoji} {c.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferences saved preview */}
            {savedPrefs && (savedPrefs.chips.length > 0 || savedPrefs.text) && (
              <div
                style={{ background: "rgba(255,143,171,0.06)", border: "1px solid rgba(255,143,171,0.2)", borderRadius: "20px", padding: "1.5rem", animationDelay: "0.2s" }}
                className="order-card-anim"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.8rem", flexWrap: "wrap", gap: "8px" }}>
                  <SectionLabel>Your Preferences ✓</SectionLabel>
                  <button onClick={() => setDialogOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700, color: scoop.accentColor, fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)" }}>Edit →</button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: savedPrefs.text ? "0.8rem" : 0 }}>
                  {savedPrefs.chips.map((c) => (
                    <span key={c} style={{ background: "linear-gradient(135deg,#FF8FAB,#C8B2E8)", color: "white", borderRadius: "50px", padding: "4px 12px", fontSize: "0.72rem", fontWeight: 700 }}>{c}</span>
                  ))}
                </div>
                {savedPrefs.text && (
                  <p style={{ fontSize: "0.82rem", color: "#7A5C8A", fontWeight: 500, lineHeight: 1.6, margin: 0 }}>&ldquo;{savedPrefs.text}&rdquo;</p>
                )}
              </div>
            )}

            {/* FAQ */}
            <div
              className="order-card-anim"
              style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: "24px", border: "1px solid rgba(200,178,232,0.2)", padding: "2rem", animationDelay: "0.2s" }}
            >
              <SectionLabel>Frequently Asked</SectionLabel>
              <div style={{ marginTop: "0.5rem" }}>
                {scoop.faqs.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span>{faq.q}</span>
                      <span style={{ fontSize: "1rem", color: scoop.accentColor, transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s", display: "inline-block", flexShrink: 0 }}>
                        ⌄
                      </span>
                    </button>
                    <div className="faq-answer" style={{ maxHeight: openFaq === i ? "200px" : 0, opacity: openFaq === i ? 1 : 0, paddingBottom: openFaq === i ? "14px" : 0 }}>
                      <p style={{ fontSize: "0.83rem", color: "#A887B8", lineHeight: 1.65, fontWeight: 500, margin: 0 }}>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN — Order Summary (sticky) ════ */}
          <div style={{ position: "sticky", top: "88px" }}>
            <div
              className="order-card-anim"
              style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: "28px", border: "1px solid rgba(200,178,232,0.25)", boxShadow: "0 16px 56px rgba(200,178,232,0.2)", overflow: "hidden" }}
            >
              {/* Gradient header strip */}
              <div style={{ padding: "1.4rem 1.8rem", background: scoop.ctaGradient, position: "relative", overflow: "hidden" }}>
                <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,0.12),transparent)", pointerEvents: "none" }} />
                <div style={{ position: "relative", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                  Order Summary
                </div>
                <div style={{ position: "relative", fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.5rem", fontWeight: 900, color: "white" }}>
                  {scoop.name} {scoop.emoji}
                </div>
              </div>

              <div style={{ padding: "1.6rem 1.8rem" }}>

                {/* Price breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.2rem" }}>
                  <PriceRow label={`${scoop.tier} (${scoop.itemCount})`} value={`₹${basePrice.toLocaleString("en-IN")}`} />
                  <PriceRow label="Delivery" value={deliveryCharge === 0 ? "FREE 🎉" : `₹${deliveryCharge}`} highlight={deliveryCharge === 0} />
                  <PriceRow label={`GST (${scoop.taxRate * 100}%)`} value={`₹${tax}`} soft />
                  <div style={{ height: "1px", background: "rgba(200,178,232,0.25)", margin: "4px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 800, color: "#3D2C47" }}>Total</span>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.6rem", fontWeight: 900, color: "#3D2C47" }}>₹{total.toLocaleString("en-IN")}</div>
                      <div style={{ fontSize: "0.7rem", color: "#A887B8", fontWeight: 600, textDecoration: "line-through" }}>{scoop.originalPrice}</div>
                    </div>
                  </div>
                </div>

                {/* Delivery info */}
                <div style={{ background: "rgba(200,178,232,0.1)", borderRadius: "14px", padding: "10px 14px", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", fontWeight: 600, color: "#7A5C8A" }}>
                  <span>🚚</span>
                  <span>Estimated delivery: <strong style={{ color: "#3D2C47" }}>{scoop.deliveryDays}</strong></span>
                </div>

                {/* Preferences button */}
                <button
                  onClick={() => setDialogOpen(true)}
                  style={{ width: "100%", border: "2px solid rgba(200,178,232,0.4)", borderRadius: "16px", padding: "12px", marginBottom: "12px", background: savedPrefs ? "rgba(255,143,171,0.06)" : "rgba(255,255,255,0.8)", cursor: "pointer", fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)", fontSize: "0.88rem", fontWeight: 700, color: "#7A5C8A", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#FF8FAB"; (e.currentTarget as HTMLButtonElement).style.color = "#FF8FAB"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,178,232,0.4)"; (e.currentTarget as HTMLButtonElement).style.color = "#7A5C8A"; }}
                >
                  {savedPrefs ? "✓ Preferences Saved — Edit" : "📝 Add My Preferences"}
                </button>

                {/* Checkout button */}
                <button
                  className="order-btn-main"
                  onClick={handleCheckout}
                  disabled={loading}
                  style={{ width: "100%", border: "none", borderRadius: "50px", padding: "16px", background: scoop.ctaGradient, color: "white", fontSize: "0.95rem", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)", boxShadow: `0 8px 28px ${scoop.glowColor}`, opacity: loading ? 0.75 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {loading ? (
                    <>
                      <span style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                      Opening Checkout...
                    </>
                  ) : (
                    <>Pay ₹{total.toLocaleString("en-IN")} Securely ✦</>
                  )}
                </button>

                {/* Trust micro-badges */}
                <div style={{ display: "flex", justifyContent: "center", gap: "1.2rem", marginTop: "1rem", flexWrap: "wrap" }}>
                  {["🔐 Secure", "⚡ Instant", "↩️ Easy Returns"].map((t) => (
                    <span key={t} style={{ fontSize: "0.7rem", fontWeight: 600, color: "#A887B8" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ PREFERENCE DIALOG ════ */}
      {dialogOpen && (
        <div className="pref-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDialogOpen(false); }}>
          <div className="pref-dialog">
            {/* Dialog header */}
            <div style={{ padding: "1.8rem 1.8rem 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#FF8FAB", marginBottom: "4px" }}>✦ Personalise Your Scoop</div>
                <h2 style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)", fontSize: "1.5rem", fontWeight: 900, color: "#3D2C47" }}>Your Rules 🌸</h2>
                <p style={{ fontSize: "0.82rem", color: "#A887B8", fontWeight: 500, marginTop: "4px", lineHeight: 1.55 }}>Tell us what to skip — we&apos;ll curate everything else around you.</p>
              </div>
              <button
                onClick={() => setDialogOpen(false)}
                style={{ background: "rgba(200,178,232,0.15)", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,143,171,0.2)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,178,232,0.15)"; }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "1.4rem 1.8rem" }}>
              {/* Quick exclusion chips */}
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#A887B8", letterSpacing: "0.5px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>
                Quick excludes — tap to select
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1.4rem" }}>
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    className={`chip-quick ${chips[chip] ? "on" : "off"}`}
                    onClick={() => toggleChip(chip)}
                  >
                    {chips[chip] ? "✓ " : ""}{chip}
                  </button>
                ))}
              </div>

              {/* Active chips preview */}
              {activeChips.length > 0 && (
                <div style={{ background: "rgba(255,143,171,0.06)", borderRadius: "14px", padding: "10px 14px", marginBottom: "1.2rem", fontSize: "0.78rem", fontWeight: 600, color: "#7A5C8A" }}>
                  Excluding: {activeChips.join(", ")}
                </div>
              )}

              {/* Free text */}
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#A887B8", letterSpacing: "0.5px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                Tell us more ✨
              </label>
              <textarea
                className="textarea-pref"
                value={prefText}
                onChange={(e) => setPrefText(e.target.value)}
                placeholder="e.g. I love pastel colours, no red or orange please. Obsessed with soft girl aesthetic — hair clips, stationery, and cute skincare are my thing! 🌸"
                maxLength={400}
              />
              <div style={{ textAlign: "right", fontSize: "0.7rem", color: "#D0B0D8", marginTop: "4px" }}>{prefText.length}/400</div>

              {/* Hint */}
              <p style={{ fontSize: "0.74rem", color: "#A887B8", fontWeight: 500, marginTop: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#FF8FAB", flexShrink: 0, display: "inline-block" }} />
                We read every single note with love. Your scoop will always feel personal.
              </p>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "1.4rem" }}>
                <button
                  onClick={() => setDialogOpen(false)}
                  style={{ flex: 1, border: "2px solid rgba(200,178,232,0.4)", borderRadius: "50px", padding: "13px", background: "transparent", cursor: "pointer", fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)", fontSize: "0.88rem", fontWeight: 700, color: "#7A5C8A", transition: "all 0.2s" }}
                >
                  Cancel
                </button>
                <button
                  onClick={savePrefs}
                  style={{ flex: 2, border: "none", borderRadius: "50px", padding: "13px", background: "linear-gradient(135deg,#FF8FAB,#C8B2E8)", color: "white", cursor: "pointer", fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)", fontSize: "0.88rem", fontWeight: 800, boxShadow: "0 6px 20px rgba(255,143,171,0.35)", transition: "all 0.2s" }}
                  className="order-btn-main"
                >
                  Save Preferences ✦
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive grid fix */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .order-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

// ─── Small helper components ──────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: "#FF8FAB", display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "linear-gradient(135deg,#FF8FAB,#C8B2E8)", display: "inline-block", flexShrink: 0 }} />
      {children}
    </div>
  );
}

function PriceRow({ label, value, highlight, soft }: { label: string; value: string; highlight?: boolean; soft?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "0.84rem", fontWeight: 600, color: soft ? "#C8B2E8" : "#A887B8" }}>{label}</span>
      <span style={{ fontSize: "0.84rem", fontWeight: 700, color: highlight ? "#5DB87A" : soft ? "#C8B2E8" : "#3D2C47" }}>{value}</span>
    </div>
  );
}