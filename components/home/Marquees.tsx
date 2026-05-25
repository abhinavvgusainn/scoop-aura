"use client";

const marqueeItems = [
  "✨ Free Shipping Over ₹499",
  "🎀 Curated for Girlies",
  "💝 Packed with Love",
  "🌸 Personalized Scoops",
  "⭐ 12k+ Happy Customers",
  "🔐 Secure Checkout",
  "💄 Aesthetic Goodies",
  "🧴 Self-Care Essentials",
];

const trustItems = [
  {
    icon: "🚚",
    text: "Free Shipping over ₹499",
  },
  {
    icon: "💝",
    text: "Handpicked with Love",
  },
  {
    icon: "🔐",
    text: "Secure Payments",
  },
  {
    icon: "🎀",
    text: "Aesthetic Packaging",
  },
  {
    icon: "⭐",
    text: "4.9/5 Rating",
  },
];

export default function Marquees() {
  return (
    <section className="relative z-10 w-full overflow-hidden">

      {/* ========================= */}
      {/* MARQUEE */}
      {/* ========================= */}

      <div className="relative w-full overflow-hidden py-4 md:py-5">

        {/* glow bg */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/40 via-purple-100/30 to-blue-100/40 backdrop-blur-sm" />

        {/* fade left */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 md:w-20 bg-gradient-to-r from-[#FFF9F0] to-transparent" />

        {/* fade right */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 md:w-20 bg-gradient-to-l from-[#FFF9F0] to-transparent" />

        {/* marquee wrapper */}
        <div className="flex overflow-hidden">

          {/* animated row */}
          <div
            className="
              flex min-w-max shrink-0
              animate-marquee
              items-center
              gap-3 md:gap-5
              pr-3 md:pr-5
            "
          >
            {[...marqueeItems, ...marqueeItems].map(
              (item, index) => (
                <div
                  key={index}
                  className="
                    flex shrink-0 items-center gap-2
                    rounded-full
                    border border-white/60
                    bg-white/70
                    backdrop-blur-xl

                    px-4 py-2.5
                    md:px-5 md:py-3

                    shadow-[0_8px_30px_rgba(200,178,232,0.12)]

                    transition-all duration-300
                    hover:-translate-y-1
                  "
                >
                  <span
                    className="
                      whitespace-nowrap
                      text-[0.72rem]
                      md:text-[0.78rem]
                      font-semibold
                      tracking-[0.2px]
                      text-[#7A5C8A]
                    "
                  >
                    {item}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* TRUST PILLS */}
      {/* ========================= */}

      <div className="mx-auto mt-5 flex w-full max-w-[1200px] flex-wrap items-center justify-center gap-2 px-4 md:gap-3">

        {trustItems.map((item, index) => (
          <div
            key={index}
            className="
              flex items-center gap-2

              rounded-full
              border border-white/60
              bg-white/65
              backdrop-blur-xl

              px-3 py-2.5
              md:px-4

              shadow-[0_8px_24px_rgba(200,178,232,0.12)]

              transition-all duration-300
              hover:-translate-y-1
            "
          >
            <span className="text-[0.95rem]">
              {item.icon}
            </span>

            <span
              className="
                whitespace-nowrap
                text-[0.72rem]
                md:text-[0.78rem]
                font-semibold
                text-[#7A5C8A]
              "
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}