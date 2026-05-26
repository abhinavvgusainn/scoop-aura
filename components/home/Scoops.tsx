"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const SECTION_CSS = `
  @keyframes rotateBorder {
    0%   { transform: rotate(0deg);   }
    100% { transform: rotate(360deg); }
  }
  .scoop-card-hover {
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .scoop-card-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(200,178,232,0.3) !important;
  }
  .card-cta-btn {
    width: 100%; border: none; border-radius: 50px; padding: 13px;
    font-size: 0.9rem; font-weight: 700; cursor: pointer;
    font-family: 'Quicksand', sans-serif;
    transition: transform 0.2s, filter 0.2s;
  }
  .card-cta-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }

  .reveal-scoop {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .reveal-scoop.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

type ScoopItem = {
  id: string;
  emoji: string;
  tier: string;
  tierColor: string;
  name: string;
  items: string[];
  chips: { label: string; style: React.CSSProperties }[];
  price: string;
  orig: string;
  save: string;
  ctaLabel: string;
  ctaStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
  badge?: { label: string; style: React.CSSProperties };
  isDiamond?: boolean;
};

const SCOOPS: ScoopItem[] = [
  {
    id: "pearl",
    emoji: "🌸",
    tier: "✦ Pearl Scoop",
    tierColor: "#FF8FAB",
    name: "The Pearl",
    items: [
      "6–8 curated surprise items",
      "Exclusive freebies included",
      "Aesthetic packaging",
      "Handwritten note",
    ],
    chips: [
      { label: "💄 Beauty",      style: { background: "rgba(255,182,193,0.15)", border: "1px solid rgba(255,143,171,0.25)", color: "#7A5C8A" } },
      { label: "🎀 Accessories", style: { background: "rgba(255,182,193,0.15)", border: "1px solid rgba(255,143,171,0.25)", color: "#7A5C8A" } },
      { label: "🌸 Goodies",     style: { background: "rgba(255,182,193,0.15)", border: "1px solid rgba(255,143,171,0.25)", color: "#7A5C8A" } },
    ],
    price: "₹499",
    orig: "₹799",
    save: "Save 38%",
    ctaLabel: "Order Pearl Scoop ✦",
    ctaStyle: {
      background: "linear-gradient(135deg, #FF8FAB, #FFCBA4)",
      color: "white",
      boxShadow: "0 6px 24px rgba(255,143,171,0.35)",
    },
    cardStyle: {
      background: "rgba(255,255,255,0.7)",
      boxShadow: "0 10px 40px rgba(200,178,232,0.15)",
    },
  },
  {
    id: "crystal",
    emoji: "💜",
    tier: "✦ Crystal Scoop",
    tierColor: "#A07BC0",
    name: "The Crystal",
    items: [
      "12–14 curated surprise items",
      "Extra freebies + stickers",
      "Premium gift box",
      "Custom ribbon packaging",
    ],
    chips: [
      { label: "🧴 Skincare", style: { background: "rgba(200,178,232,0.15)", border: "1px solid rgba(200,178,232,0.3)", color: "#8A6AAA" } },
      { label: "💎 Jewels",   style: { background: "rgba(200,178,232,0.15)", border: "1px solid rgba(200,178,232,0.3)", color: "#8A6AAA" } },
      { label: "✨ More",     style: { background: "rgba(200,178,232,0.15)", border: "1px solid rgba(200,178,232,0.3)", color: "#8A6AAA" } },
    ],
    price: "₹899",
    orig: "₹1,499",
    save: "Save 40%",
    ctaLabel: "Order Crystal Scoop ✦",
    ctaStyle: {
      background: "linear-gradient(135deg, #C8B2E8, #B8D8F8)",
      color: "white",
      boxShadow: "0 6px 24px rgba(200,178,232,0.35)",
    },
    cardStyle: {
      background: "rgba(255,255,255,0.7)",
      boxShadow: "0 10px 40px rgba(200,178,232,0.15)",
    },
    badge: {
      label: "Most Popular",
      style: {
        background: "linear-gradient(135deg, #FF8FAB, #C8B2E8)",
        color: "white",
      },
    },
  },
  {
    id: "diamond",
    emoji: "💎",
    tier: "✦ Diamond Scoop",
    tierColor: undefined as unknown as string,
    name: "The Diamond",
    items: [
      "15+ premium surprise items",
      "Exclusive luxury freebies",
      "Velvet gift box",
      "Personalised letter + charms",
    ],
    chips: [
      { label: "💎 Luxury",    style: { background: "rgba(212,186,255,0.18)", border: "1px solid rgba(212,186,255,0.4)", color: "#8855CC" } },
      { label: "✨ Exclusive", style: { background: "rgba(212,186,255,0.18)", border: "1px solid rgba(212,186,255,0.4)", color: "#8855CC" } },
      { label: "🌟 Rare",      style: { background: "rgba(212,186,255,0.18)", border: "1px solid rgba(212,186,255,0.4)", color: "#8855CC" } },
    ],
    price: "₹1,499",
    orig: "₹2,499",
    save: "Save 40%",
    ctaLabel: "Order Diamond Scoop ✦",
    ctaStyle: {
      background: "linear-gradient(135deg, #D4BAFF, #FF8FAB, #B8D8F8)",
      color: "white",
      boxShadow: "0 6px 24px rgba(212,186,255,0.4)",
    },
    cardStyle: {
      background: "rgba(255,255,255,0.85)",
      boxShadow: "0 10px 40px rgba(200,178,232,0.15)",
    },
    badge: {
      label: "Premium ✦",
      style: {
        background: "linear-gradient(135deg, #D4BAFF, #B8D8F8)",
        color: "#5A3A7A",
      },
    },
    isDiamond: true,
  },
];

export default function Scoops() {
  const router = useRouter();
  const injected = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!injected.current) {
      injected.current = true;
      const s = document.createElement("style");
      s.textContent = SECTION_CSS;
      document.head.appendChild(s);
    }

    // Scroll-reveal
    const cards = gridRef.current?.querySelectorAll(".reveal-scoop");
    if (!cards) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="scoops"
      style={{ padding: "90px 6%", position: "relative", zIndex: 1 }}
    >
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            color: "#FF8FAB",
            background: "rgba(255,143,171,0.1)",
            borderRadius: "50px",
            padding: "5px 14px",
            marginBottom: "0.8rem",
          }}
        >
          ✦ Our Collection
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 900,
            color: "#3D2C47",
            lineHeight: 1.15,
            marginBottom: "0.8rem",
          }}
        >
          Choose Your Scoop 🍨
        </h2>
        <p
          style={{
            color: "#A887B8",
            fontSize: "1rem",
            fontWeight: 500,
            lineHeight: 1.7,
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          Three tiers of carefully curated mystery — each one more magical than
          the last.
        </p>
      </div>

      {/* Cards grid */}
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.8rem",
        }}
      >
        {SCOOPS.map((scoop) => (
          <div
            key={scoop.id}
            className="reveal-scoop"
            style={{ position: "relative" }}
          >
            {/* Diamond animated border glow */}
            {scoop.isDiamond && (
              <div
                style={{
                  position: "absolute",
                  inset: "-3px",
                  borderRadius: "31px",
                  overflow: "hidden",
                  zIndex: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "-50%",
                    background:
                      "conic-gradient(from 0deg, #D4BAFF, #FF8FAB, #B8D8F8, #D4BAFF)",
                    animation: "rotateBorder 4s linear infinite",
                    opacity: 0.75,
                  }}
                />
              </div>
            )}

            {/* Card */}
            <div
              className="scoop-card-hover"
              style={{
                position: "relative",
                zIndex: 1,
                borderRadius: "28px",
                padding: "2.2rem 1.8rem",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                overflow: "hidden",
                ...scoop.cardStyle,
                // gradient border via box-shadow outline approach
              }}
            >
              {/* Gradient border pseudo — achieved via outline + clip trick using a wrapper overlay */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "28px",
                  padding: "1.5px",
                  background:
                    scoop.id === "pearl"
                      ? "linear-gradient(135deg,#FFB6C1,#FFCBA4)"
                      : scoop.id === "crystal"
                      ? "linear-gradient(135deg,#C8B2E8,#B8D8F8)"
                      : "linear-gradient(135deg,#D4BAFF,#FF8FAB,#B8D8F8)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  pointerEvents: "none",
                }}
              />

              {/* Glow blob top-right */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: "-60px",
                  right: "-60px",
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  background:
                    scoop.id === "pearl"
                      ? "#FFB6C1"
                      : scoop.id === "crystal"
                      ? "#C8B2E8"
                      : "#D4BAFF",
                  opacity: 0.12,
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />

              {/* Badge */}
              {scoop.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    borderRadius: "50px",
                    padding: "4px 10px",
                    ...scoop.badge.style,
                  }}
                >
                  {scoop.badge.label}
                </div>
              )}

              {/* Emoji */}
              <span
                style={{
                  fontSize: "3.5rem",
                  marginBottom: "1rem",
                  display: "block",
                }}
              >
                {scoop.emoji}
              </span>

              {/* Tier */}
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "0.3rem",
                  ...(scoop.isDiamond
                    ? {
                        background:
                          "linear-gradient(135deg, #C8B2E8, #FF8FAB)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }
                    : { color: scoop.tierColor }),
                }}
              >
                {scoop.tier}
              </div>

              {/* Name */}
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "#3D2C47",
                  marginBottom: "0.8rem",
                }}
              >
                {scoop.name}
              </div>

              {/* Items */}
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "#A887B8",
                  fontWeight: 600,
                  marginBottom: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {scoop.items.map((item) => (
                  <div
                    key={item}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <span style={{ color: "#FF8FAB", fontSize: "0.5rem" }}>
                      ✦
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              {/* Preview chips */}
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  marginBottom: "1.4rem",
                  flexWrap: "wrap",
                }}
              >
                {scoop.chips.map((chip) => (
                  <span
                    key={chip.label}
                    style={{
                      borderRadius: "50px",
                      padding: "4px 10px",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      ...chip.style,
                    }}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>

              {/* Price */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "6px",
                  marginBottom: "1.4rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2.2rem",
                    fontWeight: 900,
                    color: "#3D2C47",
                  }}
                >
                  {scoop.price}
                </span>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#A887B8",
                    textDecoration: "line-through",
                  }}
                >
                  {scoop.orig}
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#5DB87A",
                    background: "rgba(93,184,122,0.12)",
                    borderRadius: "50px",
                    padding: "2px 8px",
                  }}
                >
                  {scoop.save}
                </span>
              </div>

              {/* CTA */}
              <button
                className="card-cta-btn"
                style={scoop.ctaStyle}
                onClick={() => router.push(`/order/${scoop.id}`)}
              >
                {scoop.ctaLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}