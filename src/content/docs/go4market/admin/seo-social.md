---
title: SEO, Sitemap & Social Links
description: Default meta tags and share image, per-category and per-blog SEO, the XML sitemap function, robots.txt and the social media icons in the footer.
---

## SEO defaults

**Admin → Settings → SEO** (`/settings/seo`), stored in `settings/platform.seo`:

| Field | Used for |
|---|---|
| Meta title | Default page title and Open Graph title |
| Meta description | Default description |
| Keywords | Default keywords |
| Share image (1200 × 630) | Open Graph / Twitter card image |

Categories have their own meta title, description and keywords (Catalogue → Categories), and blog posts have their own SEO fields. Product pages use the product name, short description and first image.

:::note Flutter Web and crawlers
The website is a Flutter Web single-page app. The static tags in `apps/website/web/index.html` (title, description, Open Graph, JSON-LD for the organisation and website) are what most link previews read, so **edit that file** with your brand before building. The app also updates the title and canonical URL as visitors navigate.
:::

## XML sitemap

The `sitemap` HTTP function generates `/sitemap.xml` from live data. It includes the home page, module pages (`/m/<id>`), categories (`/c/<slug>`), products (`/p/<slug>`, with image tags), stores (`/store/<slug>`), the blog, blog posts, content pages (`/page/<slug>`) and the FAQ.

`firebase.json` rewrites `/sitemap.xml` on the website to this function, and `apps/website/web/robots.txt` points to it:

```text title="apps/website/web/robots.txt"
User-agent: *
Allow: /

Sitemap: https://<your-domain>/sitemap.xml
```

Change `const SITE` in `functions/src/seo/index.ts` to your domain, redeploy the function, then submit the sitemap in **Google Search Console**.

The three panels are excluded from search engines with an `X-Robots-Tag: noindex` header, a robots meta tag and a disallow-all `robots.txt`.

## Social links

**Admin → Settings → Social links** (`/settings/social`) stores `settings/platform.social`: Facebook, Instagram, X, YouTube and LinkedIn URLs. Icons appear in the website footer for every filled-in network.

**Next:** [App Versions & Force Update →](doc:admin/app-versions)
