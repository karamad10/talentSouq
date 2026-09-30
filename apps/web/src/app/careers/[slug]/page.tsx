import type { Metadata } from "next";
import { ArrowUpRight, Building2, Globe, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { CompanyAvatar, PublicJobCard } from "@/components/public/job-card";
import { Container, PublicFooter } from "@/components/public/public-shell";
import { getCareerPage } from "@/data/career-page";
import { getSessionUser } from "@/lib/auth/session";
import { BRAND } from "@/lib/brand";
import { categoryLabel, rolesCount } from "@/lib/labels";
import { getPreferences } from "@/lib/locale";
import { toEmbedUrl } from "@/lib/video-embed";

/**
 * A company's public career page (report RPT-2026-014 §6: the app printed
 * talentsouq.it.com/careers/<slug> but the site had no such page). Served from
 * `public_career_page`, which returns only a published page, public jobs and
 * published media, with no contact details.
 */

/** Only an ordinary web address is linked; anything else the employer typed is dropped. */
function safeWebsite(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCareerPage(slug);
  if (!page) return { title: "Careers" };
  const name = page.company.name || "Careers";
  const description = page.company.headline ?? page.company.intro ?? `Open roles at ${name}.`;
  return {
    title: `Careers at ${name}`,
    description,
    openGraph: {
      title: `Careers at ${name}`,
      description,
      url: `/careers/${slug}`,
      // The company's cover when it has one; otherwise the site's preview image applies.
      ...(page.company.coverImageUrl ? { images: [page.company.coverImageUrl] } : {})
    }
  };
}

export default async function CareerPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, { locale, theme }, user] = await Promise.all([params, getPreferences(), getSessionUser()]);
  const page = await getCareerPage(slug);
  if (!page) notFound();
  const arabic = locale === "ar";
  const { company, jobs, stories } = page;
  const videos = page.videos.map((v) => ({ ...v, embed: v.videoUrl ? toEmbedUrl(v.videoUrl) : null })).filter((v) => v.embed);
  const website = safeWebsite(company.website);
  const name = company.name || (arabic ? "صاحب عمل على تالنت سوق" : "TalentSouq employer");

  return (
    <main className="bg-ts-paper">
      <PublicHeader locale={locale} theme={theme} user={user} />

      <section className="border-b border-ts-line bg-ts-surface">
        {company.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- employer cover images live in Supabase Storage; no image loader is configured for it
          <img src={company.coverImageUrl} alt="" className="h-[clamp(9rem,22vw,16rem)] w-full object-cover" />
        ) : null}
        <Container className="py-12 max-[680px]:py-9">
          <div className="flex flex-wrap items-center gap-5">
            <CompanyAvatar name={name} logoUrl={company.logoUrl} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="m-0 text-xs font-bold tracking-[0.12em] text-ts-primary uppercase">{arabic ? "الوظائف لدى" : "Careers at"}</p>
              <h1 className="m-0 mt-2 text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-bold tracking-[-0.035em] text-ts-ink">{name}</h1>
              <p className="m-0 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-ts-muted">
                {company.industry ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 size={15} aria-hidden="true" /> {categoryLabel(company.industry, locale)}
                  </span>
                ) : null}
                {company.hqLocation ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} aria-hidden="true" /> {company.hqLocation}
                  </span>
                ) : null}
              </p>
            </div>
          </div>
          {company.headline ? (
            <p className="[unicode-bidi:plaintext] m-0 mt-8 max-w-3xl text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug font-semibold tracking-[-0.02em] text-ts-ink">
              {company.headline}
            </p>
          ) : null}
          {company.intro ?? company.description ? (
            <p className="[unicode-bidi:plaintext] m-0 mt-3 max-w-3xl text-[16px] leading-relaxed whitespace-pre-line text-ts-muted">
              {company.intro ?? company.description}
            </p>
          ) : null}
        </Container>
      </section>

      <section className="py-14 max-[680px]:py-10">
        <Container className="flex flex-col gap-14">
          <div>
            <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">
              {arabic ? "الوظائف المفتوحة" : "Open roles"}
              <span className="ms-3 text-base font-semibold text-ts-muted">{rolesCount(jobs.length, locale)}</span>
            </h2>
            {jobs.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-6 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-3">
                {jobs.map((job) => (
                  <PublicJobCard key={job.id} job={job} locale={locale} />
                ))}
              </div>
            ) : (
              <p className="m-0 mt-4 text-[15px] text-ts-muted">
                {arabic ? "لا توجد وظائف مفتوحة حالياً. عُد قريباً." : "No open roles right now. Check back soon."}
              </p>
            )}
          </div>

          {stories.length > 0 ? (
            <div>
              <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">{arabic ? "الحياة في الشركة" : "Life here"}</h2>
              <div className="mt-6 grid grid-cols-1 gap-6 min-[900px]:grid-cols-2">
                {stories.map((story) => (
                  <article key={story.id} className="flex min-w-0 flex-col gap-3 rounded-ts-lg border border-ts-line bg-ts-surface p-6">
                    {story.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- story images live in Supabase Storage
                      <img src={story.imageUrl} alt="" loading="lazy" className="aspect-[16/9] w-full rounded-ts-md object-cover" />
                    ) : null}
                    <h3 className="[unicode-bidi:plaintext] m-0 text-lg font-semibold text-ts-ink">{story.title}</h3>
                    {story.body ? <p className="[unicode-bidi:plaintext] m-0 text-[15px] leading-relaxed whitespace-pre-line text-ts-muted">{story.body}</p> : null}
                    {story.authorName ? (
                      <p className="[unicode-bidi:plaintext] m-0 text-sm font-semibold text-ts-ink">
                        {story.authorName}
                        {story.authorRole ? <span className="font-normal text-ts-muted">, {story.authorRole}</span> : null}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {videos.length > 0 ? (
            <div>
              <h2 className="m-0 text-2xl font-bold tracking-[-0.025em] text-ts-ink">{arabic ? "فيديوهات" : "Videos"}</h2>
              <div className="mt-6 grid grid-cols-1 gap-6 min-[900px]:grid-cols-2">
                {videos.map((video) => (
                  <figure key={video.id} className="m-0 min-w-0">
                    <div className="aspect-video overflow-hidden rounded-ts-lg border border-ts-line bg-black">
                      <iframe
                        src={video.embed!}
                        title={video.title}
                        allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="h-full w-full"
                      />
                    </div>
                    <figcaption className="[unicode-bidi:plaintext] mt-2 text-sm text-ts-muted">{video.title}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ) : null}

          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-ts-line pt-6 text-sm text-ts-muted">
            {website ? (
              <a href={website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 font-semibold text-ts-primary-deep hover:underline">
                <Globe size={15} aria-hidden="true" /> {new URL(website).hostname.replace(/^www\./, "")}
                <ArrowUpRight size={14} aria-hidden="true" className="rtl:-scale-x-100" />
              </a>
            ) : (
              <span />
            )}
            <p className="m-0">
              {arabic ? "مدعوم من " : "Powered by "}
              <Link href="/" className="font-semibold text-ts-ink hover:text-ts-primary">
                TalentSouq
              </Link>{" "}
              — {BRAND.signature}
            </p>
          </footer>
        </Container>
      </section>

      <PublicFooter locale={locale} />
    </main>
  );
}
