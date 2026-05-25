"use client";

import { useEffect, useRef } from "react";

const PROCESS_CSS = `
  .hiw-card-hover {
    transition: transform 0.25s;
  }
  .hiw-card-hover:hover {
    transform: translateY(-5px);
  }
  .reveal-hiw {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .reveal-hiw.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const STEPS = [
  {
    num: "1",
    icon: "🛍️",
    iconBg: "linear-gradient(135deg, rgba(255,182,193,0.3), rgba(255,203,164,0.3))",
    title: "Choose Your Scoop",
    desc: "Pick from Pearl, Crystal, or Diamond — each a different level of magical surprise.",
  },
  {
    num: "2",
    icon: "📝",
    iconBg: "linear-gradient(135deg, rgba(200,178,232,0.3), rgba(184,216,248,0.3))",
    title: "Add Preferences",
    desc: "Tell us what you love or avoid — no earrings, specific colors, or product types.",
  },
  {
    num: "3",
    icon: "💳",
    iconBg: "linear-gradient(135deg, rgba(212,186,255,0.3), rgba(255,182,193,0.3))",
    title: "Secure Payment",
    desc: "Pay safely via UPI, cards, or net banking. 100% secure checkout guaranteed.",
  },
  {
    num: "4",
    icon: "🎁",
    iconBg: "linear-gradient(135deg, rgba(184,216,248,0.3), rgba(200,178,232,0.3))",
    title: "Receive & Unbox",
    desc: "Your scoop arrives in dreamy packaging. Unbox, react, and tag us on Instagram!",
  },
];

export default function Process() {
  const injected = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!injected.current) {
      injected.current = true;
      const s = document.createElement("style");
      s.textContent = PROCESS_CSS;
      document.head.appendChild(s);
    }

    const cards = gridRef.current?.querySelectorAll(".reveal-hiw");
    if (!cards) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.12 }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="process"
      style={{
        padding: "90px 6%",
        background: "rgba(255,255,255,0.35)",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Header */}
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
          ✦ The Process
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
          How It Works 🎀
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
          Getting your mystery scoop is simple, cute, and completely stress-free.
        </p>
      </div>

      {/* Steps grid */}
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className="reveal-hiw hiw-card-hover"
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "24px",
              padding: "2rem 1.5rem",
              border: "1px solid rgba(200,178,232,0.2)",
              boxShadow: "0 6px 28px rgba(200,178,232,0.12)",
              textAlign: "center",
              position: "relative",
              // stagger reveal
              transitionDelay: `${i * 0.1}s`,
            }}
          >
            {/* Step number badge */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF8FAB, #C8B2E8)",
                color: "white",
                fontSize: "0.72rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Quicksand', sans-serif",
              }}
            >
              {step.num}
            </div>

            {/* Icon */}
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "20px",
                margin: "0 auto 1.2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                background: step.iconBg,
              }}
            >
              {step.icon}
            </div>

            {/* Title */}
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#3D2C47",
                marginBottom: "0.5rem",
              }}
            >
              {step.title}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: "0.82rem",
                color: "#A887B8",
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}