---
title: Architecture
description: How the ClassiAds-Hub backend is built. One Express app in a Cloud Function serves the whole REST API, writes Firestore with the Admin SDK and runs an hourly housekeeping job.
---

ClassiAds-Hub's backend is a **REST API**. The website, the Admin Panel and the mobile app never write Firestore directly: they call the API, which checks the Firebase ID token, validates the input and reads or writes Firestore, Storage and FCM with the **Admin SDK**. The whole API is one Express app in one Cloud Function (`api`, 2nd gen, Node.js 22, TypeScript, `us-central1`).

## The building blocks

| Service | Used for |
|---|---|
| **Cloud Functions** | `api` (HTTPS, all endpoints) and `housekeeping` (scheduled, every 60 minutes). Both in `functions/src/index.ts` |
| **Cloud Firestore** | All data, one collection per former MySQL table, numeric ids from `counters`. See [Data Model](doc:api/data-model) |
| **Firebase Authentication** | Logins. API-created accounts use the numeric user id as their uid. Google / Apple sign-ins are linked through `auth_uid` |
| **Cloud Storage** | Uploads, written only by the API. Public media folders and private tokenised folders. See [Security Rules & Storage](doc:api/security-rules) |
| **Cloud Messaging** | Pushes to the tokens in `user_devices`, channel `classiads_default` on Android |
| **Secret Manager** | `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, `PAYPAL_CLIENT_SECRET`, bound to both functions |
| **Firebase Hosting** | Two sites. Each rewrites `/api/**` to the `api` function |

## How a request is handled

```text title="functions/src/index.ts"
express()
  cors({ origin: true })            any origin may call the API
  express.json({ limit: "10mb" })   JSON bodies (multipart is parsed per route)
  express.urlencoded()

  /api/v1  and  /v1  →  router v1      (Hosting rewrite path and direct function path)
     /auth   → authRouter              routes/auth.ts
     /admin  → adminRouter             routes/admin/index.ts, crud.ts, blog.ts, guard.ts
     catalogRouter                     routes/catalog.ts
     adsRouter                         routes/ads.ts
     socialRouter                      routes/social.ts
     billingRouter                     routes/billing.ts
     jobsRouter                        routes/jobs.ts
     anything else → 404 "Not found."

  error handler: ApiError → its status · bad JSON → 400 "Malformed JSON body." · other → 500 "Server error."
```

On Firebase Hosting, `https://www.yourcompany.com/api/v1/ads` reaches the function as `/api/v1/ads`. Called directly, `https://us-central1-your-project-id.cloudfunctions.net/api/v1/ads` arrives as `/v1/ads`. Both are mounted, so both work.

## Who may call what

Every route uses one of these guards (`functions/src/lib/auth.ts`, `functions/src/routes/admin/guard.ts`):

| Guard | Meaning |
|---|---|
| *(none)* | Public |
| `optionalAuth` | Public, but a valid `Authorization: Bearer <Firebase ID token>` adds the viewer (for `is_favorited`, `is_following`, `has_applied`, or to see your own unapproved ad). A bad token is ignored |
| `requireAuth` | A valid ID token is required (`401 Unauthenticated.`), and the account `status` must be `active` (`403 Your account is suspended.` / `banned`) |
| `requireRole("admin","super-admin","staff")` | Every `/admin/*` route (`403 You do not have permission to perform this action.`) |
| `can(module, readBy)` | Per admin module. Admins and super-admins pass. Staff pass when one of their roles grants the module. `readBy` lets other modules **GET** the data as a lookup |

The token is verified with `verifyIdToken`. The API then resolves the user document:

1. A numeric uid (`"12"`) is `users/12`.
2. Otherwise a user with `auth_uid == uid`.
3. Otherwise a user with the same **e-mail** or **phone** from the token, which is then linked (`auth_uid`).
4. Otherwise a new `customer` is created from the token (name, e-mail, picture). This is how *Continue with Google / Apple* accounts get a profile on their first `GET /auth/me`.

A numeric uid whose user document was deleted is refused (`401`) and never re-created.

## The code

| File | What it holds |
|---|---|
| `lib/http.ts` | The envelope (`ok`, `fail`, `okPage`), `ApiError`, query helpers, `money()` and `toMinor()` |
| `lib/validate.ts` | Laravel-style rules (`required\|string\|max:191`). See [Conventions & Errors](doc:api/conventions) |
| `lib/store.ts` | Collection names (`C`), numeric id allocation (`nextId`, `insert`), batched `getMany`, a 30-second per-instance cache |
| `lib/settings.ts` | `settings/{group}` documents, `publicSettings()` without secret keys |
| `lib/auth.ts` | Token check, user resolution, roles, `phoneAuthEmail()` |
| `lib/media.ts`, `lib/multipart.ts` | Uploads (`busboy`, 20 MB per file, 20 files), images up to 5 MB, Storage paths and tokenised URLs |
| `lib/resources.ts` | Response shapes (`adRes`, `userRes`, `txnRes`…), 1:1 with the former Laravel API resources |
| `lib/notify.ts` | In-app notifications, FCM multicast, audit log |
| `lib/otp.ts` | OTP issue and verify (hashed codes, expiry, 5 attempts) |
| `lib/payments.ts` | Stripe, Razorpay and PayPal hosted checkout and verification |
| `jobs/scheduled.ts` | Expiry of ads, featured flags and subscriptions |

## Endpoint groups

| Group | Base path | Page |
|---|---|---|
| Register, login, OTP, password, profile, devices, account deletion | `/auth/*` | [Auth Endpoints](doc:api/auth) |
| Health, categories, locations, config, translations, home, content, CMS, blog, SEO, packages, plans, gateways | `/health`, `/categories`, `/locations/*`, `/config`, `/home`… | [Catalogue & Content](doc:api/catalog) |
| Listings, nearby, ad CRUD, images, favourites, saved searches | `/ads/*`, `/my/ads`, `/favorites`, `/saved-searches` | [Ads Endpoints](doc:api/ads) |
| Chat, offers, follows, seller pages, reviews, buyers, reports, notifications | `/conversations`, `/offers`, `/sellers/*`, `/reviews`, `/reports`, `/notifications` | [Chat, Offers & Social](doc:api/social) |
| Subscriptions, featured checkout, payments, invoices, webhook | `/subscriptions/*`, `/ads/{id}/feature/checkout`, `/payments/*`, `/transactions`, `/invoices` | [Billing & Payments](doc:api/billing) |
| Jobs board and seller verification | `/jobs/*`, `/my/jobs`, `/my/applications`, `/verification` | [Jobs Endpoints](doc:api/jobs) |
| Everything in the Admin Panel | `/admin/*` | [Admin Endpoints](doc:api/admin) |

## Performance notes

- **Reference data is cached** for 30 seconds per function instance (categories, locations, currencies, languages, settings, gateways, content). Admin writes clear the cache of the instance that handled them; other instances catch up within 30 seconds.
- **Published ads** (`status == "approved"`, not expired) are loaded once and cached for 10 seconds per instance. Search, filters, sorting, nearby and pagination run in memory on that list. This keeps the API simple and fast for small and medium catalogues; reads and memory grow with the number of live ads.
- The function allows 40 concurrent requests per instance and at most 20 instances. Raise `maxInstances` in `setGlobalOptions` if you expect more traffic.

**Next:** [Conventions & Errors →](doc:api/conventions)
