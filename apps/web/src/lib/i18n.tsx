"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "bn";

const dictionary = {
  en: {
    "nav.treatments": "Treatments",
    "nav.hospitals": "Hospitals",
    "nav.destinations": "Destinations",
    "nav.howItWorks": "How It Works",
    "nav.blog": "Blog",
    "nav.login": "Log In",
    "nav.getStarted": "Get Started",

    "footer.discover": "Discover",
    "footer.company": "Company",
    "footer.support": "Support",
    "footer.legal": "Legal",
    "footer.aboutUs": "About Us",
    "footer.partnerWithUs": "Partner With Us",
    "footer.reviews": "Reviews",
    "footer.faq": "FAQ",
    "footer.contact": "Contact",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.rights": "All rights reserved.",
    "footer.disclaimer":
      "Medical treatment is provided solely by independent, licensed partner hospitals.",

    "hero.badge": "15+ accredited partner hospitals",
    "hero.title": "World-class treatment in China, fully coordinated.",
    "hero.description":
      "From your first inquiry to your flight home — hospital booking, visa support, hotels, and airport transfers, coordinated by one dedicated case manager.",
    "hero.startApplication": "Start Application",
    "hero.howItWorks": "How It Works",
    "hero.patientsServed": "patients served",
    "hero.destinationCities": "destination cities",
    "hero.averageRating": "average rating",

    "treatments.heading": "Treatments",
    "treatments.subtitle": "{count} specialties across our accredited hospital network.",
    "treatments.searchPlaceholder": "Search treatments (e.g. cardiology, IVF, neurosurgery)",
    "treatments.searchButton": "Search",
    "treatments.viewAll": "View all →",

    "hospitals.heading": "Featured hospitals",
    "hospitals.subtitle": "Accredited partners across Beijing, Shanghai, and Guangzhou.",
    "hospitals.viewAll": "View all →",

    "howItWorks.heading": "How it works",
    "howItWorks.apply.title": "Apply",
    "howItWorks.apply.body": "Tell us your condition and preferred hospital. No account required to get started.",
    "howItWorks.matched.title": "Get Matched",
    "howItWorks.matched.body": "A hospital reviews your case and sends back a personalized treatment plan.",
    "howItWorks.travel.title": "Travel & Treat",
    "howItWorks.travel.body": "We coordinate your visa, hotel, and airport transfer around your treatment dates.",
    "howItWorks.recover.title": "Recover",
    "howItWorks.recover.body": "Your case manager stays with you through discharge and follow-up care.",

    "reviews.heading": "What our patients say",

    "destinations.heading": "Explore destinations",

    "blog.heading": "Latest from our blog",
    "blog.viewAll": "View all →",

    "cta.heading": "Ready to start your treatment journey?",
    "cta.description":
      "Get matched with an accredited hospital and a dedicated case manager in as little as 48 hours.",
    "cta.button": "Get Started",
  },
  bn: {
    "nav.treatments": "চিকিৎসা",
    "nav.hospitals": "হাসপাতাল",
    "nav.destinations": "গন্তব্য",
    "nav.howItWorks": "কিভাবে কাজ করে",
    "nav.blog": "ব্লগ",
    "nav.login": "লগ ইন",
    "nav.getStarted": "শুরু করুন",

    "footer.discover": "ডিসকভার",
    "footer.company": "কোম্পানি",
    "footer.support": "সহায়তা",
    "footer.legal": "আইনি",
    "footer.aboutUs": "আমাদের সম্পর্কে",
    "footer.partnerWithUs": "আমাদের সাথে অংশীদার হন",
    "footer.reviews": "রিভিউ",
    "footer.faq": "প্রশ্নোত্তর",
    "footer.contact": "যোগাযোগ",
    "footer.privacyPolicy": "গোপনীয়তা নীতি",
    "footer.termsOfService": "সেবার শর্তাবলী",
    "footer.rights": "সর্বস্বত্ব সংরক্ষিত।",
    "footer.disclaimer":
      "চিকিৎসা সেবা শুধুমাত্র স্বাধীন, লাইসেন্সপ্রাপ্ত অংশীদার হাসপাতাল কর্তৃক প্রদান করা হয়।",

    "hero.badge": "১৫+ স্বীকৃত অংশীদার হাসপাতাল",
    "hero.title": "চীনে বিশ্বমানের চিকিৎসা, সম্পূর্ণ সমন্বিতভাবে।",
    "hero.description":
      "আপনার প্রথম অনুসন্ধান থেকে বাড়ি ফেরার ফ্লাইট পর্যন্ত — হাসপাতাল বুকিং, ভিসা সহায়তা, হোটেল এবং বিমানবন্দর ট্রান্সফার, একজন নিবেদিত কেস ম্যানেজার দ্বারা সমন্বিত।",
    "hero.startApplication": "আবেদন শুরু করুন",
    "hero.howItWorks": "কিভাবে কাজ করে",
    "hero.patientsServed": "রোগী সেবা পেয়েছেন",
    "hero.destinationCities": "গন্তব্য শহর",
    "hero.averageRating": "গড় রেটিং",

    "treatments.heading": "চিকিৎসা",
    "treatments.subtitle": "আমাদের স্বীকৃত হাসপাতাল নেটওয়ার্কে {count}টি বিশেষত্ব।",
    "treatments.searchPlaceholder": "চিকিৎসা অনুসন্ধান করুন (যেমন: কার্ডিওলজি, আইভিএফ, নিউরোসার্জারি)",
    "treatments.searchButton": "খুঁজুন",
    "treatments.viewAll": "সব দেখুন →",

    "hospitals.heading": "নির্বাচিত হাসপাতাল",
    "hospitals.subtitle": "বেইজিং, সাংহাই এবং গুয়াংজু জুড়ে স্বীকৃত অংশীদার।",
    "hospitals.viewAll": "সব দেখুন →",

    "howItWorks.heading": "কিভাবে কাজ করে",
    "howItWorks.apply.title": "আবেদন করুন",
    "howItWorks.apply.body": "আপনার অবস্থা এবং পছন্দের হাসপাতাল আমাদের জানান। শুরু করতে কোনো অ্যাকাউন্টের প্রয়োজন নেই।",
    "howItWorks.matched.title": "মিলিয়ে দেওয়া হবে",
    "howItWorks.matched.body": "একটি হাসপাতাল আপনার কেস পর্যালোচনা করে একটি ব্যক্তিগতকৃত চিকিৎসা পরিকল্পনা পাঠাবে।",
    "howItWorks.travel.title": "ভ্রমণ ও চিকিৎসা",
    "howItWorks.travel.body": "আমরা আপনার চিকিৎসার তারিখ অনুযায়ী ভিসা, হোটেল এবং বিমানবন্দর ট্রান্সফার সমন্বয় করি।",
    "howItWorks.recover.title": "সুস্থ হয়ে উঠুন",
    "howItWorks.recover.body": "আপনার কেস ম্যানেজার ছাড়পত্র এবং ফলো-আপ যত্নের মাধ্যমে আপনার সাথে থাকবেন।",

    "reviews.heading": "আমাদের রোগীরা যা বলেন",

    "destinations.heading": "গন্তব্যসমূহ দেখুন",

    "blog.heading": "আমাদের ব্লগ থেকে সর্বশেষ",
    "blog.viewAll": "সব দেখুন →",

    "cta.heading": "আপনার চিকিৎসা যাত্রা শুরু করতে প্রস্তুত?",
    "cta.description": "মাত্র ৪৮ ঘণ্টার মধ্যে একটি স্বীকৃত হাসপাতাল এবং একজন নিবেদিত কেস ম্যানেজারের সাথে মিলিত হন।",
    "cta.button": "শুরু করুন",
  },
} as const;

export type DictKey = keyof typeof dictionary.en;

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "ahl.lang";

function translate(lang: Lang, key: DictKey, vars?: Record<string, string | number>): string {
  let str: string = dictionary[lang][key] ?? dictionary.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}

/**
 * Lightweight client-side language switch — deliberately not a full next-intl /
 * locale-routing setup. This translates the static site chrome (nav, hero, section
 * headings) that's actually visible on the marketing pages; DB-driven content
 * (hospital names, specialty blurbs, blog posts) stays English since translating
 * that requires real content work, not a code change. Preference persists in
 * localStorage; defaults to English.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "bn") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }

  function t(key: DictKey, vars?: Record<string, string | number>): string {
    return translate(lang, key, vars);
  }

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

/** Drop-in translated text node for use inside Server Components — e.g.
 * `<T k="hero.title" />`. Renders as a small client island. */
export function T({ k, vars }: { k: DictKey; vars?: Record<string, string | number> }) {
  const { t } = useLanguage();
  return <>{t(k, vars)}</>;
}
