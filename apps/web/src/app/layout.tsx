import type { Metadata } from "next";
import { cookies } from "next/headers";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { isLocale } from "@/lib/i18n";
import { AppInteractionLayer } from "@/components/app-interaction-layer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "optional", fallback: ["Arial", "sans-serif"] });
const arabic = IBM_Plex_Sans_Arabic({ weight: ["400", "500", "600", "700"], subsets: ["arabic"], variable: "--font-arabic", display: "optional", fallback: ["Arial", "sans-serif"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://talentsouq.it.com"),
  title: { default: "TalentSouq — Opportunity meets ambition", template: "%s · TalentSouq" },
  description: "Discover meaningful roles and build great teams across the Gulf.",
  openGraph: { title: "TalentSouq", description: "Opportunity meets ambition across the Gulf.", type: "website", locale: "en_US" }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("ts-locale")?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : "en";
  const theme = cookieStore.get("ts-theme")?.value === "dark" ? "dark" : "light";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} data-theme={theme} data-scroll-behavior="smooth" className={`${inter.variable} ${arabic.variable}`}>
      {/* Browser extensions such as Grammarly add data-* attributes to body before hydration. */}
      <body suppressHydrationWarning><AppInteractionLayer />{children}</body>
    </html>
  );
}
