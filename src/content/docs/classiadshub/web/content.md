---
title: Blog, Jobs & Pages
description: The blog, the jobs board with Apply Now, the CMS pages and FAQs on the website, and where each is managed in the Admin Panel.
---

## Blog

![Blog](/docs/classiadshub/images/web-blog.jpg "Blog list")
![Blog post](/docs/classiadshub/images/web-blog-post.jpg "Blog post")

### Blog list

`/blog` (footer **Our Blog**) — *Blog · Tips, news and updates from the marketplace.* It calls `GET /blog` and shows a 3-column grid. Each card: cover image (16:9), blog category in navy, title, excerpt and the time since publishing.

Only posts with `status: published` and a `published_at` date that is not in the future are listed, newest first.

:::note First 12 posts only
`GET /blog` returns 12 posts per page by default and the website does not add pagination or category filters. The API supports `?page=`, `?per_page=` (max 50), `?category=<slug>` and `?q=` if you want to add them in `src/app/blog/list.tsx`.
:::

### Blog post

`/blog/<slug>` calls `GET /blog/<slug>` (which adds 1 to `views_count`).

- **← Back to blog**, title, *By <author> · 3d ago*, cover image.
- The body is rendered as HTML when it contains tags (headings, lists, links styled), otherwise as plain text with line breaks.
- The tab title becomes *<Post title> · ClassiAds_Hub*.

Posts are written in **Admin → Forms & Blogs → Blogs** with categories in **Blog Category** ([Blogs & FAQs](doc:admin/blogs)).

## Jobs

![Jobs](/docs/classiadshub/images/web-jobs.jpg "Jobs list")
![Job detail](/docs/classiadshub/images/web-job-detail.jpg "Job detail with Apply Now")

### Job list

`/jobs` — *Jobs · Browse open positions from employers.* It calls `GET /jobs`, which returns jobs with `status: open` that have not passed their `expires_at`. Each row: title, company and city, an employment-type badge (e.g. *full time*), the salary range (`salary_display`, e.g. *USD 6,000 - USD 10,000*) and the first two lines of the description.

### Job detail

`/jobs/<slug>` calls `GET /jobs/<slug>`: **← All jobs**, title, company · city, the type badge, salary, the full description and **Apply Now**. The page adds a schema.org `JobPosting` JSON-LD block ([SEO & Sitemap](doc:web/seo#json-ld)).

### Apply Now

1. A visitor who is not signed in is sent to `/login?next=/jobs/<slug>`.
2. The browser asks *Add a short cover letter (optional):*.
3. `POST /jobs/<id>/apply` with `{ cover_letter }`.
4. The API creates a `job_applications` document (`status: submitted`), adds 1 to the job's `applications_count` and notifies the job owner (*New job application*).
5. The page shows *Application submitted! Track it in your dashboard.*

| API rule | Message |
|---|---|
| Already applied | *You have already applied to this job.* |
| Own job | *You cannot apply to your own job listing.* |
| Job closed or expired | *Job not found.* |

Applications are listed in **Dashboard → Job Applications** ([User Dashboard](doc:web/dashboard#job-applications)).

:::note What the website does not do for jobs
- **Résumé upload**: the API accepts a `resume` file (stored in the private `resumes/` folder), but the website only sends a cover letter.
- **Posting jobs**: users cannot create job listings on the website. Jobs are created in **Admin → Ads Listing → Jobs** ([Job Listings](doc:admin/jobs)). The API has `POST /jobs` and `GET /my/jobs` for an employer UI if you build one.
:::

## CMS pages

![CMS page](/docs/classiadshub/images/web-page.jpg "A CMS page — /page/about")

`/page/<key>` calls `GET /pages/<key>` and shows the page title and body. HTML bodies get styled headings (navy `h2`), lists and links; plain text keeps its line breaks.

| Key | Website link | Edited in |
|---|---|---|
| `about` | Footer **About Us** | **Admin → Settings → About Us** |
| `contact` | Footer **Contact Us** | **Admin → Settings → Contact Us** |
| `privacy` | Footer **Privacy Policy** | **Admin → Settings → Privacy Policy** |
| `terms` | Footer **Terms & Conditions** | **Admin → Settings → Terms & Conditions** |
| `refund` | — (link it yourself) | **Admin → Settings → Refund Policy** |

The admin editor saves to the `pages` collection with `is_published: true`, and the same pages are shown in the Mobile App. See [CMS Pages](doc:admin/pages).

:::tip Google Play needs these URLs
Use `https://www.yourcompany.com/page/privacy` as the privacy-policy URL in the Play Console. For the account-deletion URL you can point to a CMS page that explains **Dashboard → Profile → Delete account**.
:::

The **Contact Us** page is content only. The API has a contact form endpoint (`POST /contact`, saved to **Customers & Roles → User Queries**), but the website does not include a form.

## FAQs

The footer **FAQs** link opens `/page/faq`. That is a CMS page with the key `faq`, and the Admin Panel has no editor section for that key, so on a fresh install it shows *Page not found*.

FAQs managed in **Admin → Forms & Blogs → FAQs** are served by `GET /faqs` (question and answer, sorted), but the website does not call that endpoint. Two options:

- Change the footer link in `src/components/layout/footer.tsx` to a new `/faq` page that lists `GET /faqs`; or
- Create a page document with `key: "faq"` in the `pages` collection (for example by copying an existing page in Firestore).

**Next:** [SEO & Sitemap →](doc:web/seo)
