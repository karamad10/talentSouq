export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const dictionary = {
  en: {
    nav: { jobs: "Find jobs", companies: "Companies", forEmployers: "For employers", login: "Log in" },
    hero: {
      eyebrow: "Work that moves you forward",
      titleStart: "Your ambition.",
      titleAccent: "The right opportunity.",
      body: "Discover meaningful roles across the Gulf and connect with teams that value what you bring.",
      find: "Explore open roles",
      hire: "I’m hiring"
    },
    proof: { label: "Built for careers in the Gulf", jobs: "Live opportunities", companies: "Growing teams", response: "One simple profile" },
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
      finalBody: "Join ambitious people and companies shaping what’s next across the region."
    },
    footer: { tagline: "Talent, opportunity, and progress—brought together.", product: "Product", company: "Company", legal: "Legal" }
  },
  ar: {
    nav: { jobs: "ابحث عن وظائف", companies: "الشركات", forEmployers: "لأصحاب العمل", login: "تسجيل الدخول" },
    hero: {
      eyebrow: "عمل يدفعك إلى الأمام",
      titleStart: "طموحك.",
      titleAccent: "والفرصة المناسبة.",
      body: "اكتشف فرصاً مميزة في الخليج وتواصل مع فرق تقدّر ما يمكنك تقديمه.",
      find: "استكشف الوظائف",
      hire: "أبحث عن مواهب"
    },
    proof: { label: "مصمم لمسيرتك في الخليج", jobs: "فرص متاحة", companies: "شركات متنامية", response: "ملف شخصي واحد" },
    sections: {
      jobsEyebrow: "مختارة لك",
      jobsTitle: "فرص واضحة، بلا ضوضاء.",
      jobsBody: "وظائف واضحة وتفاصيل مفيدة وتوافق أذكى، في مكان واحد.",
      viewAll: "عرض كل الوظائف",
      seekerTitle: "دع قصتك المهنية تعمل لأجلك.",
      seekerBody: "أنشئ ملفاً واحداً وافهم مدى توافقك وتابع كل طلباتك بسهولة.",
      employerTitle: "زخم في التوظيف، من الشاغر إلى العرض.",
      employerBody: "اجمع الوظائف والمتقدمين والمقابلات وفريقك في مساحة عمل هادئة.",
      start: "ابدأ الآن",
      finalTitle: "فصلك القادم يبدأ هنا.",
      finalBody: "انضم إلى أشخاص وشركات طموحة تصنع مستقبل المنطقة."
    },
    footer: { tagline: "المواهب والفرص والتقدم، في مكان واحد.", product: "المنتج", company: "الشركة", legal: "قانوني" }
  }
} as const;

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ar";
}
