export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const dictionary = {
  en: {
    nav: { jobs: "Find jobs", companies: "Companies", forEmployers: "For employers", login: "Log in" },
    hero: {
      eyebrow: "Work that moves you forward",
      titleStart: "Your ambition.",
      titleAccent: "The right opportunity.",
      body: "Discover meaningful roles across the Gulf and Syria and connect with teams that value what you bring.",
      find: "Explore open roles",
      hire: "I’m hiring"
    },
    proof: { label: "Built for careers in the Gulf and Syria", jobs: "Live opportunities", companies: "Growing teams", response: "One simple profile" },
    sections: {
      jobsEyebrow: "Selected for you",
      jobsTitle: "Opportunity, without the noise.",
      jobsBody: "Clear roles, useful details, and smarter matching—all in one focused place.",
      viewAll: "View all jobs",
      seekerTitle: "Put your whole story to work.",
      seekerBody: "Create one profile, understand your match, and stay on top of every application.",
      employerTitle: "Hiring momentum, from brief to offer.",
      employerBody: "Bring your vacancies, applicants, interviews, and team into one calm workspace.",
      start: "Get started",
      finalTitle: "The next chapter starts here.",
      finalBody: "Join ambitious people and companies shaping what’s next across the Gulf and Syria."
    },
    footer: { tagline: "Talent, opportunity, and progress—brought together.", product: "Product", company: "Company", legal: "Legal" }
  },
  ar: {
    nav: { jobs: "ابحث عن وظيفة", companies: "الشركات", forEmployers: "لأصحاب العمل", login: "تسجيل الدخول" },
    hero: {
      eyebrow: "خطوتك المهنية التالية",
      titleStart: "طموحك.",
      titleAccent: "وفرصتك المناسبة.",
      body: "اكتشف فرصاً مميزة في الخليج وسوريا، وتواصل مع فرق عمل تقدّر ما تضيفه.",
      find: "تصفّح الوظائف المتاحة",
      hire: "أريد التوظيف"
    },
    proof: { label: "صُمّم للمسيرة المهنية في الخليج وسوريا", jobs: "فرص متاحة", companies: "شركات متنامية", response: "ملف مهني واحد" },
    sections: {
      jobsEyebrow: "وظائف مختارة",
      jobsTitle: "فرص واضحة، بلا تشتيت.",
      jobsBody: "وظائف بتفاصيل واضحة ومطابقة أذكى، في مكان واحد.",
      viewAll: "عرض كل الوظائف",
      seekerTitle: "دع خبرتك تتحدث عنك.",
      seekerBody: "أنشئ ملفاً مهنياً واحداً، واعرف مدى ملاءمتك لكل وظيفة، وتابع طلباتك بسهولة.",
      employerTitle: "توظيف أسرع، من الإعلان حتى العرض الوظيفي.",
      employerBody: "اجمع وظائفك والمتقدمين والمقابلات وفريقك في مساحة عمل واحدة منظّمة.",
      start: "ابدأ الآن",
      finalTitle: "فرصتك المهنية القادمة تبدأ من هنا.",
      finalBody: "انضم إلى مهنيين وشركات طموحة يصنعون المستقبل في الخليج وسوريا."
    },
    footer: { tagline: "نجمع المواهب وأصحاب العمل في مكان واحد.", product: "المنصة", company: "الحساب", legal: "معلومات قانونية" }
  }
} as const;

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ar";
}
