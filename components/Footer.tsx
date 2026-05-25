import Link from "next/link";

const footerLinks = {
  Scoops: [
    "Pearl Scoop",
    "Crystal Scoop",
    "Diamond Scoop",
    "Gift a Scoop",
  ],

  Help: [
    "FAQ",
    "Shipping Policy",
    "Returns",
    "Contact Us",
  ],

  Legal: [
    "Terms & Conditions",
    "Privacy Policy",
    "Refund Policy",
    "About Us",
  ],
};

const socials = [
  {
    icon: "📸",
    label: "Instagram",
  },
  {
    icon: "🎵",
    label: "TikTok",
  },
  {
    icon: "📌",
    label: "Pinterest",
  },
  {
    icon: "▶️",
    label: "YouTube",
  },
];

export default function Footer() {
  return (
    <footer
      className="
        relative z-10
        mt-24
        overflow-hidden
        border-t border-white/30
        bg-gradient-to-br
        from-[#FFF9F0]/90
        via-[#FDF4FF]/90
        to-[#EEF6FF]/90
        backdrop-blur-2xl
      "
    >
      {/* glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-40
        "
      >
        <div
          className="
            absolute
            left-[-120px]
            top-[-120px]
            h-[260px]
            w-[260px]
            rounded-full
            bg-pink-200/40
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-120px]
            right-[-120px]
            h-[260px]
            w-[260px]
            rounded-full
            bg-purple-200/40
            blur-3xl
          "
        />
      </div>

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1300px]
          px-6
          pb-10
          pt-16
          md:px-10
          lg:px-16
        "
      >

        {/* TOP GRID */}
        <div
          className="
            grid
            gap-14
            border-b border-white/30
            pb-14

            sm:grid-cols-2
            lg:grid-cols-[1.4fr_1fr_1fr_1fr]
          "
        >

          {/* BRAND */}
          <div className="max-w-[320px]">

            {/* LOGO */}
            <div
              className="
                font-playfair
                text-[2rem]
                font-black
                tracking-[-1px]
                text-gradient-pink-blue
              "
            >
              <span className="italic">
                Scoop
              </span>
              Aura ✨
            </div>

            <p
              className="
                mt-5
                text-[0.92rem]
                leading-[1.9]
                text-[#8E76A3]
              "
            >
              India&apos;s most aesthetic mystery scoop
              brand — curated with love, packed with
              magic, and designed for girlies who
              adore surprises.
            </p>

            {/* SOCIALS */}
            <div className="mt-7 flex flex-wrap gap-3">

              {socials.map((social) => (
                <button
                  key={social.label}
                  aria-label={social.label}
                  className="
                    flex h-11 w-11 items-center
                    justify-center

                    rounded-2xl

                    border border-white/60
                    bg-white/65
                    backdrop-blur-xl

                    shadow-[0_8px_24px_rgba(200,178,232,0.12)]

                    transition-all duration-300

                    hover:-translate-y-1
                    hover:bg-pink-50
                  "
                >
                  <span className="text-[1rem]">
                    {social.icon}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* LINKS */}
          {Object.entries(footerLinks).map(
            ([title, links]) => (
              <div key={title}>

                <h3
                  className="
                    text-[0.78rem]
                    font-bold
                    uppercase
                    tracking-[1.5px]
                    text-[#7A5C8A]
                  "
                >
                  {title}
                </h3>

                <ul className="mt-5 space-y-4">

                  {links.map((link) => (
                    <li key={link}>

                      <Link
                        href="#"
                        className="
                          text-[0.92rem]
                          font-medium
                          text-[#A887B8]

                          transition-colors duration-200

                          hover:text-[#FF8FAB]
                        "
                      >
                        {link}
                      </Link>

                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* BOTTOM */}
        <div
          className="
            flex flex-col
            items-center
            justify-between
            gap-5

            pt-8

            text-center

            md:flex-row
            md:text-left
          "
        >

          <p
            className="
              text-[0.78rem]
              font-medium
              text-[#A887B8]
            "
          >
            © 2026 ScoopAura. Made with 💕 in India.
          </p>

          <div
            className="
              flex flex-wrap
              items-center
              justify-center
              gap-4

              text-[0.78rem]
              font-medium
              text-[#A887B8]
            "
          >
            <Link
              href="#"
              className="hover:text-[#FF8FAB]"
            >
              Privacy
            </Link>

            <span>•</span>

            <Link
              href="#"
              className="hover:text-[#FF8FAB]"
            >
              Terms
            </Link>

            <span>•</span>

            <Link
              href="#"
              className="hover:text-[#FF8FAB]"
            >
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}