"use client";

import { useSyncExternalStore } from "react";

const COPY = {
  en: {
    eyebrow: "Something went wrong",
    title: "We couldn’t load this page.",
    body: "Please try again. Your account and work have not been changed.",
    retry: "Try again"
  },
  ar: {
    eyebrow: "حدث خطأ ما",
    title: "تعذّر تحميل هذه الصفحة.",
    body: "يرجى المحاولة مرة أخرى. لم يتغير شيء في حسابك أو عملك.",
    retry: "حاول مرة أخرى"
  }
} as const;

// The root layout sets <html lang> from the language cookie; a client error
// boundary reads it back rather than the cookie.
const readLang = () => (document.documentElement.lang === "ar" ? "ar" : "en");

export default function RootError({ reset }: { reset: () => void }) {
  const locale = useSyncExternalStore(() => () => {}, readLang, () => "en" as const);
  const copy = COPY[locale];
  return (
    <main className="route-error">
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <button className="button button-primary" type="button" onClick={reset}>
          {copy.retry}
        </button>
      </div>
    </main>
  );
}
