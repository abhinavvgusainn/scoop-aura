"use client";

import { useEffect, useState } from "react";

/* ───────────────────────────────────────────── */
/* DATA */
/* ───────────────────────────────────────────── */

const FLOATING_ITEMS = [
  {
    emoji: "💄",
    label: "Lip Gloss",
    delay: "0.5s",
    className:
      "w-[84px] h-[84px] top-[40px] left-[4px] md:left-[10px]",
  },
  {
    emoji: "🧴",
    label: "Skin Care",
    delay: "1s",
    className:
      "w-[84px] h-[84px] top-[18px] right-[8px]",
  },
  {
    emoji: "💍",
    label: "Jewellery",
    delay: "1.5s",
    className:
      "w-[76px] h-[76px] bottom-[78px] left-[10px]",
  },
  {
    emoji: "🎀",
    label: "Hair Acc.",
    delay: "0.8s",
    className:
      "w-[76px] h-[76px] bottom-[58px] right-[10px]",
  },
  {
    emoji: "🌸",
    label: "Goodies",
    delay: "2s",
    className:
      "w-[70px] h-[70px] top-1/2 -translate-y-1/2 right-[0px]",
  },
];

const SPARKLES = [
  {
    emoji: "✨",
    className: "top-[30px] left-[60px]",
    delay: "0s",
  },
  {
    emoji: "⭐",
    className: "top-[60px] right-[60px]",
    delay: "0.5s",
  },
  {
    emoji: "💫",
    className: "bottom-[100px] left-[40px]",
    delay: "1s",
  },
  {
    emoji: "✨",
    className: "bottom-[50px] right-[80px]",
    delay: "1.5s",
  },
];

const STATS = [
  {
    value: "12k+",
    label: "Happy Girlies",
  },
  {
    value: "98%",
    label: "Love Rate",
  },
  {
    value: "4.9★",
    label: "Avg Rating",
  },
];

/* ───────────────────────────────────────────── */
/* STYLES */
/* ───────────────────────────────────────────── */

const gradientTextStyle: React.CSSProperties = {
  background:
    "linear-gradient(135deg, #FF8FAB 0%, #C8B2E8 50%, #B8D8F8 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  display: "block",
};

/* ───────────────────────────────────────────── */
/* COMPONENT */
/* ───────────────────────────────────────────── */

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="
        relative isolate z-10
        flex min-h-svh
        w-full
        flex-col md:flex-row
        items-center justify-between

        overflow-hidden

        px-6 md:px-[6%]

        pt-[92px]
        pb-[24px]

        md:pt-[88px]
        md:pb-[40px]

        gap-[4%]
      "
    >

      {/* ───────────────────── */}
      {/* BACKGROUND BLOBS */}
      {/* ───────────────────── */}

      <div
        className="
          absolute inset-0
          z-0
          overflow-hidden
          pointer-events-none
        "
      >
        <div
          className="
            absolute
            top-[-120px]
            left-[-80px]

            h-[500px]
            w-[500px]

            rounded-full
            opacity-30
            blur-[90px]

            animate-blob-drift
          "
          style={{
            background:
              "radial-gradient(circle, #FFB6C1, #E8DCFF)",
          }}
        />

        <div
          className="
            absolute
            right-[-100px]
            top-[40%]

            h-[420px]
            w-[420px]

            rounded-full
            opacity-30
            blur-[90px]

            animate-blob-drift
          "
          style={{
            background:
              "radial-gradient(circle, #B8D8F8, #C8B2E8)",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* ───────────────────── */}
      {/* LEFT CONTENT */}
      {/* ───────────────────── */}

      <div
        className="
          relative z-10
          flex flex-1 flex-col

          items-center md:items-start

          text-center md:text-left

          max-w-[520px]
        "
      >

        {/* BADGE */}

        <span
          className="
            mb-5

            inline-flex items-center gap-2

            rounded-full

            border border-pink-200/60
            bg-pink-100/40

            px-4 py-[7px]

            text-[0.72rem]
            font-bold
            uppercase
            tracking-[0.8px]

            text-[#FF8FAB]
          "
          style={{
            opacity: mounted ? undefined : 0,
            animation:
              mounted
                ? "fadeUp 0.6s ease both"
                : "none",
          }}
        >
          ✦ India&apos;s #1 Mystery Box Brand
        </span>

        {/* HEADLINE */}

        <h1
          className="
            font-playfair
            font-black

            text-[clamp(3rem,6vw,5rem)]

            leading-[1.02]
            tracking-[-2px]

            text-[#3D2C47]

            mb-4

            overflow-visible
          "
          style={{
            opacity: mounted ? undefined : 0,
            animation:
              mounted
                ? "fadeUp 0.7s 0.1s ease both"
                : "none",
          }}
        >
          <span className="block">
            Unbox the
          </span>

          <span
            className="block"
            style={gradientTextStyle}
          >
            Aura of
          </span>

          <span
            className="block pb-2"
            style={gradientTextStyle}
          >
            Mystery!
          </span>
        </h1>

        {/* SUBTEXT */}

        <p
          className="
            mb-6

            max-w-[420px]

            text-[1rem]
            leading-[1.7]

            font-medium

            text-[#7A5C8A]
          "
          style={{
            opacity: mounted ? undefined : 0,
            animation:
              mounted
                ? "fadeUp 0.7s 0.2s ease both"
                : "none",
          }}
        >
          Discover surprise scoops filled with
          cute aesthetic goodies, self-care
          items, accessories, and exclusive
          freebies — curated just for you.
        </p>

        {/* BUTTONS */}

        <div
          className="
            flex flex-wrap
            justify-center md:justify-start
            gap-2.5
          "
          style={{
            opacity: mounted ? undefined : 0,
            animation:
              mounted
                ? "fadeUp 0.7s 0.3s ease both"
                : "none",
          }}
        >
          <PrimaryButton>
            ✦ Shop Scoops
          </PrimaryButton>

          <SecondaryButton>
            Explore Mystery →
          </SecondaryButton>
        </div>

        {/* STATS */}

        <div
          className="
            mt-8
            flex
            gap-7
            justify-center md:justify-start
          "
          style={{
            opacity: mounted ? undefined : 0,
            animation:
              mounted
                ? "fadeUp 0.7s 0.4s ease both"
                : "none",
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label}>

              <div
                className="
                  font-playfair
                  text-[1.7rem]
                  font-black
                  leading-none
                "
                style={{
                  background:
                    "linear-gradient(135deg, #FF8FAB, #C8B2E8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:
                    "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </div>

              <div
                className="
                  mt-[3px]

                  text-[0.73rem]
                  font-semibold
                  tracking-[0.2px]

                  text-[#A887B8]
                "
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────── */}
      {/* RIGHT VISUAL */}
      {/* ───────────────────── */}

      <div
        className="
          relative z-10

          mt-4 md:mt-0

          flex flex-1
          items-center justify-center

          w-full

          min-h-[340px]
          md:min-h-[520px]
        "
        style={{
          opacity: mounted ? undefined : 0,
          animation:
            mounted
              ? "fadeUp 0.8s 0.2s ease both"
              : "none",
        }}
      >

        {/* SPARKLES */}

        {SPARKLES.map((sp, i) => (
          <span
            key={i}
            className={`
              absolute
              pointer-events-none
              text-[1.4rem]

              ${sp.className}
            `}
            style={{
              animation:
                "sparkleAnim 2s ease-in-out infinite alternate",
              animationDelay: sp.delay,
            }}
          >
            {sp.emoji}
          </span>
        ))}

        {/* FLOATING PILLS */}

        {FLOATING_ITEMS.map((item, i) => (
          <div
            key={i}
            className={`
              absolute

              flex flex-col
              items-center justify-center

              rounded-[18px]

              p-3

              ${item.className}
            `}
            style={{
              background:
                "rgba(255,255,255,0.85)",

              backdropFilter: "blur(12px)",

              WebkitBackdropFilter:
                "blur(12px)",

              boxShadow:
                "0 8px 32px rgba(200,178,232,0.25)",

              border:
                "1px solid rgba(255,255,255,0.8)",

              animation:
                "floatItem 4s ease-in-out infinite",

              animationDelay: item.delay,
            }}
          >
            <span className="text-[1.7rem] leading-none">
              {item.emoji}
            </span>

            <span
              className="
                mt-1

                whitespace-nowrap

                text-[0.62rem]
                font-bold

                text-[#A887B8]
              "
            >
              {item.label}
            </span>
          </div>
        ))}

        {/* CENTER BOX */}

        <div
          className="
            relative z-10

            flex flex-col
            items-center justify-center

            h-[240px]
            w-[240px]

            md:h-[280px]
            md:w-[280px]

            rounded-[32px]
          "
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,249,240,0.82))",

            boxShadow:
              "0 20px 60px rgba(200,178,232,0.35), 0 0 0 1px rgba(200,178,232,0.2)",

            backdropFilter: "blur(20px)",

            WebkitBackdropFilter:
              "blur(20px)",

            animation:
              "floatBox 4s ease-in-out infinite",
          }}
        >
          <span className="text-[5.5rem] md:text-[7rem] leading-none">
            🎁
          </span>

          <span
            className="
              mt-2

              font-playfair
              text-[0.85rem]
              font-bold

              uppercase
              tracking-[1px]

              text-[#7A5C8A]
            "
          >
            Mystery Scoop
          </span>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────── */
/* BUTTONS */
/* ───────────────────────────────────────────── */

function PrimaryButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button
      className="
        rounded-full

        px-8 py-[14px]

        text-[0.93rem]
        font-bold
        text-white

        transition-all duration-200

        hover:-translate-y-[2px]
        active:scale-95
      "
      style={{
        background:
          "linear-gradient(135deg, #FF8FAB, #C8B2E8)",

        boxShadow:
          "0 8px 30px rgba(255,143,171,0.4)",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button
      className="
        rounded-full

        px-7 py-[13px]

        text-[0.93rem]
        font-bold

        text-[#7A5C8A]

        transition-all duration-200

        hover:-translate-y-[2px]
        hover:bg-white/90

        active:scale-95
      "
      style={{
        background:
          "rgba(255,255,255,0.70)",

        backdropFilter: "blur(10px)",

        WebkitBackdropFilter:
          "blur(10px)",

        border:
          "2px solid rgba(200,178,232,0.5)",
      }}
    >
      {children}
    </button>
  );
}