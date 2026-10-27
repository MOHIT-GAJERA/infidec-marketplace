---
title: Configuration
description: What the website takes from the Admin Panel, what is fixed in code, and how to rebrand colours, logo, texts and contact details.
---

Most of what a visitor sees — categories, ads, feature sections, plans, gateways, blog, jobs, CMS pages — is data you manage in the Admin Panel. The look (colours, logo, banners, footer texts) is in the website code and needs a new build and deploy.

## Managed in the Admin Panel (no deployment needed)

| Website element | Admin Panel |
|---|---|
| Categories in the header, **Popular Categories** row, search filter, post-ad list | **Ads Listing → Categories** (active categories, root categories only in the header) |
| Extra fields on **Post an Ad** and the **Specifications** box | **Ads Listing → Custom Fields** |
| Ad approval before going live, ad expiry days, max images per ad, nearby default radius, free listing / package required | **Settings → General → Advertisement Settings** |
| Feature sections on the home page (e.g. *Featured Ads*) | **Content Management → Feature Section** (and the *Feature section* switch in **Home Screen**) |
| Subscription plans on **Dashboard → Subscriptions** | **Package Management → Subscription Packages** |
| Featured-ad plans on checkout | **Package Management → Featured Ad Plans** |
| Payment methods on checkout | **Settings → Payment Gateways** |
| Tax added to every checkout | **Settings → General** → *Tax (%)* |
| Countries, states and cities on **Post an Ad** | **Location → Countries / States / Cities** |
| Report reasons in **Report this ad** | **Reports → Report Reasons** |
| Verification result and badge | **Seller Management → Seller Verification** |
| Blog posts and categories | **Forms & Blogs → Blogs / Blog Category** |
| Jobs on `/jobs` | **Ads Listing → Jobs** |
| About, Contact, Privacy, Terms, Refund pages (`/page/about` …) | **Settings → About Us / Contact Us / Privacy Policy / Terms & Conditions / Refund Policy** |
| OTP delivery (test mode, Twilio, MSG91…) | **Settings → OTP Provider Settings** |
| Payment return address (`settings/general.frontend_url`) | Firestore — see the note below |

:::warning Set the payment return address
After a hosted payment, Stripe, Razorpay and PayPal send the buyer back to `<frontend_url>/checkout/result?txn=<id>`. The value is read from the `frontend_url` field of the Firestore document `settings/general` and defaults to `https://classiadshub.web.app`. There is no field for it in the Admin Panel. Open **Firestore → settings → general** in the Firebase console and set `frontend_url` to your website address, e.g. `https://www.yourcompany.com` (no trailing slash).
:::

## Not used by the website yet

These Admin Panel settings exist (and some are used by the Mobile App), but the current website code does not read them:

| Admin setting | Website behaviour |
|---|---|
| **Settings → Web Settings** — header colour, footer colour, footer description, Google Maps key, default map position, social links | Colours, footer text and social links are fixed in code |
| **Content Management → Slider** | The website hero uses two fixed images, `public/banner1.png` and `public/banner2.png` |
| **Home Screen** section switches other than the feature section | Ignored |
| Category icons and images | The website shows an emoji per category slug (`src/components/category-icon.tsx`) |
| **Settings → Seo-Settings** | Not read by the website. See [SEO & Sitemap](doc:web/seo) |
| **Settings → Languages** translations | Website texts are English only |
| **Forms & Blogs → FAQs** | Not shown. The footer **FAQs** link opens `/page/faq`, which needs a CMS page with the key `faq` |

## Brand colours

Colours are CSS variables in `src/app/globals.css`, mapped to Tailwind tokens (`bg-brand`, `text-accent`, …):

```css title="web/src/app/globals.css"
:root {
  --background: #E4E4EE;            /* page background */
  --foreground: #0F0E47;            /* text */
  --card: #ffffff;
  --border: #d4d4de;
  --muted: #505081;                 /* secondary text and borders */
  --brand: #272757;                 /* primary — buttons, links, footer */
  --brand-foreground: #ffffff;
  --accent: #FFBF00;                /* amber — Ad Listing, search button, Featured badge */
  --accent-foreground: #0F0E47;
}
```

Change the values and rebuild. The site is light mode only.

## Font

The Geist font is loaded in `src/app/layout.tsx` with `next/font/google` and exposed as `--font-geist-sans`. Replace `Geist` with any other `next/font/google` font there.

## Logo, banners, badges, favicon

| File | Shown |
|---|---|
| `public/main-logo-webiste.png` | Header logo and the logo on login/register pages (1073 × 278 px) |
| `public/main-logo-webiste-footer.png` | Footer logo (light version for the navy footer) |
| `public/banner1.png`, `public/banner2.png` | Home hero slider (16:7). Add or remove slides in `SLIDES` in `src/components/home/hero.tsx` |
| `public/Google-play-store.png`, `public/app-store.png` | Store badges in the amber app banner (`src/components/home/app-promo.tsx`) |
| `src/app/favicon.ico` | Browser tab icon |

Keep the file names or update the paths in the components.

## Name, tagline and texts

- `APP_NAME` and `APP_TAGLINE` in `src/lib/config.ts` feed the default page title (`ClassiAds_Hub — Buy and Sell Anything in Just One Click`), the title template `%s · ClassiAds_Hub` and the logo alt text.
- Some texts repeat the name directly. Search the `src` folder for `ClassiAds_Hub` and replace it: the dynamic page titles in each `view.tsx` (e.g. `` `${ad.title} · ClassiAds_Hub` ``), the app banner *Experience the Magic of the ClassiAds_Hub App*, the footer paragraph, and the metadata in `search/page.tsx`, `blog/page.tsx` and `jobs/page.tsx`.

## Footer contact details and links

Edit `src/components/layout/footer.tsx`:

- **Get in touch**: replace the e-mail and phone number.
- **Social icons**: each `<SocialIcon>` renders `href="#"`. Add your profile URLs.
- **Quick Links**: the list of `[label, href]` pairs.

Store badge links are `href="#"` in `src/components/home/app-promo.tsx`. Put your Google Play and App Store URLs there.

## Header

`src/components/layout/header.tsx` holds the search bar, the account menu items, the **Ad Listing** button and the flag map for the language selector. The second row shows `categories.slice(0, 7)` — change the number to show more or fewer root categories.

**Next:** [File Structure →](doc:web/file-structure)
