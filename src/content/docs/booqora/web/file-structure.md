---
title: File Structure
description: Where everything lives in booqora_website, covering the App Router pages, shared components, content files, site config, the post-build SEO script and public assets.
---

```text title="booqora_website/"
src/
  app/                          Next.js App Router — one folder per route
    layout.tsx                  <html>, fonts, default metadata, Organization/WebSite/SoftwareApplication JSON-LD,
                                header, footer, theme colour
    globals.css                 Tailwind 4 theme: brand colours, fonts, radius, animations, utility classes
    page.tsx                    home page (/)
    not-found.tsx               404 page
    icon.png, apple-icon.png    favicon and Apple touch icon (picked up automatically by Next.js)
    features/page.tsx           /features (four themed groups)
    features/[slug]/page.tsx    /features/<slug> — generateStaticParams + generateMetadata from features.ts
    industries/page.tsx         /industries
    industries/[slug]/page.tsx  /industries/<slug> — from industries.ts
    pricing/page.tsx            /pricing
    integrations/page.tsx       /integrations
    mobile-app/page.tsx         /mobile-app (screens and FAQs are defined in this file)
    about/page.tsx              /about
    contact/page.tsx            /contact
    blog/page.tsx               /blog
    blog/[slug]/page.tsx        /blog/<slug> — renders post blocks, Article JSON-LD
  components/
    site-header.tsx             sticky header, desktop drop-down menus, mobile menu, Log in / Start free trial
    sections.tsx                AuroraHero, Breadcrumbs, FaqSection, CtaBand, SiteFooter, JsonLd,
                                breadcrumbLd(), faqLd()
    ui-kit.tsx                  Logo, PrimaryButton, GhostButton, Eyebrow, SectionHeading,
                                BrowserFrame, PhoneFrame, Chip, IntegrationTile
    pricing-table.tsx           plan cards with the monthly / yearly toggle
    contact-form.tsx            mailto: contact form (no backend)
    motion.tsx                  Reveal, Stagger, Float, Parallax helpers (motion/react)
    home/hero-visual.tsx        the layered screenshot collage in the home hero
    art/post-cover.tsx          drawn covers for blog posts (launch, pricing, calendar)
    ui/                         shadcn/ui primitives: accordion, badge, button, separator, sheet, tabs
  content/                      ALL editable copy — see Editing Content
    features.ts                 13 feature entries (11 pages + Mobile app + Integrations menu links)
    industries.ts               6 industries
    catalog.ts                  plans, integrations, pricing FAQs, home FAQs
    posts.ts                    blog guides
  lib/
    site.ts                     site name, URL, e-mail, platform login/signup/privacy URLs, trial days, currency
    utils.ts                    cn() class-name helper
public/
  logo-mark.png                 logo used in the header, footer and JSON-LD
  og.png                        1200 × 630 social sharing image
  shots/                        real platform (desktop) and m-* mobile screenshots, .webp
  industries/                   one photo per industry, named <industry-slug>.webp
scripts/
  postbuild-seo.mjs             runs after next build: sitemap.xml, robots.txt, prefetch-file mirroring
next.config.ts                  output: "export", images.unoptimized, Tailwind turbopack loader
firebase.json                   Hosting config for target "website" (public: out)
.firebaserc                     project alias and the website → Hosting site mapping
package.json                    scripts: dev, build (next build + postbuild), start, lint
components.json                 shadcn/ui configuration
eslint.config.mjs, tsconfig.json
```

`out/` (the build) and `node_modules/` are created locally and are not part of the source.

:::note Separate Firebase config
The website has its **own** `firebase.json` and `.firebaserc` inside `booqora_website/`. Run its Firebase commands from that folder, not from `booqora_platform/`.
:::

## Where to change common things

| To change… | Edit |
|---|---|
| Brand colours, gradients, radius | `src/app/globals.css` (`@theme inline` and `:root`) |
| Fonts | `src/app/layout.tsx` (`Plus_Jakarta_Sans`, `Inter`) and `--font-*` in `globals.css` |
| Logo | `public/logo-mark.png` and the `Logo` component in `src/components/ui-kit.tsx` |
| Favicon / Apple icon | `src/app/icon.png`, `src/app/apple-icon.png` |
| Site URL, support e-mail, platform URL | `src/lib/site.ts` |
| Default title, description, keywords, Open Graph | `metadata` in `src/app/layout.tsx` |
| Feature, industry, plan, integration, FAQ or blog text | `src/content/*.ts` ([Editing Content](doc:web/content)) |
| Header menu items | `src/components/site-header.tsx` |
| Footer columns and links | `SiteFooter` in `src/components/sections.tsx` |
| Home page sections | `src/app/page.tsx` |
| Mobile app page screens and FAQs | `src/app/mobile-app/page.tsx` |
| Contact form topics | `topics` in `src/components/contact-form.tsx` |
| Screenshots | `public/shots/*.webp` |
| Sitemap priorities | `priority()` in `scripts/postbuild-seo.mjs` |
| Cache and security headers | `booqora_website/firebase.json` |

**Next:** [Editing Content →](doc:web/content)
