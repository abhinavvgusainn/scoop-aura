"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LastOrder {
  paymentId: string;
  orderId: string;
  scoopName: string;
  scoopEmoji: string;
  total: number;
  fullName: string;
  deliveryDays: string;
}

// ─── Keyframe animations (cannot be expressed in Tailwind utilities) ──────────
const KEYFRAMES_CSS = `
  @keyframes blobDrift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(30px, 20px) scale(1.05); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes popIn {
    0%   { opacity: 0; transform: scale(0.4) rotate(-15deg); }
    60%  { opacity: 1; transform: scale(1.18) rotate(4deg); }
    80%  { transform: scale(0.94) rotate(-2deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes ringPulse {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(2.1); opacity: 0; }
  }
  @keyframes confettiFall {
    0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
    100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes tickDraw {
    from { stroke-dashoffset: 60; }
    to   { stroke-dashoffset: 0; }
  }

  /* Named animation classes */
  .anim-blob-drift   { animation: blobDrift 16s ease-in-out infinite alternate; }
  .anim-fade-up      { animation: fadeUp 0.55s ease both; }
  .anim-scale-in     { animation: scaleIn 0.5s ease both; }
  .anim-pop-in       { animation: popIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both; }
  .anim-ring-pulse-1 { animation: ringPulse 1.4s ease-out forwards; animation-delay: 0.5s; }
  .anim-ring-pulse-2 { animation: ringPulse 1.4s ease-out forwards; animation-delay: 0.75s; }
  .anim-float        { animation: float 3s ease-in-out infinite; }
  .anim-confetti     { animation: confettiFall 2s ease-in forwards; }
  .anim-tick-draw    {
    animation: tickDraw 0.5s ease forwards;
    animation-delay: 0.55s;
  }

  /* Shimmer text */
  .shimmer-text {
    background: linear-gradient(
      90deg,
      #FF8FAB 0%, #C8B2E8 30%, #FF8FAB 50%, #C8B2E8 70%, #FF8FAB 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  /* Browse button hover/active */
  .browse-btn { transition: transform 0.2s, filter 0.2s, box-shadow 0.2s; }
  .browse-btn:hover  { transform: translateY(-2px); filter: brightness(1.07); }
  .browse-btn:active { transform: translateY(0) scale(0.97); }
`;

// ─── Confetti colours ─────────────────────────────────────────────────────────
const CONFETTI_COLOURS = [
  "#FF8FAB", "#C8B2E8", "#FFD6E0", "#B8D8F8",
  "#FFCBA4", "#A8D8B9", "#FFF0C8",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrderSuccessPage() {
  const router = useRouter();
  const cssRef = useRef(false);
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [confetti, setConfetti] = useState<
    { id: number; left: number; delay: number; colour: string; rotate: number; circle: boolean }[]
  >([]);
  const [visible, setVisible] = useState(false);

  // Inject keyframe CSS
  useEffect(() => {
    if (cssRef.current) return;
    cssRef.current = true;
    const s = document.createElement("style");
    s.textContent = KEYFRAMES_CSS;
    document.head.appendChild(s);
  }, []);

  // Load order from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lastOrder");
      if (raw) setOrder(JSON.parse(raw));
    } catch { /* ignore */ }

    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Generate confetti burst
  useEffect(() => {
    const pieces = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.2,
      colour: CONFETTI_COLOURS[Math.floor(Math.random() * CONFETTI_COLOURS.length)],
      rotate: Math.random() * 360,
      circle: Math.random() > 0.5,
    }));
    setConfetti(pieces);
  }, []);

  const formatPaymentId = (id?: string) =>
    id ? `${id.slice(0, 8)}…${id.slice(-6)}` : "—";

  // ── Order detail rows ──────────────────────────────────────────────────────
  const detailRows = [
    { label: "Payment ID",          value: formatPaymentId(order?.paymentId), mono: true },
    { label: "Amount Paid",         value: order ? `₹${order.total.toLocaleString("en-IN")}` : "—" },
    { label: "Estimated Delivery",  value: order?.deliveryDays ?? "5–7 business days" },
  ];

  // ── Next-step items ────────────────────────────────────────────────────────
  const nextSteps = [
    { icon: "🎀", title: "Curating your scoop", desc: "Our team hand-picks items based on your preferences, with love.",                                                              delay: "0.5s" },
    { icon: "🚚", title: "Packed & dispatched", desc: `Your scoop ships within 1–2 business days. Expected arrival: ${order?.deliveryDays ?? "5–7 days"}.`,                          delay: "0.6s" },
    { icon: "🌸", title: "Unbox the magic",     desc: "Every scoop is wrapped with care — made to be unwrapped slowly.",                                                              delay: "0.7s" },
  ];

  return (
    <>
      {/* ── Background blobs ─────────────────────────────────────────────────── */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Blob 1 – top-left */}
        <div
          className="anim-blob-drift absolute rounded-full"
          style={{
            width: 520, height: 520,
            background: "radial-gradient(circle,#FFD6E0,#E8DCFF)",
            filter: "blur(90px)",
            opacity: 0.3,
            top: "-100px", left: "-80px",
            animationDelay: "0s",
          }}
        />
        {/* Blob 2 – mid-right */}
        <div
          className="anim-blob-drift absolute rounded-full"
          style={{
            width: 380, height: 380,
            background: "radial-gradient(circle,#B8F0D8,#B8D8F8)",
            filter: "blur(90px)",
            opacity: 0.3,
            top: "50%", right: "-80px",
            animationDelay: "5s",
          }}
        />
        {/* Blob 3 – bottom-left */}
        <div
          className="anim-blob-drift absolute rounded-full"
          style={{
            width: 300, height: 300,
            background: "radial-gradient(circle,#FFF0C8,#FFD6E0)",
            filter: "blur(90px)",
            opacity: 0.3,
            bottom: "5%", left: "15%",
            animationDelay: "10s",
          }}
        />
      </div>

      {/* ── Confetti burst ───────────────────────────────────────────────────── */}
      <div aria-hidden className="fixed top-[15%] left-0 right-0 z-[2] pointer-events-none h-0">
        {confetti.map((p) => (
          <div
            key={p.id}
            className="anim-confetti absolute w-2 h-2"
            style={{
              left: `${p.left}%`,
              background: p.colour,
              animationDelay: `${p.delay}s`,
              transform: `rotate(${p.rotate}deg)`,
              borderRadius: p.circle ? "50%" : "2px",
            }}
          />
        ))}
      </div>

      {/* ── Page content ─────────────────────────────────────────────────────── */}
      <div
        className={`
          relative z-[1] min-h-screen flex flex-col items-center justify-center
          px-[5%] pt-10 pb-20 transition-opacity duration-400 ease-in
          ${visible ? "opacity-100" : "opacity-0"}
        `}
      >
        <div className="w-full max-w-[560px]">

          {/* ── Big success icon ──────────────────────────────────────────── */}
          <div className="flex justify-center mb-8">
            <div className="relative w-[100px] h-[100px]">
              {/* Pulsing ring 1 */}
              <div
                className="anim-ring-pulse-1 absolute rounded-full border-[3px]"
                style={{
                  inset: "-14px",
                  borderColor: "rgba(255,143,171,0.35)",
                }}
              />
              {/* Pulsing ring 2 */}
              <div
                className="anim-ring-pulse-2 absolute rounded-full border-2"
                style={{
                  inset: "-28px",
                  borderColor: "rgba(200,178,232,0.2)",
                }}
              />
              {/* Circle + tick */}
              <div
                className="anim-pop-in w-[100px] h-[100px] rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #FF8FAB, #C8B2E8)",
                  boxShadow: "0 12px 40px rgba(255,143,171,0.45)",
                }}
              >
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
                  <path
                    d="M10 22L18.5 31L34 14"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="60"
                    strokeDashoffset="60"
                    className="anim-tick-draw"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* ── Headline ──────────────────────────────────────────────────── */}
          <div
            className="anim-fade-up text-center mb-8"
            style={{ animationDelay: "0.15s" }}
          >
            <p
              className="text-[0.75rem] font-extrabold tracking-[1.8px] uppercase mb-[10px]"
              style={{ color: "#FF8FAB", fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)" }}
            >
              ✦ Payment Confirmed
            </p>
            <h1
              className="shimmer-text mb-3"
              style={{
                fontFamily: "var(--font-playfair,'Playfair Display',serif)",
                fontSize: "clamp(2rem,5vw,3rem)",
                fontWeight: 900,
                lineHeight: 1.1,
              }}
            >
              Your Scoop is on its way!
            </h1>
            <p
              className="text-[0.92rem] font-medium leading-[1.65]"
              style={{ color: "#A887B8", fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)" }}
            >
              {order?.fullName ? `Hey ${order.fullName.split(" ")[0]}! 🌸` : "🌸"}{" "}
              We&apos;ve received your order and are already curating your surprise.
            </p>
          </div>

          {/* ── Order summary card ────────────────────────────────────────── */}
          <div
            className="anim-scale-in mb-[1.4rem] overflow-hidden rounded-[32px] border"
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: "rgba(200,178,232,0.25)",
              boxShadow: "0 20px 64px rgba(200,178,232,0.22)",
              animationDelay: "0.25s",
            }}
          >
            {/* Card header */}
            <div
              className="relative px-[1.8rem] py-[1.4rem]"
              style={{ background: "linear-gradient(135deg, #FF8FAB, #C8B2E8)" }}
            >
              {/* Gloss overlay */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.1),transparent)" }}
              />
              <div className="relative flex justify-between items-center">
                <div>
                  <div
                    className="text-[0.68rem] font-extrabold tracking-[1.2px] uppercase mb-[3px]"
                    style={{ color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)" }}
                  >
                    Order Confirmed
                  </div>
                  <div
                    className="text-[1.4rem] font-black text-white"
                    style={{ fontFamily: "var(--font-playfair,'Playfair Display',serif)" }}
                  >
                    {order?.scoopName ?? "Mystery Scoop"} {order?.scoopEmoji ?? "✨"}
                  </div>
                </div>
                <div className="anim-float text-[2.2rem]" aria-hidden>🎁</div>
              </div>
            </div>

            {/* Detail rows */}
            <div className="px-[1.8rem] py-[1.2rem]">
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-start gap-4 py-3 border-b last:border-b-0"
                  style={{
                    borderColor: "rgba(200,178,232,0.15)",
                    fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)",
                  }}
                >
                  <span
                    className="text-[0.75rem] font-bold uppercase tracking-[0.5px]"
                    style={{ color: "#C8B2E8" }}
                  >
                    {row.label}
                  </span>
                  <span
                    className="text-[0.88rem] font-bold text-right break-all"
                    style={{
                      color: "#3D2C47",
                      ...(row.mono
                        ? { fontFamily: "monospace", fontSize: "0.82rem", letterSpacing: "0.3px" }
                        : {}),
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── What happens next ─────────────────────────────────────────── */}
          <div
            className="anim-scale-in mb-8 px-[1.8rem] py-[1.6rem] rounded-[32px] border"
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: "rgba(200,178,232,0.25)",
              boxShadow: "0 20px 64px rgba(200,178,232,0.22)",
              animationDelay: "0.35s",
            }}
          >
            <div
              className="text-[0.72rem] font-extrabold tracking-[1.2px] uppercase mb-4"
              style={{ color: "#A887B8", fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)" }}
            >
              What happens next
            </div>

            {nextSteps.map((step) => (
              <div
                key={step.title}
                className="anim-fade-up flex items-start gap-[14px] py-[14px] border-b last:border-b-0"
                style={{
                  borderColor: "rgba(200,178,232,0.12)",
                  animationDelay: step.delay,
                }}
              >
                {/* Icon bubble */}
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[1.1rem]"
                  style={{ background: "linear-gradient(135deg, rgba(255,143,171,0.12), rgba(200,178,232,0.12))" }}
                >
                  {step.icon}
                </div>
                <div>
                  <div
                    className="text-[0.88rem] font-extrabold mb-[3px]"
                    style={{ color: "#3D2C47", fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)" }}
                  >
                    {step.title}
                  </div>
                  <div
                    className="text-[0.8rem] font-medium leading-[1.6]"
                    style={{ color: "#A887B8", fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)" }}
                  >
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── CTA buttons ───────────────────────────────────────────────── */}
          <div
            className="anim-fade-up flex flex-col gap-3"
            style={{ animationDelay: "0.5s" }}
          >
            {/* Primary CTA */}
            <button
              type="button"
              className="browse-btn w-full border-none rounded-[50px] py-[17px] text-white text-[0.95rem] font-extrabold cursor-pointer flex items-center justify-center gap-2"
              onClick={() => router.push("/")}
              style={{
                background: "linear-gradient(135deg, #FF8FAB, #C8B2E8)",
                fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)",
                boxShadow: "0 10px 32px rgba(255,143,171,0.4)",
              }}
            >
              Explore More Scoops ✦
            </button>

            {/* Secondary CTA */}
            <button
              type="button"
              className="browse-btn w-full rounded-[50px] py-[15px] text-[0.88rem] font-bold cursor-pointer"
              onClick={() => router.push("/#scoops")}
              style={{
                border: "2px solid rgba(200,178,232,0.4)",
                background: "rgba(255,255,255,0.7)",
                color: "#7A5C8A",
                fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)",
                backdropFilter: "blur(8px)",
              }}
            >
              ← Back to Home
            </button>
          </div>

          {/* ── Footer note ───────────────────────────────────────────────── */}
          <p
            className="anim-fade-up text-center text-[0.74rem] font-medium mt-8 leading-[1.65]"
            style={{
              color: "#C8B2E8",
              fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)",
              animationDelay: "0.6s",
            }}
          >
            Questions? Reach us at{" "}
            <a
              href="mailto:hello@scoopaura.com"
              className="font-bold no-underline"
              style={{ color: "#FF8FAB" }}
            >
              hello@scoopaura.com
            </a>
            {" "}— we&apos;re always here. 🌸
          </p>

        </div>
      </div>
    </>
  );
}