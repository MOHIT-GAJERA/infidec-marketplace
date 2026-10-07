import Link from "next/link";
import { Copyright, Heart } from "lucide-react";
import { siFacebook, siInstagram, siPinterest, siWhatsapp, siX, siYoutube } from "simple-icons";
import { Logo } from "./Logo";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { footerNav, site, social } from "@/lib/site";

const icons = {
  facebook: siFacebook,
  instagram: siInstagram,
  x: siX,
  youtube: siYoutube,
  pinterest: siPinterest,
  whatsapp: siWhatsapp,
} as const;

export function Footer() {
  return (
    <footer className="cv-auto bg-brand-900 text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-8 lg:py-20">
        <div className="max-w-md">
          <Logo tone="dark" className="h-14 w-auto" />
          <p className="mt-6 text-base leading-7 text-white/75">
            {site.name} is a creative and dedicated team of developers with expertise in health, food and wellness app
            development, committed to delivering high-quality solutions to clients worldwide.
          </p>
          <p className="mt-6 text-sm font-semibold tracking-wide text-white uppercase">Follow us</p>
          <ul className="mt-3 flex flex-wrap gap-2.5">
            {social.map((s) => {
              const icon = icons[s.key];
              return (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.name} on ${s.label}`}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-brand-500 hover:bg-brand-500 hover:text-white"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]" fill="currentColor">
                      <path d={icon.path} />
                    </svg>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        {footerNav.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-xl font-semibold text-white">{col.title}</h2>
            <ul className="mt-5 space-y-1">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 text-base text-white/75 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        {/* Right padding keeps the currency switcher clear of the floating WhatsApp / back-to-top buttons */}
        <div className="container-x flex flex-col items-start justify-between gap-3 py-5 text-base text-white/85 sm:flex-row sm:items-center sm:pr-24">

          <p className="flex flex-wrap items-center gap-1.5">
            Copyright <Copyright aria-hidden="true" className="size-5" /> {new Date().getFullYear()} All Rights Reserved
            &amp; Designed by <Heart aria-hidden="true" className="size-4 fill-sale text-sale" />
            <a
              href="https://infidec.com/"
              target="_blank"
              rel="noopener"
              className="font-medium text-white underline underline-offset-2 hover:text-brand-200"
            >
              Infidec.
            </a>
          </p>
          <CurrencySwitcher tone="dark" id="currency-menu-footer" />
        </div>
      </div>
    </footer>
  );
}
