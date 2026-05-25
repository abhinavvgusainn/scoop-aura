"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/scoops", label: "Scoops", icon: "🍨" },
  { href: "/how-it-works", label: "How It Works", icon: "✨" },
  { href: "/reviews", label: "Reviews", icon: "💕" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(2);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ─── TOP NAVBAR — desktop & tablet (md+) ─── */}
      <nav
        className={`
          hidden md:flex
          fixed top-0 left-0 right-0 z-50
          items-center justify-between
          px-[5%] h-[68px]
          transition-all duration-300
          ${
            scrolled
              ? "bg-[rgba(255,249,240,0.88)] shadow-[0_4px_32px_rgba(200,178,232,0.18)]"
              : "bg-[rgba(255,249,240,0.75)]"
          }
          backdrop-blur-xl
          border-b border-[rgba(200,178,232,0.25)]
        `}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-playfair text-[1.5rem] font-black tracking-[-0.5px]"
          style={{
            background: "linear-gradient(135deg, #FF8FAB, #C8B2E8, #B8D8F8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <span className="italic">Scoop</span> Aura ✨
        </Link>

        {/* Nav Links */}
        <ul className="flex items-center gap-10 lg:gap-14 list-none">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    relative text-[0.88rem] font-semibold tracking-[0.3px]
                    transition-colors duration-200 group
                    ${active ? "text-[#FF8FAB]" : "text-[#7A5C8A] hover:text-[#FF8FAB]"}
                  `}
                >
                  {label}
                  {/* underline indicator */}
                  <span
                    className={`
                      absolute -bottom-1 left-0 h-[2px] rounded-full
                      bg-gradient-to-r from-[#FF8FAB] to-[#C8B2E8]
                      transition-all duration-300
                      ${active ? "w-full" : "w-0 group-hover:w-full"}
                    `}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button
            aria-label="Cart"
            className="relative p-2 text-[1.25rem] bg-transparent border-none cursor-pointer transition-transform duration-200 hover:scale-110"
          >
            🛍️
            {cartCount > 0 && (
              <span
                className="absolute top-0 right-0 w-[16px] h-[16px] rounded-full text-white text-[0.58rem] font-bold flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #FF8FAB, #C8B2E8)",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* CTA */}
          <button
            className="
              rounded-full px-5 py-[9px] text-[0.85rem] font-bold text-white
              border-none cursor-pointer font-quicksand
              transition-all duration-200
              hover:-translate-y-[1px]
              active:scale-95
            "
            style={{
              background: "linear-gradient(135deg, #FF8FAB, #C8B2E8)",
              boxShadow: "0 4px 20px rgba(255,143,171,0.35)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 24px rgba(255,143,171,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 4px 20px rgba(255,143,171,0.35)";
            }}
          >
            Shop Now ✦
          </button>
        </div>
      </nav>

      {/* ─── BOTTOM FLOATING NAV — mobile only (< md) ─── */}
      <div
        className="
          md:hidden
          fixed bottom-4 left-1/2 z-50
          -translate-x-1/2
          flex items-center
          rounded-[28px] px-2 py-2
          gap-1
          animate-slideUp
        "
        style={{
          background: "rgba(255,249,240,0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "0 8px 40px rgba(200,178,232,0.35), 0 0 0 1px rgba(200,178,232,0.25)",
          minWidth: "min(calc(100vw - 32px), 360px)",
        }}
      >
        {NAV_LINKS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                relative flex flex-col items-center justify-center
                flex-1 rounded-[20px] py-2 px-1
                transition-all duration-300 ease-out
                ${active ? "scale-105" : "hover:scale-105"}
              `}
              style={
                active
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(255,143,171,0.18), rgba(200,178,232,0.18))",
                    }
                  : {}
              }
            >
              {/* Active pill glow */}
              {active && (
                <span
                  className="absolute inset-0 rounded-[20px] opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,143,171,0.12), rgba(200,178,232,0.12))",
                    border: "1px solid rgba(255,143,171,0.25)",
                  }}
                />
              )}

              {/* Icon */}
              <span
                className={`
                  relative text-[1.35rem] leading-none
                  transition-all duration-300
                  ${active ? "scale-110" : "scale-100 opacity-70"}
                `}
              >
                {icon}
              </span>

              {/* Label */}
              <span
                className={`
                  relative text-[0.6rem] font-bold mt-[3px] tracking-[0.2px]
                  transition-all duration-300
                  ${active ? "text-[#FF8FAB]" : "text-[#A887B8]"}
                `}
              >
                {label}
              </span>

              {/* Active dot */}
              {active && (
                <span
                  className="absolute bottom-[6px] w-[4px] h-[4px] rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #FF8FAB, #C8B2E8)",
                  }}
                />
              )}
            </Link>
          );
        })}

        {/* Cart icon in bottom nav */}
        <button
          aria-label="Cart"
          className="
            relative flex flex-col items-center justify-center
            flex-1 rounded-[20px] py-2 px-1
            bg-transparent border-none cursor-pointer
            transition-all duration-300 hover:scale-105
          "
        >
          <span className="text-[1.35rem] leading-none opacity-70">🛍️</span>
          <span className="text-[0.6rem] font-bold mt-[3px] text-[#A887B8] tracking-[0.2px]">
            Cart
          </span>
          {cartCount > 0 && (
            <span
              className="absolute top-1 right-[10%] w-[15px] h-[15px] rounded-full text-white text-[0.55rem] font-bold flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #FF8FAB, #C8B2E8)",
              }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Spacer so content is not hidden behind top nav on md+ */}
      <div className="hidden md:block h-[68px]" aria-hidden="true" />

      {/* Spacer so content is not hidden behind bottom nav on mobile */}
      <div className="md:hidden h-0" aria-hidden="true" />
    </>
  );
}
