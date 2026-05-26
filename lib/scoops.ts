// lib/scoops.ts
// Single source of truth for scoop data.

export type Scoop = {
  id: string;           // slug used in URL: "pearl" | "crystal" | "diamond"
  emoji: string;
  tier: string;
  name: string;
  tagline: string;
  price: number;        // in paise for Razorpay (multiply by 100)
  displayPrice: string; // e.g. "₹499"
  originalPrice: string;
  save: string;
  itemCount: string;    // e.g. "6–8 items"
  perks: string[];
  categories: { label: string; emoji: string }[];
  accentColor: string;
  glowColor: string;
  ctaGradient: string;
  borderGradient: string;
  badge?: string;
  isDiamond?: boolean;
  deliveryDays: string;
  deliveryCharge: number; // INR
  taxRate: number;        // fraction e.g. 0.18
  whatToExpect: string[];
  faqs: { q: string; a: string }[];
};

export const SCOOPS: Scoop[] = [
  {
    id: "pearl",
    emoji: "🌸",
    tier: "Pearl Scoop",
    name: "The Pearl",
    tagline: "Your first step into the world of mystery.",
    price: 499,
    displayPrice: "₹499",
    originalPrice: "₹799",
    save: "Save 38%",
    itemCount: "6–8 items",
    perks: [
      "6–8 curated surprise items",
      "Exclusive freebies included",
      "Aesthetic gift wrap",
      "Handwritten note",
    ],
    categories: [
      { label: "Beauty",      emoji: "💄" },
      { label: "Accessories", emoji: "🎀" },
      { label: "Goodies",     emoji: "🌸" },
    ],
    accentColor: "#FF8FAB",
    glowColor: "rgba(255,143,171,0.25)",
    ctaGradient: "linear-gradient(135deg, #FF8FAB, #FFCBA4)",
    borderGradient: "linear-gradient(135deg, #FFB6C1, #FFCBA4)",
    deliveryDays: "5–7 business days",
    deliveryCharge: 0,
    taxRate: 0.18,
    whatToExpect: [
      "1 full-size beauty or skincare item",
      "1–2 cute accessories (clips, bands, rings)",
      "1 stationery or lifestyle goodie",
      "Exclusive freebie surprise",
      "Aesthetic tissue wrap + handwritten note",
    ],
    faqs: [
      { q: "Can I request no earrings?", a: "Yes! Add it in your preferences and we'll make sure to skip them." },
      { q: "Is the packaging discreet?", a: "We ship in a plain outer box. The inner packaging is beautifully aesthetic." },
      { q: "Can I gift this?", a: "Absolutely — just mention it in preferences and we'll add a gift message." },
    ],
  },
  {
    id: "crystal",
    emoji: "💜",
    tier: "Crystal Scoop",
    name: "The Crystal",
    tagline: "More magic, more surprises, more you.",
    price: 899,
    displayPrice: "₹899",
    originalPrice: "₹1,499",
    save: "Save 40%",
    itemCount: "12–14 items",
    perks: [
      "12–14 curated surprise items",
      "Extra freebies + stickers",
      "Premium gift box",
      "Custom ribbon packaging",
    ],
    categories: [
      { label: "Skincare",    emoji: "🧴" },
      { label: "Jewellery",   emoji: "💎" },
      { label: "Accessories", emoji: "🎀" },
      { label: "More ✨",     emoji: "✨" },
    ],
    accentColor: "#A07BC0",
    glowColor: "rgba(200,178,232,0.3)",
    ctaGradient: "linear-gradient(135deg, #C8B2E8, #B8D8F8)",
    borderGradient: "linear-gradient(135deg, #C8B2E8, #B8D8F8)",
    badge: "Most Popular",
    deliveryDays: "5–7 business days",
    deliveryCharge: 0,
    taxRate: 0.18,
    whatToExpect: [
      "2–3 full-size beauty or skincare items",
      "2 jewellery or accessory pieces",
      "1 aesthetic home or desk item",
      "1–2 stationery goodies",
      "Multiple exclusive freebies",
      "Premium ribbon gift box",
    ],
    faqs: [
      { q: "What if I'm allergic to certain ingredients?", a: "Mention your allergies in preferences — we'll exclude those product types." },
      { q: "Is Crystal better than Pearl?", a: "Crystal is bigger — more items, premium packaging, and extra surprises!" },
      { q: "Do you restock?", a: "Scoops are curated monthly. Stock is limited — order early!" },
    ],
  },
  {
    id: "diamond",
    emoji: "💎",
    tier: "Diamond Scoop",
    name: "The Diamond",
    tagline: "The ultimate luxury mystery experience.",
    price: 1499,
    displayPrice: "₹1,499",
    originalPrice: "₹2,499",
    save: "Save 40%",
    itemCount: "15+ items",
    perks: [
      "15+ premium surprise items",
      "Exclusive luxury freebies",
      "Velvet gift box",
      "Personalised letter + charms",
    ],
    categories: [
      { label: "Luxury",    emoji: "💎" },
      { label: "Exclusive", emoji: "✨" },
      { label: "Rare",      emoji: "🌟" },
      { label: "Premium",   emoji: "👑" },
    ],
    accentColor: "#9B59B6",
    glowColor: "rgba(212,186,255,0.35)",
    ctaGradient: "linear-gradient(135deg, #D4BAFF, #FF8FAB, #B8D8F8)",
    borderGradient: "linear-gradient(135deg, #D4BAFF, #FF8FAB, #B8D8F8)",
    badge: "Premium ✦",
    isDiamond: true,
    deliveryDays: "4–6 business days",
    deliveryCharge: 0,
    taxRate: 0.18,
    whatToExpect: [
      "3+ full-size premium beauty items",
      "2 jewellery or accessories pieces",
      "1 luxury skincare or perfume item",
      "Exclusive limited-edition freebies",
      "Personalised charm bracelet",
      "Handwritten letter from our curation team",
      "Velvet-lined gift box with satin ribbon",
    ],
    faqs: [
      { q: "Are Diamond items genuinely luxury?", a: "Yes — we include products from premium D2C brands, not drugstore picks." },
      { q: "Can I get this as a birthday gift?", a: "It's the perfect gift. Add a note in preferences and we'll make it extra special." },
      { q: "Is there a subscription option?", a: "Monthly subscriptions are coming soon! Join our waitlist via Instagram." },
    ],
  },
];

/** Look up a scoop by its slug — returns undefined if not found */
export function getScoopById(id: string): Scoop | undefined {
  return SCOOPS.find((s) => s.id === id);
}