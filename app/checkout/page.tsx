"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getScoopById } from "@/lib/scoops";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  email: string;
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli & Daman & Diu",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const COUNTRIES = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
];

const DIAL_CODES: Record<string, string> = {
  IN: "🇮🇳 +91",
  US: "🇺🇸 +1",
  GB: "🇬🇧 +44",
  CA: "🇨🇦 +1",
  AU: "🇦🇺 +61",
  SG: "🇸🇬 +65",
  AE: "🇦🇪 +971",
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CHECKOUT_CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes blobDrift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(30px, 20px) scale(1.05); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes dialogIn {
    from { opacity: 0; transform: translateY(30px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-6px); }
    40%     { transform: translateX(6px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }

  .co-card {
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    border: 1px solid rgba(200,178,232,0.22);
    box-shadow: 0 8px 32px rgba(200,178,232,0.14);
    animation: scaleIn 0.45s ease both;
    transition: border-color 0.3s;
  }
  .co-card.has-errors {
    border-color: rgba(239,68,68,0.25);
  }

  .co-input {
    width: 100%;
    border-radius: 14px;
    padding: 13px 16px;
    border: 2px solid rgba(200,178,232,0.28);
    background: rgba(255,255,255,0.85);
    font-family: var(--font-quicksand, 'Quicksand', sans-serif);
    font-size: 0.9rem;
    font-weight: 600;
    color: #3D2C47;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .co-input:focus {
    border-color: rgba(255,143,171,0.6);
    box-shadow: 0 0 0 4px rgba(255,143,171,0.08);
  }
  .co-input::placeholder {
    color: #D0B0D8;
    font-weight: 500;
  }
  .co-input.error {
    border-color: rgba(239,68,68,0.5);
    box-shadow: 0 0 0 4px rgba(239,68,68,0.06);
  }
  .co-input.valid {
    border-color: rgba(93,184,122,0.5);
  }

  .co-select {
    width: 100%;
    border-radius: 14px;
    padding: 13px 16px;
    border: 2px solid rgba(200,178,232,0.28);
    background: rgba(255,255,255,0.85);
    font-family: var(--font-quicksand, 'Quicksand', sans-serif);
    font-size: 0.9rem;
    font-weight: 600;
    color: #3D2C47;
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%23A887B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 40px;
    cursor: pointer;
    box-sizing: border-box;
  }
  .co-select:focus {
    border-color: rgba(255,143,171,0.6);
    box-shadow: 0 0 0 4px rgba(255,143,171,0.08);
  }
  .co-select.error {
    border-color: rgba(239,68,68,0.5);
    box-shadow: 0 0 0 4px rgba(239,68,68,0.06);
  }

  .co-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #A887B8;
    margin-bottom: 7px;
    font-family: var(--font-quicksand, 'Quicksand', sans-serif);
  }

  .co-error-msg {
    font-size: 0.72rem;
    font-weight: 600;
    color: #EF4444;
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: var(--font-quicksand, 'Quicksand', sans-serif);
  }

  .co-section-title {
    font-family: var(--font-playfair, 'Playfair Display', serif);
    font-size: 1.2rem;
    font-weight: 900;
    color: #3D2C47;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .co-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, rgba(200,178,232,0.3), transparent);
  }

  .co-step-badge {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF8FAB, #C8B2E8);
    color: white;
    font-size: 0.7rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: var(--font-quicksand, 'Quicksand', sans-serif);
  }

  .pay-btn {
    transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
  }
  .pay-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    filter: brightness(1.06);
  }
  .pay-btn:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
  .pay-btn.shake {
    animation: shake 0.45s ease;
  }

  .phone-prefix {
    display: flex;
    align-items: center;
    gap: 0;
  }
  .phone-country-code {
    border-radius: 14px 0 0 14px;
    padding: 13px 14px;
    border: 2px solid rgba(200,178,232,0.28);
    border-right: none;
    background: rgba(200,178,232,0.08);
    font-family: var(--font-quicksand, 'Quicksand', sans-serif);
    font-size: 0.9rem;
    font-weight: 700;
    color: #7A5C8A;
    white-space: nowrap;
  }
  .phone-input {
    border-radius: 0 14px 14px 0 !important;
  }

  .checkout-steps {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 2rem;
  }
  .step-dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 800;
    flex-shrink: 0;
    transition: all 0.3s;
  }
  .step-dot.done {
    background: linear-gradient(135deg, #FF8FAB, #C8B2E8);
    color: white;
  }
  .step-dot.active {
    background: linear-gradient(135deg, #FF8FAB, #C8B2E8);
    color: white;
    box-shadow: 0 0 0 4px rgba(255,143,171,0.2);
  }
  .step-dot.pending {
    background: rgba(200,178,232,0.2);
    color: #C8B2E8;
    border: 2px solid rgba(200,178,232,0.3);
  }
  .step-line {
    flex: 1;
    height: 2px;
    background: rgba(200,178,232,0.25);
    margin: 0 6px;
    border-radius: 2px;
    min-width: 20px;
  }
  .step-line.done {
    background: linear-gradient(to right, #FF8FAB, #C8B2E8);
  }

  .validation-banner {
    background: rgba(239,68,68,0.07);
    border: 1.5px solid rgba(239,68,68,0.2);
    border-radius: 16px;
    padding: 12px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    animation: fadeUp 0.3s ease both;
    font-family: var(--font-quicksand, 'Quicksand', sans-serif);
  }

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
    width: 100%; max-width: 520px;
    background: rgba(255,249,240,0.97);
    backdrop-filter: blur(24px);
    border-radius: 28px;
    border: 1px solid rgba(200,178,232,0.3);
    box-shadow: 0 24px 80px rgba(200,178,232,0.35);
    overflow: hidden;
    max-height: 90vh;
    overflow-y: auto;
  }

  .textarea-pref {
    width: 100%;
    border-radius: 16px;
    padding: 1rem 1.2rem;
    border: 2px solid rgba(200,178,232,0.3);
    resize: none;
    height: 130px;
    font-family: var(--font-quicksand, 'Quicksand', sans-serif);
    font-size: 0.88rem;
    color: #7A5C8A;
    background: rgba(255,255,255,0.85);
    outline: none;
    transition: border-color 0.2s;
    line-height: 1.6;
    box-sizing: border-box;
  }
  .textarea-pref:focus { border-color: rgba(255,143,171,0.5); }
  .textarea-pref::placeholder { color: #D0B0D8; }

  .order-card-anim { animation: scaleIn 0.5s ease both; }
  .order-btn-main {
    transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
  }
  .order-btn-main:hover:not(:disabled) {
    transform: translateY(-2px);
    filter: brightness(1.06);
  }
  .order-btn-main:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 768px) {
    .checkout-responsive-grid {
      grid-template-columns: 1fr !important;
    }
    .order-summary-sticky {
      position: static !important;
    }
  }
`;

// ─── Field component — defined OUTSIDE CheckoutPage to prevent remount on each render ───
// If defined inside, React sees a new component type every render → unmounts & remounts
// the input → focus is lost after every keystroke.
function Field({
  label,
  field,
  placeholder,
  type = "text",
  form,
  errors,
  touched,
  submitAttempted,
  onChange,
  onBlur,
}: {
  label: string;
  field: keyof FormData;
  placeholder: string;
  type?: string;
  form: FormData;
  errors: FormErrors;
  touched: Partial<Record<keyof FormData, boolean>>;
  submitAttempted: boolean;
  onChange: (field: keyof FormData, value: string) => void;
  onBlur: (field: keyof FormData) => void;
}) {
  const hasError = !!(errors[field] && (touched[field] || submitAttempted));
  const isValid = !!(
    (touched[field] || submitAttempted) &&
    !errors[field] &&
    form[field]
  );

  return (
    <div>
      <label className="co-label" htmlFor={field}>
        {label}
      </label>
      <input
        id={field}
        type={type}
        className={`co-input ${hasError ? "error" : ""} ${isValid ? "valid" : ""}`}
        placeholder={placeholder}
        value={form[field]}
        onChange={(e) => onChange(field, e.target.value)}
        onBlur={() => onBlur(field)}
        autoComplete={
          field === "email" ? "email" : field === "phone" ? "tel" : "on"
        }
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field}-error` : undefined}
      />
      {hasError && (
        <p id={`${field}-error`} className="co-error-msg" role="alert">
          ⚠ {errors[field]}
        </p>
      )}
    </div>
  );
}

// ─── Helper component — also outside to be safe ──────────────────────────────
function PriceRow({
  label,
  value,
  highlight,
  soft,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  soft?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: "0.84rem",
          fontWeight: 600,
          color: soft ? "#C8B2E8" : "#A887B8",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.84rem",
          fontWeight: 700,
          color: highlight ? "#5DB87A" : soft ? "#C8B2E8" : "#3D2C47",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cssRef = useRef(false);
  const formTopRef = useRef<HTMLDivElement>(null);
  const payBtnRef = useRef<HTMLButtonElement>(null);

  const scoopId = searchParams.get("scoop") ?? "";
  const scoop = getScoopById(scoopId);

  const basePrice = scoop?.price ?? 0;
  const deliveryCharge = scoop?.deliveryCharge ?? 0;
  const subtotal = basePrice + deliveryCharge;
  const tax = Math.round(subtotal * (scoop?.taxRate ?? 0) * 100) / 100;
  const total = subtotal + tax;

  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState<FormData>({
    email: "",
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Preference dialog state ─────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prefText, setPrefText] = useState("");
  const [savedPrefs, setSavedPrefs] = useState<{
    chips: string[];
    text: string;
  } | null>(null);

  // ── Inject CSS once ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (cssRef.current) return;
    cssRef.current = true;
    const s = document.createElement("style");
    s.textContent = CHECKOUT_CSS;
    document.head.appendChild(s);
  }, []);

  // ── Load saved preferences from sessionStorage on mount ─────────────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("scoopPrefs");
      if (raw) {
        const parsed = JSON.parse(raw);
        setSavedPrefs(parsed);
        setPrefText(parsed.text ?? "");
      }
    } catch {
      /* ignore */
    }
  }, []);

  // ── Lock body scroll when dialog open ──────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = dialogOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [dialogOpen]);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = useCallback((data: FormData): FormErrors => {
    const e: FormErrors = {};
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Please enter a valid email address";
    if (data.fullName.trim().length < 2) e.fullName = "Full name is required";
    if (data.addressLine1.trim().length < 5)
      e.addressLine1 = "Please enter your street address";
    if (data.city.trim().length < 2) e.city = "City is required";
    if (data.country === "IN" && !data.state)
      e.state = "Please select your state";
    if (!data.postalCode.match(/^\d{4,10}$/))
      e.postalCode = "Enter a valid postal code";
    if (!data.phone.match(/^\d{7,15}$/)) e.phone = "Enter a valid phone number";
    return e;
  }, []);

  const handleChange = (field: keyof FormData, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field] || submitAttempted) {
      const e = validate(updated);
      setErrors((prev) => ({ ...prev, [field]: e[field] }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const e = validate(form);
    setErrors((prev) => ({ ...prev, [field]: e[field] }));
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const isValid = (field: keyof FormData) =>
    (touched[field] || submitAttempted) && !errors[field] && form[field];

  const hasError = (field: keyof FormData) =>
    !!(errors[field] && (touched[field] || submitAttempted));

  const scrollToFirstError = (errs: FormErrors) => {
    const FIELD_ORDER: (keyof FormData)[] = [
      "email",
      "fullName",
      "addressLine1",
      "city",
      "postalCode",
      "state",
      "phone",
    ];
    for (const field of FIELD_ORDER) {
      if (errs[field]) {
        const el = document.getElementById(field);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
          return;
        }
      }
    }
  };

  const shakePayBtn = () => {
    const btn = payBtnRef.current;
    if (!btn) return;
    btn.classList.remove("shake");
    void btn.offsetWidth;
    btn.classList.add("shake");
    btn.addEventListener("animationend", () => btn.classList.remove("shake"), {
      once: true,
    });
  };

  // ── Preference handlers ─────────────────────────────────────────────────────
  const savePrefs = () => {
    const prefs = { chips: [] as string[], text: prefText.trim() };
    setSavedPrefs(prefs);
    try {
      sessionStorage.setItem("scoopPrefs", JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
    setDialogOpen(false);
  };

  // ── Load Razorpay script ────────────────────────────────────────────────────
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handlePayNow = async () => {
    const allTouched: Partial<Record<keyof FormData, boolean>> = {};
    (Object.keys(form) as (keyof FormData)[]).forEach((k) => {
      allTouched[k] = true;
    });
    setTouched(allTouched);
    setSubmitAttempted(true);

    const errs = validate(form);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      shakePayBtn();
      scrollToFirstError(errs);
      return;
    }

    try {
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load payment gateway. Please refresh and try again.");
        return;
      }

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      if (!response.ok) {
        throw new Error(`Order creation failed: ${response.status}`);
      }

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Your Store Name",
        description: `${scoop?.name ?? "Mystery"} Scoop`,
        order_id: order.id,
        handler: async (razorpayResponse: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                // order details
                scoop: scoop?.id || "",
                email: form.email,
                fullName: form.fullName,
                addressLine1: form.addressLine1,
                addressLine2: form.addressLine2,
                city: form.city,
                state: form.state,
                postalCode: form.postalCode,
                country: form.country,
                phone: form.phone,
                preferences: savedPrefs?.text || "",
                amount: total,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              alert(
                "Payment verification failed. Please contact support with your payment ID: " +
                  razorpayResponse.razorpay_payment_id,
              );
              setLoading(false);
              return;
            }

            // ── Verification passed → store for success page ──────────────────
            try {
              sessionStorage.setItem(
                "lastOrder",
                JSON.stringify({
                  paymentId: razorpayResponse.razorpay_payment_id,
                  orderId: order.id,
                  scoopName: scoop?.name,
                  scoopEmoji: scoop?.emoji,
                  total,
                  fullName: form.fullName,
                  email: form.email,
                  deliveryDays: scoop?.deliveryDays,
                }),
              );
            } catch {
              /* ignore */
            }

            router.push("/order-success");
          } catch (error) {
            console.error("Verification error:", error);
            alert(
              "Something went wrong during verification. Please contact support with your payment ID: " +
                razorpayResponse.razorpay_payment_id,
            );
            setLoading(false);
          }
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#FF8FAB" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const razorpay = new (
        window as unknown as {
          Razorpay: new (o: typeof options) => {
            open: () => void;
            on: (e: string, cb: (r: unknown) => void) => void;
          };
        }
      ).Razorpay(options);
      razorpay.open();
      razorpay.on("payment.failed", (response: unknown) => {
        console.error("Payment failed:", response);
        setLoading(false);
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // ── Error count for banner ───────────────────────────────────────────────────
  const errorCount = submitAttempted ? Object.keys(errors).length : 0;

  // ── No scoop selected ───────────────────────────────────────────────────────
  if (!scoop) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
        <h1
          style={{
            fontFamily: "var(--font-playfair,'Playfair Display',serif)",
            fontSize: "1.8rem",
            color: "#3D2C47",
            marginBottom: "0.5rem",
          }}
        >
          No scoop selected
        </h1>
        <p style={{ color: "#A887B8", marginBottom: "1.5rem" }}>
          Please go back and select a scoop first.
        </p>
        <button
          type="button"
          onClick={() => router.push("/#scoops")}
          style={{
            background: "linear-gradient(135deg,#FF8FAB,#C8B2E8)",
            color: "white",
            border: "none",
            borderRadius: "50px",
            padding: "12px 28px",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)",
          }}
        >
          ← Browse Scoops
        </button>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Background blobs */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {[
          {
            w: 480,
            bg: "radial-gradient(circle,#FFB6C1,#E8DCFF)",
            top: "-80px",
            left: "-60px",
            delay: "0s",
          },
          {
            w: 340,
            bg: "radial-gradient(circle,#B8D8F8,#C8B2E8)",
            top: "40%",
            right: "-60px",
            delay: "4s",
          },
          {
            w: 280,
            bg: "radial-gradient(circle,#FFCBA4,#FFB6C1)",
            bottom: "8%",
            left: "20%",
            delay: "8s",
          },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: b.w,
              height: b.w,
              borderRadius: "50%",
              background: b.bg,
              filter: "blur(80px)",
              opacity: 0.28,
              top: (b as { top?: string }).top,
              left: (b as { left?: string }).left,
              right: (b as { right?: string }).right,
              bottom: (b as { bottom?: string }).bottom,
              animation: "blobDrift 14s ease-in-out infinite alternate",
              animationDelay: b.delay,
            }}
          />
        ))}
      </div>

      <div
        ref={formTopRef}
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1060px",
          margin: "0 auto",
          padding: "40px 5% 100px",
        }}
      >
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.push("/#scoops")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#A887B8",
            fontWeight: 700,
            fontSize: "0.85rem",
            marginBottom: "1.6rem",
            padding: 0,
            fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)",
          }}
        >
          ← Back to Scoops
        </button>

        {/* Progress steps */}
        <div className="checkout-steps" style={{ marginBottom: "2rem" }}>
          {[
            { label: "Scoop", n: "1" },
            { label: "Checkout", n: "2" },
            { label: "Payment", n: "3" },
            { label: "Done ✓", n: "4" },
          ].map((s, i, arr) => (
            <span
              key={s.n}
              style={{
                display: "flex",
                alignItems: "center",
                flex: i < arr.length - 1 ? "1" : "none",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "7px" }}
              >
                <span
                  className={`step-dot ${i === 0 ? "done" : i === 1 ? "active" : "pending"}`}
                >
                  {i === 0 ? "✓" : s.n}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color:
                      i === 1 ? "#3D2C47" : i === 0 ? "#A887B8" : "#C8B2E8",
                    fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.label}
                </span>
              </span>
              {i < arr.length - 1 && (
                <span className={`step-line ${i === 0 ? "done" : ""}`} />
              )}
            </span>
          ))}
        </div>

        {/* Page heading */}
        <div
          style={{ marginBottom: "2rem", animation: "fadeUp 0.5s ease both" }}
        >
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#FF8FAB",
              marginBottom: "6px",
            }}
          >
            ✦ Almost there
          </div>
          <h1
            style={{
              fontFamily: "var(--font-playfair,'Playfair Display',serif)",
              fontSize: "clamp(1.8rem,4vw,2.6rem)",
              fontWeight: 900,
              color: "#3D2C47",
              lineHeight: 1.1,
            }}
          >
            Checkout
          </h1>
          <p
            style={{
              color: "#A887B8",
              fontSize: "0.9rem",
              fontWeight: 500,
              marginTop: "6px",
            }}
          >
            Fill in your details below — we&apos;ll deliver the magic to your
            door. 🌸
          </p>
        </div>

        {/* Validation error banner */}
        {errorCount > 0 && (
          <div
            className="validation-banner"
            role="alert"
            aria-live="polite"
            style={{ marginBottom: "1.5rem" }}
          >
            <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>⚠️</span>
            <div>
              <p
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  color: "#EF4444",
                  margin: 0,
                }}
              >
                Please fix {errorCount} {errorCount === 1 ? "field" : "fields"}{" "}
                before continuing
              </p>
              <p
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  color: "#A88",
                  margin: "2px 0 0",
                }}
              >
                Highlighted fields above need your attention.
              </p>
            </div>
          </div>
        )}

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr min(380px,100%)",
            gap: "2rem",
            alignItems: "start",
          }}
          className="checkout-responsive-grid"
        >
          {/* ════ LEFT — Form ════════════════════════════════════════════════ */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}
          >
            {/* Section 1: Contact */}
            <div
              className={`co-card ${hasError("email") ? "has-errors" : ""}`}
              style={{ padding: "1.8rem 2rem", animationDelay: "0.1s" }}
            >
              <h2 className="co-section-title">
                <span className="co-step-badge">1</span>
                Contact
              </h2>
              <Field
                label="Email address"
                field="email"
                placeholder="you@example.com"
                type="email"
                form={form}
                errors={errors}
                touched={touched}
                submitAttempted={submitAttempted}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {/* Section 2: Shipping Address */}
            <div
              className={`co-card ${
                [
                  "fullName",
                  "addressLine1",
                  "city",
                  "postalCode",
                  "state",
                ].some((f) => hasError(f as keyof FormData))
                  ? "has-errors"
                  : ""
              }`}
              style={{ padding: "1.8rem 2rem", animationDelay: "0.18s" }}
            >
              <h2 className="co-section-title">
                <span className="co-step-badge">2</span>
                Shipping Address
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <Field
                  label="Full name"
                  field="fullName"
                  placeholder="Riya Sharma"
                  form={form}
                  errors={errors}
                  touched={touched}
                  submitAttempted={submitAttempted}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {/* Country */}
                <div>
                  <label className="co-label" htmlFor="country">
                    Country / Region
                  </label>
                  <select
                    id="country"
                    className="co-select"
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Field
                  label="Address line 1"
                  field="addressLine1"
                  placeholder="House / Flat no., Street name"
                  form={form}
                  errors={errors}
                  touched={touched}
                  submitAttempted={submitAttempted}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Field
                  label="Address line 2 (optional)"
                  field="addressLine2"
                  placeholder="Landmark, Colony, Area"
                  form={form}
                  errors={errors}
                  touched={touched}
                  submitAttempted={submitAttempted}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <Field
                    label="City / Town"
                    field="city"
                    placeholder="Mumbai"
                    form={form}
                    errors={errors}
                    touched={touched}
                    submitAttempted={submitAttempted}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div>
                    <label className="co-label" htmlFor="postalCode">
                      Postal / PIN Code
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      inputMode="numeric"
                      className={`co-input ${hasError("postalCode") ? "error" : ""} ${
                        isValid("postalCode") ? "valid" : ""
                      }`}
                      placeholder={form.country === "IN" ? "400001" : "00000"}
                      value={form.postalCode}
                      onChange={(e) =>
                        handleChange(
                          "postalCode",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      onBlur={() => handleBlur("postalCode")}
                      maxLength={10}
                      aria-invalid={hasError("postalCode")}
                    />
                    {hasError("postalCode") && (
                      <p className="co-error-msg" role="alert">
                        ⚠ {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* State — India only */}
                {form.country === "IN" && (
                  <div>
                    <label className="co-label" htmlFor="state">
                      State
                    </label>
                    <select
                      id="state"
                      className={`co-select ${hasError("state") ? "error" : ""}`}
                      value={form.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      onBlur={() => handleBlur("state")}
                      aria-invalid={hasError("state")}
                    >
                      <option value="">Select state…</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {hasError("state") && (
                      <p className="co-error-msg" role="alert">
                        ⚠ {errors.state}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Phone */}
            <div
              className={`co-card ${hasError("phone") ? "has-errors" : ""}`}
              style={{ padding: "1.8rem 2rem", animationDelay: "0.26s" }}
            >
              <h2 className="co-section-title">
                <span className="co-step-badge">3</span>
                Phone Number
              </h2>
              <div>
                <label className="co-label" htmlFor="phone">
                  Mobile number
                </label>
                <div className="phone-prefix">
                  <span className="phone-country-code">
                    {DIAL_CODES[form.country] ?? "+"}
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    className={`co-input phone-input ${hasError("phone") ? "error" : ""} ${
                      isValid("phone") ? "valid" : ""
                    }`}
                    placeholder={
                      form.country === "IN" ? "92868 44493" : "000 000 0000"
                    }
                    value={form.phone}
                    onChange={(e) =>
                      handleChange("phone", e.target.value.replace(/\D/g, ""))
                    }
                    onBlur={() => handleBlur("phone")}
                    maxLength={15}
                    style={{ flex: 1 }}
                    aria-invalid={hasError("phone")}
                  />
                </div>
                {hasError("phone") && (
                  <p className="co-error-msg" role="alert">
                    ⚠ {errors.phone}
                  </p>
                )}
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#C8B2E8",
                    fontWeight: 500,
                    marginTop: "8px",
                    fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)",
                  }}
                >
                  For delivery updates and order confirmation only. We
                  don&apos;t spam. 🌸
                </p>
              </div>
            </div>
          </div>

          {/* ════ RIGHT — Order Summary ══════════════════════════════════════ */}
          <div
            className="order-summary-sticky"
            style={{ position: "sticky", top: "88px" }}
          >
            <div
              className="order-card-anim"
              style={{
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: "28px",
                border: "1px solid rgba(200,178,232,0.25)",
                boxShadow: "0 16px 56px rgba(200,178,232,0.2)",
                overflow: "hidden",
              }}
            >
              {/* Gradient header strip */}
              <div
                style={{
                  padding: "1.4rem 1.8rem",
                  background: scoop.ctaGradient,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg,rgba(255,255,255,0.12),transparent)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.8)",
                    marginBottom: "4px",
                  }}
                >
                  Order Summary
                </div>
                <div
                  style={{
                    position: "relative",
                    fontFamily: "var(--font-playfair,'Playfair Display',serif)",
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "white",
                  }}
                >
                  {scoop.name} {scoop.emoji}
                </div>
              </div>

              <div style={{ padding: "1.6rem 1.8rem" }}>
                {/* Price breakdown */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "1.2rem",
                  }}
                >
                  <PriceRow
                    label={`${scoop.tier} (${scoop.itemCount})`}
                    value={`₹${basePrice.toLocaleString("en-IN")}`}
                  />
                  <PriceRow
                    label="Delivery"
                    value={
                      deliveryCharge === 0 ? "FREE 🎉" : `₹${deliveryCharge}`
                    }
                    highlight={deliveryCharge === 0}
                  />
                  <PriceRow
                    label={`GST (${scoop.taxRate * 100}%)`}
                    value={`₹${tax}`}
                    soft
                  />
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(200,178,232,0.25)",
                      margin: "4px 0",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: "#3D2C47",
                      }}
                    >
                      Total
                    </span>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontFamily:
                            "var(--font-playfair,'Playfair Display',serif)",
                          fontSize: "1.6rem",
                          fontWeight: 900,
                          color: "#3D2C47",
                        }}
                      >
                        ₹{total.toLocaleString("en-IN")}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#A887B8",
                          fontWeight: 600,
                          textDecoration: "line-through",
                        }}
                      >
                        {scoop.originalPrice}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery info */}
                <div
                  style={{
                    background: "rgba(200,178,232,0.1)",
                    borderRadius: "14px",
                    padding: "10px 14px",
                    marginBottom: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "#7A5C8A",
                  }}
                >
                  <span>🚚</span>
                  <span>
                    Estimated delivery:{" "}
                    <strong style={{ color: "#3D2C47" }}>
                      {scoop.deliveryDays}
                    </strong>
                  </span>
                </div>

                {/* Saved preferences preview */}
                {savedPrefs?.text && (
                  <div
                    style={{
                      background: "rgba(255,143,171,0.06)",
                      border: "1px solid rgba(255,143,171,0.18)",
                      borderRadius: "14px",
                      padding: "10px 14px",
                      marginBottom: "12px",
                      fontSize: "0.78rem",
                      color: "#7A5C8A",
                      fontWeight: 500,
                      lineHeight: 1.55,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        color: "#FF8FAB",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      ✦ Your Note
                    </span>
                    &ldquo;{savedPrefs.text}&rdquo;
                  </div>
                )}

                {/* Preferences button */}
                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  style={{
                    width: "100%",
                    border: "2px solid rgba(200,178,232,0.4)",
                    borderRadius: "16px",
                    padding: "12px",
                    marginBottom: "12px",
                    background: savedPrefs?.text
                      ? "rgba(255,143,171,0.06)"
                      : "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: "#7A5C8A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#FF8FAB";
                    e.currentTarget.style.color = "#FF8FAB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(200,178,232,0.4)";
                    e.currentTarget.style.color = "#7A5C8A";
                  }}
                >
                  {savedPrefs?.text
                    ? "✓ Note Saved — Edit"
                    : "📝 Add My Preferences"}
                </button>

                {/* Pay button */}
                <button
                  ref={payBtnRef}
                  type="button"
                  className="order-btn-main"
                  onClick={handlePayNow}
                  disabled={loading}
                  aria-disabled={loading}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: "50px",
                    padding: "16px",
                    background: scoop.ctaGradient,
                    color: "white",
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)",
                    boxShadow: `0 8px 28px ${scoop.glowColor}`,
                    opacity: loading ? 0.75 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          border: "2px solid rgba(255,255,255,0.4)",
                          borderTopColor: "white",
                          display: "inline-block",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                      Opening Checkout...
                    </>
                  ) : (
                    <>Pay ₹{total.toLocaleString("en-IN")} Securely ✦</>
                  )}
                </button>

                {/* Trust micro-badges */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1.2rem",
                    marginTop: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  {["🔐 Secure", "⚡ Instant", "↩️ Easy Returns"].map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "#A887B8",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ PREFERENCE DIALOG ══════════════════════════════════════════════ */}
      {dialogOpen && (
        <div
          className="pref-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Personalise your scoop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDialogOpen(false);
          }}
        >
          <div className="pref-dialog">
            <div
              style={{
                padding: "1.8rem 1.8rem 0",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                    color: "#FF8FAB",
                    marginBottom: "4px",
                  }}
                >
                  ✦ Personalise Your Scoop
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-playfair,'Playfair Display',serif)",
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "#3D2C47",
                  }}
                >
                  Your Rules 🌸
                </h2>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "#A887B8",
                    fontWeight: 500,
                    marginTop: "4px",
                    lineHeight: 1.55,
                  }}
                >
                  Tell us what you love, what to skip, or anything else —
                  we&apos;ll curate around you.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                aria-label="Close"
                style={{
                  background: "rgba(200,178,232,0.15)",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,143,171,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(200,178,232,0.15)";
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "1.4rem 1.8rem" }}>
              <label
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#A887B8",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Tell us more ✨
              </label>
              <textarea
                className="textarea-pref"
                value={prefText}
                onChange={(e) => setPrefText(e.target.value)}
                placeholder="e.g. I love pastel colours, no red or orange please. Obsessed with soft girl aesthetic — hair clips, stationery, and cute skincare are my thing! 🌸"
                maxLength={400}
              />
              <div
                style={{
                  textAlign: "right",
                  fontSize: "0.7rem",
                  color: "#D0B0D8",
                  marginTop: "4px",
                }}
              >
                {prefText.length}/400
              </div>
              <p
                style={{
                  fontSize: "0.74rem",
                  color: "#A887B8",
                  fontWeight: 500,
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#FF8FAB",
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                We read every single note with love. Your scoop will always feel
                personal.
              </p>

              <div
                style={{ display: "flex", gap: "10px", marginTop: "1.4rem" }}
              >
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  style={{
                    flex: 1,
                    border: "2px solid rgba(200,178,232,0.4)",
                    borderRadius: "50px",
                    padding: "13px",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: "#7A5C8A",
                    transition: "all 0.2s",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={savePrefs}
                  className="order-btn-main"
                  style={{
                    flex: 2,
                    border: "none",
                    borderRadius: "50px",
                    padding: "13px",
                    background: "linear-gradient(135deg,#FF8FAB,#C8B2E8)",
                    color: "white",
                    cursor: "pointer",
                    fontFamily: "var(--font-quicksand,'Quicksand',sans-serif)",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    boxShadow: "0 6px 20px rgba(255,143,171,0.35)",
                  }}
                >
                  Save Preferences ✦
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}
