import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getPublicJob } from "@/data/public-jobs";
import { BRAND } from "@/lib/brand";
import { employmentTypeLabel, salaryLabel, workModeLabel } from "@/lib/labels";

/**
 * The card a shared job link shows on WhatsApp, LinkedIn and the like
 * (review, 20 Oct). English text: the image font has Latin glyphs only, so an
 * Arabic-only title falls back to the company's name and a generic line.
 */
export const alt = "A job on TalentSouq";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ARABIC = /[؀-ۿ]/;

export default async function JobImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [job, icon] = await Promise.all([
    getPublicJob(id),
    readFile(join(process.cwd(), "public", "brand", "icon.svg"), "utf8").catch(() => "")
  ]);
  const company = job?.company.name || "A TalentSouq employer";
  const title = job && !ARABIC.test(job.title) ? job.title : "New role on TalentSouq";
  const safeCompany = ARABIC.test(company) ? "" : company;
  const salary = job && (job.salaryMin || job.salaryMax) ? salaryLabel(job.salaryMin, job.salaryMax, job.currency, "en") : null;
  const facts = job ? [job.location && !ARABIC.test(job.location) ? job.location : null, workModeLabel(job.workMode, "en"), employmentTypeLabel(job.employmentType, "en")].filter(Boolean).join("  ·  ") : "";
  const iconSrc = icon ? `data:image/svg+xml;base64,${Buffer.from(icon).toString("base64")}` : null;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #0B1B23 0%, #0E3B36 100%)", color: "#E8EDEE", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {iconSrc ? <img src={iconSrc} width={72} height={72} style={{ borderRadius: 16 }} alt="" /> : null}
          {/* One line on purpose: a line break between the spans renders as a space. */}
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}><span style={{ color: "#33AC9C" }}>Talent</span><span style={{ color: "#EA7C20" }}>Souq</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {safeCompany ? <div style={{ fontSize: 34, color: "#B8C4C8" }}>{safeCompany}</div> : null}
          <div style={{ display: "flex", fontSize: title.length > 40 ? 60 : 72, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
            {title}
            <span style={{ color: "#EA7C20" }}>.</span>
          </div>
          {facts ? <div style={{ fontSize: 30, color: "#B8C4C8" }}>{facts}</div> : null}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28 }}>
          <span style={{ color: "#EF9748", fontWeight: 700 }}>{salary ?? ""}</span>
          <span style={{ color: "#B8C4C8" }}>{BRAND.origin.replace("https://", "")}</span>
        </div>
      </div>
    ),
    size
  );
}
