---
title: Create the First Admin
description: A new Firebase project has no admin. Create your first login once, give it the super-admin role in Firestore, and create every other staff account from inside the panel.
---

A fresh project has no users, so nobody can open the panel yet. You create the **first super-admin once**. After that, admins and staff are created from inside the panel, and buyers and sellers register on the website or in the app.

Panel access is decided by one field: the **`roles`** array on the user's Firestore document `users/{id}`.

| `roles` contains | Access |
|---|---|
| `super-admin` | Everything. Can't be suspended or removed from the panel |
| `admin` | Everything |
| `staff` + a role name (for example `["staff", "moderator"]`) | The Dashboard plus the modules of that role (`roles` collection) |
| only `customer` / `seller` | *This account does not have admin access.* |

The API checks this field on every request to `/api/v1/admin/*`. There are no Firebase custom claims to set.

## 1. Create the login

Register a normal account through the API. This creates both the Firestore document `users/{id}` and the Firebase Auth user (uid = the numeric id), exactly as the website does:

```bash
curl -X POST https://us-central1-your-project-id.cloudfunctions.net/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Name","email":"admin@yourcompany.com","password":"YOUR_STRONG_PASSWORD","password_confirmation":"YOUR_STRONG_PASSWORD"}'
```

The password needs at least 8 characters. The answer (HTTP 201) contains `data.user.id`, for example `1`, and an `otp` block for e-mail verification. You don't need to verify the e-mail to sign in to the panel.

You can also register on your deployed website (`/register`) once it is online. Either way, **don't** create the user with *Authentication → Users → Add user* in the console: that account has no `users` document with a numeric id.

## 2. Give the account the super-admin role

:::steps
### Open the user document
Firebase console → **Firestore Database** → collection `users` → the document with your id (for example `1`).

### Edit `roles`
The field `roles` is an array with one value, `customer`. Change that value to `super-admin`, so the field reads `["super-admin"]`. Click **Update**.

### Sign in
Open the Admin Panel `/login` and sign in with the e-mail and password from step 1. The panel calls `GET /api/v1/admin/me` and opens the dashboard with every menu item.
:::

![Admin dashboard](/docs/classiadshub/images/admin-dashboard.jpg "The dashboard after the first super-admin sign-in")

:::tip With the Admin SDK instead of the console
If you prefer a script, `functions/` already has `firebase-admin`. Authenticate with `gcloud auth application-default login`, then run this from `functions/` and delete it afterwards:

```js title="functions/make-super-admin.mjs"
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const [email, projectId] = process.argv.slice(2);
initializeApp({ credential: applicationDefault(), projectId });
const snap = await getFirestore().collection("users").where("email", "==", email).limit(1).get();
if (snap.empty) throw new Error(`No users document with email ${email}`);
await snap.docs[0].ref.update({ roles: ["super-admin"], updated_at: new Date() });
console.log(`${email} (id ${snap.docs[0].id}) is now super-admin`);
```

`node make-super-admin.mjs admin@yourcompany.com your-project-id`
:::

## If you imported the sample data

The [Data Migration](doc:installation/data-migration) imports the demo accounts, including a super-admin (user id `1`). Don't leave it as it is:

- Firebase console → **Authentication → Users** → that user → **Reset password**, or change its e-mail and password, **or**
- create your own super-admin as above, then remove the demo account in **Customers & Roles → Staff Management** (sign in with your new account first: an account can't remove itself, and a super-admin can't be removed from the panel; change its `roles` in Firestore first).

## Adding more people

From now on, use the panel:

| Who | Where | How it works |
|---|---|---|
| Staff with limited access | **Customers & Roles → Role** to define the role, then **Staff Management** | `POST /admin/staff` creates the Firestore user and the Firebase Auth login (e-mail + password of at least 8 characters) with `roles: ["staff", "<role name>"]`. See [Roles, Staff & Permissions](doc:admin/roles-permissions) |
| Another full admin | **Staff Management**, role **admin** | Stored as `roles: ["admin"]`. Only an admin or super-admin can create one |
| Buyers and sellers | Register on the website or in the app | Start as `customer`. The `seller` role is added automatically with the first ad |

A second **super-admin** can only be made by editing `roles` in Firestore, as in step 2.

![Staff Management](/docs/classiadshub/images/admin-staff.jpg "Staff Management: logins created by the API with a role")

:::danger Clean up
- If you downloaded a service-account key, delete the file **and** the key in the console (Project settings → Service accounts → Manage keys). It grants full access to the project.
- Anyone can register on the website. Registered accounts are `customer` until someone edits their `roles`, so only people with Firestore console access can promote an account.
:::

**Next:** [Hosting, Domain & SSL →](doc:installation/hosting)
