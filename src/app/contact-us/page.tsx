import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Headset, Mail, MapPin, MessageCircle, Phone, Rocket, Send, ShieldCheck } from "lucide-react";
import { siFacebook, siInstagram, siPinterest, siWhatsapp, siX, siYoutube } from "simple-icons";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { Icon3D } from "@/components/Icon3D";
import { site, social } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Support – Talk to Our App Experts",
  description:
    "Questions about a health, food or wellness app script, customization, installation or server setup? Contact the Infidec Marketplace experts – we reply within 1-2 business days.",
  alternates: { canonical: "/contact-us" },
  openGraph: { url: "/contact-us" },
};

const fullAddress = `${site.address.street}, ${site.address.city}-${site.address.postalCode}, ${site.address.region}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

const contactCards = [
  { title: "Email Us", value: site.email, href: `mailto:${site.email}`, note: "We reply within 24 hours.", Icon: Mail },
  { title: "Call Us", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}`, note: "Speak directly with our team.", Icon: Phone },
  { title: "Visit Us", value: fullAddress, href: mapsUrl, external: true, note: "In-person consultations welcome.", Icon: MapPin },
  { title: "Working Hours", value: site.hours, note: "Available during business hours.", Icon: Clock },
];

const steps = [
  { title: "Share your requirements", text: "Tell us about your product, server or customization needs using the form.", Icon: Send },
  { title: "Expert review in 24 hours", text: "A product specialist reviews your request and replies with a clear plan and quote.", Icon: Headset },
  { title: "Launch with confidence", text: "We set up, customize and hand over a production-ready product with ongoing support.", Icon: Rocket },
];

const stats = [
  { value: "< 24h", label: "Avg. response" },
  { value: "24K+", label: "Happy clients" },
  { value: "4.8★", label: "Support rating" },
];

const socialIcons = { facebook: siFacebook, instagram: siInstagram, x: siX, youtube: siYoutube, pinterest: siPinterest, whatsapp: siWhatsapp } as const;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/contact-us", label: "Contact Us" },
        ]}
        title="Contact Support"
        description="Have a question or need assistance? Reach out to our dedicated support team."
      />

      {/* Contact panel + form */}
      <section
        aria-labelledby="experts-title"
        className="bg-soft py-16 lg:py-20"
      >
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-10">
          <aside className="relative isolate self-start overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-900 to-brand-900 p-7 text-white shadow-float sm:p-9">
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 -z-10 size-64 rounded-full bg-brand-400/30 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-28 -left-20 -z-10 size-72 rounded-full bg-accent-500/30 blur-3xl"
            />

            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide uppercase ring-1 ring-white/20">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-emerald-400"
              />{" "}
              We&apos;re online
            </p>
            <h2
              id="experts-title"
              className="mt-5 text-2xl leading-tight font-semibold sm:text-[28px]"
            >
              Contact Our Experts
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-white/80">
              Whether it is a script package, a customization request or server
              setup, our team is here to help you launch faster.
            </p>

            <ul className="mt-8 space-y-1">
              {contactCards.map(
                ({ title, value, href, note, Icon, external }) => {
                  const body = (
                    <>
                      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 transition-colors group-hover:bg-white group-hover:text-brand-700">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold tracking-wide text-white/60 uppercase">
                          {title}
                        </span>
                        <span className="mt-0.5 block text-[15px] font-medium break-words">
                          {value}
                        </span>
                        <span className="mt-0.5 block text-[13px] text-white/60">
                          {note}
                        </span>
                      </span>
                    </>
                  );
                  const cls =
                    "group -mx-3 flex gap-4 rounded-2xl p-3 transition-colors";
                  return (
                    <li key={title}>
                      {href ? (
                        <a
                          href={href}
                          {...(external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className={`${cls} hover:bg-white/10`}
                        >
                          {body}
                        </a>
                      ) : (
                        <div className={cls}>{body}</div>
                      )}
                    </li>
                  );
                },
              )}
            </ul>

            <div className="mt-7 border-t border-white/15 pt-6">
              <p className="text-xs font-semibold tracking-wide text-white/60 uppercase">
                Follow us
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {social.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${site.name} on ${s.label}`}
                      className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-colors hover:bg-white hover:text-brand-700"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="size-4"
                        fill="currentColor"
                      >
                        <path d={socialIcons[s.key].path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="min-w-0">
            <ul className="mb-6 grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <li
                  key={s.label}
                  className="rounded-2xl border border-white bg-white/80 px-3 py-3 text-center shadow-card sm:px-4"
                >
                  <p className="text-lg font-semibold text-brand-700 sm:text-xl">
                    {s.value}
                  </p>
                  <p className="text-xs text-muted sm:text-sm">{s.label}</p>
                </li>
              ))}
            </ul>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section
        aria-labelledby="next-title"
        className="cv-auto container-x py-16 lg:py-20"
      >
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-brand-600 uppercase">
            <span aria-hidden="true">✦</span> How it works{" "}
            <span aria-hidden="true">✦</span>
          </p>
          <h2
            id="next-title"
            className="text-2xl font-semibold text-ink sm:text-[32px] sm:leading-tight"
          >
            What Happens After You Reach Out
          </h2>
        </div>
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map(({ title, text, Icon }, i) => (
            <li
              key={title}
              className="group relative rounded-2xl border border-line bg-white p-7 shadow-card"
            >
              <span
                aria-hidden="true"
                className="absolute top-5 right-6 text-5xl font-bold text-brand-100"
              >
                0{i + 1}
              </span>
              <Icon3D Icon={Icon} index={i} />
              <h3 className="mt-6 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-body">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Map */}
      <section
        aria-labelledby="office-title"
        className="cv-auto container-x pb-16 lg:pb-20"
      >
        <div className="relative overflow-hidden rounded-3xl border border-line bg-white shadow-card">
          <iframe
            title={`${site.name} office location on Google Maps`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[340px] w-full border-0 sm:h-[440px]"
          />
          <div className="m-4 rounded-2xl bg-white p-5 shadow-float sm:absolute sm:top-6 sm:right-6 sm:m-0 sm:max-w-sm">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <MapPin aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2
                  id="office-title"
                  className="text-base font-semibold text-ink"
                >
                  Our Office
                </h2>
                <p className="mt-1 text-sm leading-6 text-body">
                  {fullAddress}
                </p>
                <p className="mt-1 text-sm text-muted">{site.hours}</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
                >
                  Get directions{" "}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick help CTA */}
      <section
        aria-labelledby="quick-help-title"
        className="container-x pb-16 lg:pb-20"
      >
        <div className="relative isolate flex flex-col items-start gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 px-6 py-8 text-white sm:px-10 md:flex-row md:items-center md:justify-between">
          <div
            aria-hidden="true"
            className="absolute -top-20 right-10 -z-10 size-56 rounded-full bg-brand-400/30 blur-3xl"
          />
          <div className="flex items-start gap-4">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <ShieldCheck aria-hidden="true" className="size-6" />
            </span>
            <div>
              <h2
                id="quick-help-title"
                className="text-xl font-semibold sm:text-2xl"
              >
                Need a quick answer?
              </h2>
              <p className="mt-1 text-[15px] text-white/80">
                Browse our FAQs or chat with us on WhatsApp for instant help.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/faqs"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm font-semibold ring-1 ring-white/30 transition-colors hover:bg-white/20"
            >
              Read FAQs
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
            >
              <MessageCircle aria-hidden="true" className="size-5" /> Chat on
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
