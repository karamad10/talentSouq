import { rpc } from "@/lib/supabase/public-rpc";
import { toPublicJob, type JobCardRow, type PublicJob } from "@/data/public-jobs";

/** A company's public career page (`public_career_page`): null when unknown or unpublished. */
type MediaRow = {
  id: string;
  kind: "story" | "video";
  title: string;
  body: string | null;
  image_url: string | null;
  video_url: string | null;
  author_name: string | null;
  author_role: string | null;
};

type CareerPageRow = {
  company: {
    name: string | null;
    logo_url: string | null;
    cover_image_url: string | null;
    industry: string | null;
    hq_location: string | null;
    size: string | null;
    website: string | null;
    description: string | null;
    career_page_headline: string | null;
    career_page_intro: string | null;
    career_page_slug: string;
  };
  jobs: JobCardRow[];
  stories: MediaRow[];
  videos: MediaRow[];
};

export type CareerMedia = {
  id: string;
  title: string;
  body: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  authorName: string | null;
  authorRole: string | null;
};

export type CareerPage = {
  company: {
    name: string;
    logoUrl: string | null;
    coverImageUrl: string | null;
    industry: string | null;
    hqLocation: string | null;
    size: string | null;
    website: string | null;
    description: string | null;
    headline: string | null;
    intro: string | null;
    slug: string;
  };
  jobs: PublicJob[];
  stories: CareerMedia[];
  videos: CareerMedia[];
};

const toMedia = (m: MediaRow): CareerMedia => ({
  id: m.id,
  title: m.title,
  body: m.body,
  imageUrl: m.image_url,
  videoUrl: m.video_url,
  authorName: m.author_name,
  authorRole: m.author_role
});

export async function getCareerPage(slug: string): Promise<CareerPage | null> {
  if (!slug || slug.length > 120) return null;
  const row = await rpc<CareerPageRow>("public_career_page", { p_slug: slug });
  if (!row?.company) return null;
  const c = row.company;
  return {
    company: {
      name: c.name?.trim() || "",
      logoUrl: c.logo_url,
      coverImageUrl: c.cover_image_url,
      industry: c.industry,
      hqLocation: c.hq_location,
      size: c.size,
      website: c.website,
      description: c.description,
      headline: c.career_page_headline,
      intro: c.career_page_intro,
      slug: c.career_page_slug
    },
    jobs: (row.jobs ?? []).map(toPublicJob),
    stories: (row.stories ?? []).map(toMedia),
    videos: (row.videos ?? []).map(toMedia)
  };
}
