"use client";

export default function RootError({ reset }: { reset: () => void }) {
  return <main className="route-error"><div><p className="eyebrow">Something went wrong</p><h1>We couldn’t load this page.</h1><p>Please try again. Your account and work have not been changed.</p><button className="button button-primary" type="button" onClick={reset}>Try again</button></div></main>;
}
