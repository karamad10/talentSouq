import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCareerPage } from "./career-page";
import { listPublicCompanies } from "./public-companies";
import { getPublicJob, listPublicJobs } from "./public-jobs";

const card = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Senior Accountant",
  title_ar: "محاسب أول",
  category: "Finance",
  employment_type: "full_time",
  location_mode: "on_site",
  location_text: "Damascus, Syria",
  salary_min: 12000,
  salary_max: 18000,
  salary_currency: "AED",
  salary_period: "month",
  is_featured: true,
  external_apply: false,
  created_at: "2026-09-29T10:00:00Z",
  application_deadline: "2026-12-31",
  summary: "Own the monthly close.",
  company_name: "Acme",
  company_logo_url: null,
  company_industry: "Finance",
  company_career_slug: "acme"
};

const ok = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
  vi.stubEnv("SUPABASE_URL", "");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "");
  vi.stubEnv("SUPABASE_ANON_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("listPublicJobs", () => {
  it("maps the RPC payload and sends the query as RPC arguments", async () => {
    const fetchMock = vi.fn(() =>
      ok({
        total: 1,
        items: [card],
        facets: {
          categories: [{ name: "Finance", count: 1 }],
          employment_types: [{ value: "full_time", count: 1 }],
          location_modes: [{ value: "on_site", count: 1 }]
        }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const board = await listPublicJobs({ q: " accountant ", category: "Finance", limit: 10 });

    expect(board.total).toBe(1);
    expect(board.items[0]).toMatchObject({
      id: card.id,
      titleAr: "محاسب أول",
      workMode: "on_site",
      employmentType: "full_time",
      easyApply: true,
      company: { name: "Acme", careerSlug: "acme" }
    });
    expect(board.facets.categories).toEqual([{ value: "Finance", count: 1 }]);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://example.supabase.co/rest/v1/rpc/public_jobs");
    expect(JSON.parse(init.body as string)).toMatchObject({ p_q: "accountant", p_category: "Finance", p_limit: 10 });
  });

  it("returns an empty board when the request fails, instead of throwing", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("offline"))));
    await expect(listPublicJobs()).resolves.toEqual({
      total: 0,
      items: [],
      facets: { categories: [], employmentTypes: [], workModes: [] }
    });
  });

  it("returns an empty board on a non-200 (the function not deployed yet)", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response("{}", { status: 404 }))));
    expect((await listPublicJobs()).items).toEqual([]);
  });

  it("makes no request at all without Supabase env", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect((await listPublicJobs()).total).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("getPublicJob", () => {
  it("never asks the database about something that is not a uuid", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await getPublicJob("frontend-engineer")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps the detail fields", async () => {
    vi.stubGlobal("fetch", vi.fn(() => ok({ ...card, description: "Full text", description_ar: "نص كامل", skills: ["IFRS"], apply_url: null, experience_min: 5, experience_max: null, company_size: "51-200" })));
    expect(await getPublicJob(card.id)).toMatchObject({ description: "Full text", descriptionAr: "نص كامل", skills: ["IFRS"], experienceMin: 5 });
  });

  it("is null when the RPC answers null (not public)", async () => {
    vi.stubGlobal("fetch", vi.fn(() => ok(null)));
    expect(await getPublicJob(card.id)).toBeNull();
  });
});

describe("listPublicCompanies and getCareerPage", () => {
  it("maps companies, and is empty on failure", async () => {
    vi.stubGlobal("fetch", vi.fn(() => ok([{ name: "Acme", logo_url: null, industry: "Finance", size: null, hq_location: "Dubai", summary: null, career_page_slug: "acme", is_featured_employer: false, open_roles: 3 }])));
    expect(await listPublicCompanies()).toEqual([
      { name: "Acme", logoUrl: null, industry: "Finance", size: null, hqLocation: "Dubai", summary: null, careerSlug: "acme", featured: false, openRoles: 3 }
    ]);
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("offline"))));
    expect(await listPublicCompanies()).toEqual([]);
  });

  it("maps a career page and is null for an unknown slug", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        ok({
          company: { name: "Acme", logo_url: null, cover_image_url: null, industry: null, hq_location: null, size: null, website: null, description: null, career_page_headline: "Build with us", career_page_intro: null, career_page_slug: "acme" },
          jobs: [card],
          stories: [{ id: "s1", kind: "story", title: "Why I joined", body: "…", image_url: null, video_url: null, author_name: "Layla", author_role: null }],
          videos: []
        })
      )
    );
    const page = await getCareerPage("acme");
    expect(page?.company).toMatchObject({ name: "Acme", headline: "Build with us", slug: "acme" });
    expect(page?.jobs[0]?.id).toBe(card.id);
    expect(page?.stories[0]).toMatchObject({ title: "Why I joined", authorName: "Layla" });

    vi.stubGlobal("fetch", vi.fn(() => ok(null)));
    expect(await getCareerPage("missing")).toBeNull();
  });
});
