"use client";

import { useEffect, useRef } from "react";

const REVIEWS_CSS = `
  .testi-card-hover {
    transition: transform 0.25s;
  }

  .testi-card-hover:hover {
    transform: translateY(-5px);
  }

  .reveal-testi {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .reveal-testi.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .unbox-cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(255,143,171,0.5) !important;
  }
`;

type ImgStyle = { background: string };

type Review = {
  name: string;
  handle: string;
  avatarBg: string;
  emoji: string;
  stars: string;
  text: string;
  tag: string;
  imgs?: { emoji: string; style: ImgStyle }[];
};

const REVIEWS: Review[] = [
  {
    name: "Priya Sharma",
    handle: "@priyavibes_ · Diamond Scoop",
    avatarBg: "linear-gradient(135deg, #FFB6C1, #FFCBA4)",
    emoji: "👧",
    stars: "★★★★★",
    text: "Literally screamed when I opened it!! The packaging alone was SO aesthetic. Got a lip gloss, two hair clips, a cute bracelet and like 5 more things I didn't expect 😭💕",
    tag: "#MysteryScoop",
    imgs: [
      {
        emoji: "🎁",
        style: {
          background:
            "linear-gradient(135deg, rgba(255,182,193,0.4), rgba(255,203,164,0.4))",
        },
      },
      {
        emoji: "💄",
        style: {
          background:
            "linear-gradient(135deg, rgba(200,178,232,0.4), rgba(184,216,248,0.4))",
        },
      },
      {
        emoji: "🎀",
        style: {
          background:
            "linear-gradient(135deg, rgba(212,186,255,0.4), rgba(255,182,193,0.4))",
        },
      },
    ],
  },
  {
    name: "Ananya Mehra",
    handle: "@ananyaaesthetic · Crystal Scoop",
    avatarBg: "linear-gradient(135deg, #C8B2E8, #B8D8F8)",
    emoji: "🧑",
    stars: "★★★★★",
    text: "Ordered for my birthday and it was honestly better than any gift I got 🥺 The note inside made me cry a little. Will 100% order every month now.",
    tag: "#UnboxingVibes",
  },
  {
    name: "Zara Khan",
    handle: "@zaraglows · Pearl Scoop",
    avatarBg: "linear-gradient(135deg, #D4BAFF, #FFB6C1)",
    emoji: "👩",
    stars: "★★★★★",
    text: "The Pearl Scoop had SO much value for ₹499 omg. Everything was wrapped so prettily. I noted no earrings and they actually listened — love this brand fr 💜",
    tag: "#AestheticBox",
    imgs: [
      {
        emoji: "🌸",
        style: {
          background:
            "linear-gradient(135deg, rgba(200,178,232,0.4), rgba(184,216,248,0.4))",
        },
      },
      {
        emoji: "✨",
        style: {
          background:
            "linear-gradient(135deg, rgba(212,186,255,0.4), rgba(255,182,193,0.4))",
        },
      },
    ],
  },
  {
    name: "Isha Patel",
    handle: "@ishacore · Diamond Scoop",
    avatarBg: "linear-gradient(135deg, #B8D8F8, #FFCBA4)",
    emoji: "👧",
    stars: "★★★★★",
    text: "Made a whole reel of my unboxing and it went viral on Insta 😭✨ The velvet box is STUNNING. My FYP is now full of mystery box videos because of you guys.",
    tag: "#SurpriseBox",
  },
  {
    name: "Meera Nair",
    handle: "@meeravibesonly · Crystal Scoop",
    avatarBg: "linear-gradient(135deg, #FFB6C1, #C8B2E8)",
    emoji: "🧑",
    stars: "★★★★★",
    text: "Gifted this to my bestie for her birthday and she was SHOOK 😭 The packaging is so beautiful she didn't want to open it at first lol 💕",
    tag: "#GiftIdea",
  },
  {
    name: "Rhea Gupta",
    handle: "@rheaaestheticc · Pearl Scoop",
    avatarBg: "linear-gradient(135deg, #FFCBA4, #D4BAFF)",
    emoji: "👩",
    stars: "★★★★★",
    text: "The surprise element is ADDICTIVE. Already on my 3rd order. Every scoop feels different and I always get stuff I genuinely love. Best thing about college life rn ✨",
    tag: "#MysteryAddicted",
  },
];

const UNBOX_CARDS = [
  { emoji: "🎁", label: "Scoop 1" },
  { emoji: "💄", label: "Scoop 2" },
  { emoji: "✨", label: "Scoop 3" },
  { emoji: "🌸", label: "Scoop 4" },
];

export default function Reviews() {
  const injected = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!injected.current) {
      injected.current = true;

      const s = document.createElement("style");
      s.textContent = REVIEWS_CSS;
      document.head.appendChild(s);
    }

    const cards = gridRef.current?.querySelectorAll(".reveal-testi");

    if (!cards) return;

    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        }),
      { threshold: 0.1 }
    );

    cards.forEach((c) => obs.observe(c));

    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="reviews"
      className="relative z-[1] bg-white/25 px-[6%] py-[90px]"
    >
      {/* Header */}
      <div className="mb-14 text-center">
        <div className="mb-3 inline-flex items-center gap-[6px] rounded-full bg-[#FF8FAB]/10 px-[14px] py-[5px] text-[0.75rem] font-bold uppercase tracking-[1.2px] text-[#FF8FAB]">
          ✦ Real Girlies, Real Reactions
        </div>

        <h2 className="mb-3 font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] font-black leading-[1.15] text-[#3D2C47]">
          They&apos;re Obsessed 💕
        </h2>

        <p className="mx-auto max-w-[500px] text-[1rem] font-medium leading-[1.7] text-[#A887B8]">
          Don&apos;t take our word for it — see what our community says.
        </p>
      </div>

      {/* Reviews Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-3"
      >
        {REVIEWS.map((r, i) => (
          <div
            key={r.name}
            className="reveal-testi testi-card-hover rounded-[24px] border border-[rgba(200,178,232,0.2)] bg-white/75 p-7 shadow-[0_8px_32px_rgba(200,178,232,0.12)] backdrop-blur-[16px]"
            style={{
              WebkitBackdropFilter: "blur(16px)",
              transitionDelay: `${(i % 3) * 0.08}s`,
            }}
          >
            {/* Header */}
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full text-[1.5rem]"
                style={{
                  background: r.avatarBg,
                }}
              >
                {r.emoji}
              </div>

              <div>
                <div className="font-['Quicksand'] text-[0.9rem] font-bold text-[#3D2C47]">
                  {r.name}
                </div>

                <div className="font-['Quicksand'] text-[0.74rem] font-medium text-[#A887B8]">
                  {r.handle}
                </div>
              </div>
            </div>

            {/* Stars */}
            <div className="mb-3 text-[0.75rem] tracking-[1px] text-[#FFD166]">
              {r.stars}
            </div>

            {/* Text */}
            <p className="text-[0.85rem] font-medium leading-[1.7] text-[#7A5C8A]">
              {r.text}
            </p>

            {/* Image Row */}
            {r.imgs && (
              <div className="mt-4 flex gap-[6px]">
                {r.imgs.map((img, j) => (
                  <div
                    key={j}
                    className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-[12px] text-[1.8rem]"
                    style={{
                      ...img.style,
                    }}
                  >
                    {img.emoji}
                  </div>
                ))}
              </div>
            )}

            {/* Tag */}
            <span className="mt-3 inline-block rounded-full bg-[#FF8FAB]/10 px-[10px] py-[3px] text-[0.68rem] font-bold text-[#FF8FAB]">
              {r.tag}
            </span>
          </div>
        ))}
      </div>

      {/* Unboxing Banner */}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-8 rounded-[28px] border border-[rgba(200,178,232,0.2)] bg-[linear-gradient(135deg,rgba(255,143,171,0.12),rgba(200,178,232,0.12),rgba(184,216,248,0.12))] p-10">
        {/* Left */}
        <div>
          <h3 className="mb-2 font-['Playfair_Display'] text-[1.5rem] font-black text-[#3D2C47]">
            🎥 Unboxing Moments
          </h3>

          <p className="text-[0.88rem] font-medium text-[#A887B8]">
            Join 12,000+ girlies posting their unboxing reels. Tag us
            @scoopsaura for a feature!
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap gap-3">
          {UNBOX_CARDS.map((card) => (
            <div
              key={card.label}
              className="flex h-[80px] w-[80px] flex-col items-center justify-center rounded-[16px] border border-[rgba(200,178,232,0.2)] bg-white/80 text-[2rem] shadow-[0_4px_16px_rgba(200,178,232,0.18)]"
            >
              {card.emoji}

              <span className="mt-[2px] font-['Quicksand'] text-[0.6rem] font-bold text-[#A887B8]">
                {card.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="unbox-cta-btn whitespace-nowrap rounded-full border-none bg-[linear-gradient(135deg,#FF8FAB,#C8B2E8)] px-8 py-[15px] font-['Quicksand'] text-[0.95rem] font-bold text-white shadow-[0_8px_30px_rgba(255,143,171,0.4)] transition-all duration-200">
          Tag Us on Insta 📸
        </button>
      </div>
    </section>
  );
}