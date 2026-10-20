import Link from "next/link";
import { Logo } from "@/components/logo";
import { getLocale } from "@/lib/locale";
import { Stopped } from "@/components/brand-stop";

export default async function NotFound() {
  const arabic = (await getLocale()) === "ar";
  return (
    <main className="not-found">
      <Logo />
      <p className="eyebrow">{arabic ? "404 · الصفحة غير موجودة" : "404 · Off the map"}</p>
      <h1><Stopped>{arabic ? "هذه الصفحة لم تعد متاحة." : "This opportunity moved on."}</Stopped></h1>
      <p>
        {arabic
          ? "ربما نُقلت أو حُذفت، لكن الفرص الجديدة بانتظارك."
          : "The page may have changed, but there are plenty of good places to go next."}
      </p>
      <Link className="button button-primary" href="/jobs">
        {arabic ? "تصفّح الوظائف المفتوحة" : "Browse open roles"}
      </Link>
    </main>
  );
}
