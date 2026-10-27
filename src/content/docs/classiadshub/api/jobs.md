---
title: Jobs Endpoints
description: The jobs board (job listings, applications with résumé upload and application statuses) and seller verification (KYC) requests.
---

`functions/src/routes/jobs.ts` holds two features: the **jobs board** and **seller verification**. Both need a signed-in user, except the public job list and job details.

## Job listings

| Method | Path | Auth | Body / query | Returns |
|---|---|---|---|---|
| `GET` | `/jobs` | Public | `q` (title search), `employment_type`, `city_id`, `page`, `per_page` | Open jobs (`status == "open"` and not past `expires_at`), newest first, with `city`, `category` and `employer` |
| `GET` | `/jobs/{slug}` | Optional | — | One job by slug or numeric id. With a token: `has_applied` |
| `GET` | `/my/jobs` | Signed in | `page` | Jobs you posted, in every status |
| `POST` | `/jobs` | Signed in | See the field table | `201` *Job posted.* Default status `open` |
| `PUT` | `/jobs/{id}` | Owner | Any field (`sometimes`) | *Job updated.* |
| `DELETE` | `/jobs/{id}` | Owner | — | *Job deleted.* |

| Field | Rule |
|---|---|
| `title` | Required, max 191 |
| `description` | Required, at least 10 characters |
| `company_name` | Max 191 |
| `category_id`, `city_id` | Integers |
| `employment_type` | `full_time` · `part_time` · `contract` · `internship` · `remote` |
| `salary_min`, `salary_max` | Numbers in major units (stored ×100) |
| `currency_code` | 3 letters |
| `status` | `draft` · `open` · `closed` |
| `expires_at` | A date |

The slug is the title, with six random characters added when it is taken. `salary_display` reads `USD 40,000 - USD 55,000`, `From …` or `Up to …`.

## Applications

| Method | Path | Who | Body | Result |
|---|---|---|---|---|
| `POST` | `/jobs/{id}/apply` | Signed in (not the employer) | Multipart: `cover_letter` (max 5000), file `resume` (or a `resume_path` string) | `201` *Application submitted.* Status `submitted`. The résumé goes to the private `resumes/{userId}/` folder. Adds 1 to `applications_count` and notifies the employer (`job.application`) |
| `GET` | `/my/applications` | Applicant | `page` | Your applications with the job |
| `GET` | `/jobs/{id}/applications` | Employer | `page` | Applications with the applicant (including contact details) |
| `POST` | `/jobs/{id}/applications/{appId}/status` | Employer | `status` (`submitted` · `reviewed` · `shortlisted` · `rejected` · `hired`) | Updates the status and notifies the applicant (`job.application_status`) |

Errors: `422` *You cannot apply to your own job listing.*, *You have already applied to this job.*; `404` *Job not found.* for closed or expired jobs.

The résumé is returned as a **tokenised URL** in `resume_path`. Anyone with that URL can open the file, so the API only gives it to the applicant and the employer.

## Seller verification (KYC)

| Method | Path | Body | Returns |
|---|---|---|---|
| `GET` | `/verification` | — | `{ is_verified, request }`: your verified flag and your latest request |
| `POST` | `/verification` | Multipart, see below | `201` *Verification submitted for review.* Status `pending` |

| Field | Rule |
|---|---|
| `document_type` | Required: `id_card` · `passport` · `driving_license` · `other` |
| `document_number` | Max 100 |
| `front_image` | **Required** image (≤ 5 MB) |
| `back_image`, `selfie_image` | Optional images |
| `field_<id>` | One per active **Verification Field** defined in the panel: a text value or a file. Text is checked against the field's `min_length` / `max_length` |

Files go to the private `kyc/{userId}/` folder and are stored as tokenised URLs. Values of the admin-defined fields are stored in `fields`, keyed by the field name.

`422` *Your account is already verified.* or *You already have a pending verification request.* An admin approves or rejects the request in **Seller Management → Seller Verification**, which sets `users.is_verified` (the verified badge) and notifies the user. See [Admin Endpoints](doc:api/admin#seller-management).

**Next:** [Admin Endpoints →](doc:api/admin)
