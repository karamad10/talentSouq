import Link from "next/link";
import { Logo } from "@/components/logo";
import { getLocale } from "@/lib/locale";

export default async function NotFound() {
  const arabic = (await getLocale()) === "ar";
  return (
    <main className="not-found">
      <Logo />
      <p className="eyebrow">{arabic ? "404 · خارج الخريطة" : "404 · Off the map"}</p>
      <h1>{arabic ? "هذه الفرصة لم تعد هنا." : "This opportunity moved on."}</h1>
      <p>
        {arabic
          ? "ربما تغيّرت الصفحة، لكن أمامك الكثير من الوجهات الجيدة."
          : "The page may have changed, but there are plenty of good places to go next."}
      </p>
      <Link className="button button-primary" href="/jobs">
        {arabic ? "تصفّح الوظائف المفتوحة" : "Browse open roles"}
      </Link>
    </main>
  );
}
