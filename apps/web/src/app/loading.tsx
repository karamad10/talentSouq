import { getLocale } from "@/lib/locale";

export default async function RootLoading() {
  const arabic = (await getLocale()) === "ar";
  return (
    <main className="route-loading" aria-live="polite" aria-label={arabic ? "جارٍ تحميل الصفحة" : "Loading page"}>
      <span className="route-loading-mark" />
      <div>
        <strong>{arabic ? "جارٍ تحميل تالنت سوق" : "Loading TalentSouq"}</strong>
        <p>{arabic ? "نجهّز مساحة عملك…" : "Preparing your workspace…"}</p>
      </div>
    </main>
  );
}
