"use client";

import { useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("cookie_consent");
  });

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-[min(960px,calc(100%-1.5rem))] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md">
      <p className="text-sm text-slate-700">
        We use cookies to improve your experience. By continuing, you agree to our Privacy Policy.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("cookie_consent", "accepted");
            setVisible(false);
          }}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("cookie_consent", "rejected");
            setVisible(false);
          }}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
