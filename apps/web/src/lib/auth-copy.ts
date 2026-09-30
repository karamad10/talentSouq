import type { Locale } from "@/lib/i18n";

/**
 * Auth actions report back through `?error=` / `?message=` in English — our own
 * sentences and a few Supabase ones. Shown to an Arabic visitor, they are
 * translated here; anything unrecognised (a new server message) passes through.
 */
const AR: Record<string, string> = {
  "Enter your email and password.": "أدخل بريدك الإلكتروني وكلمة المرور.",
  "Supabase is not configured for this environment yet.": "تسجيل الدخول غير متاح في هذه البيئة حالياً.",
  "Use a valid email and a password with at least 8 characters.": "استخدم بريداً إلكترونياً صالحاً وكلمة مرور من 8 أحرف على الأقل.",
  "Check your email to confirm your TalentSouq account.": "تحقق من بريدك الإلكتروني لتأكيد حسابك في تالنت سوق.",
  "Could not start social login.": "تعذّر بدء تسجيل الدخول عبر الحساب الاجتماعي.",
  "Enter the email address on your TalentSouq account.": "أدخل البريد الإلكتروني المسجّل في حسابك على تالنت سوق.",
  "Check your email for a password reset link.": "تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور.",
  "Use matching passwords with at least 8 characters.": "استخدم كلمتي مرور متطابقتين من 8 أحرف على الأقل.",
  "Your password was updated. Log in with the new password.": "تم تحديث كلمة المرور. سجّل الدخول بكلمة المرور الجديدة.",
  // Supabase Auth
  "Invalid login credentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "Email not confirmed": "يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.",
  "User already registered": "هذا البريد الإلكتروني مسجّل مسبقاً. جرّب تسجيل الدخول.",
  "Password should be at least 8 characters.": "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل."
};

export function authMessage(text: string | undefined, locale: Locale): string {
  if (!text) return "";
  return locale === "ar" ? (AR[text] ?? text) : text;
}
