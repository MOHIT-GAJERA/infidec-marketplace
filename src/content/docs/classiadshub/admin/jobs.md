---
title: Job Listings
description: Moderate the job board, see applicant counts and switch job listings between open, draft and closed or delete them.
---

**Admin → Ads Listing → Jobs** opens **Job Listings** — *Jobs posted by employers on the marketplace*. Job listings are separate from ads. They live in the Firestore collection `job_listings`; applications live in `job_applications`.

![Job listings](/docs/classiadshub/images/admin-jobs.jpg "Admin → Ads Listing → Jobs")

This page uses the **ads** permission (the same as All Ads).

## Where jobs appear

| Place | What it shows |
|---|---|
| Website `/jobs` and app **Jobs** screen | Open jobs, newest first (`GET /api/v1/jobs`; the API also accepts `q`, `employment_type` and `city_id` filters) |
| Website `/jobs/<slug>` and app job detail | Job description, company, salary, type, city and an **Apply** button |
| Website **Dashboard → Job Applications** | The signed-in user's own applications and their status |

A job is public only while its status is `open` **and** its `expires_at` date (if set) has not passed.

## Table

| Column | Shows |
|---|---|
| **Title** | Job title |
| **Company** | Company name |
| **Employer** | The user who posted the job |
| **Type** | *full time, part time, contract, internship, remote* |
| **Salary** | Salary range, e.g. *USD 6,000 - USD 10,000* |
| **City** | City name |
| **Applicants** | Number of applications (`applications_count`) |
| **Status** | *Open*, *Draft* or *Closed* |
| **Posted** | Creation date |
| **Action** | Status drop-down and **Delete** |

The **Status** filter above the table shows *All*, *Open*, *Draft* or *Closed*. The toolbar refreshes the list, chooses columns and exports `jobs.csv`.

## Change the status

Pick a new value in the **Action** drop-down. The change is saved at once (`POST /api/v1/admin/jobs/{id}/status`) and the toast says *"Job updated."*

| Status | Effect |
|---|---|
| `open` | Listed on the website and the app; users can apply |
| `draft` | Hidden; applications are refused |
| `closed` | Hidden; applications are refused |

The employer is not notified of an admin status change.

## Delete a job

The bin icon asks *Delete job "<title>"?* and removes the job document (`DELETE /api/v1/admin/jobs/{id}`). Applications and uploaded résumés are not deleted with it.

## How jobs and applications are created

- Any signed-in user can create a job with `POST /api/v1/jobs` (title, description, company, category, city, employment type, salary range, currency, status, expiry date). New jobs are `open` unless another status is sent.
- Users apply from the job detail page with a cover letter (and, through the API, a résumé file stored in the private `resumes/<user id>/` folder). A user cannot apply twice or apply to their own job.
- The employer gets a **"New job application"** notification. When the employer changes an application status (*submitted, reviewed, shortlisted, rejected, hired*) the applicant gets an **"Application update"** notification.

:::note No job-posting form in the bundled clients
The website and the app list jobs and let users apply, but they have no screen for **posting** a job or managing its applicants. Those actions are available in the API (see [Jobs Endpoints](doc:api/jobs)), so you can add an employer screen or create jobs with a script. The Admin Panel moderates jobs but does not create them.
:::

**Next:** [Sliders & Home Screen →](doc:admin/home-content)
