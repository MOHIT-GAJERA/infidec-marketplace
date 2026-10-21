---
title: Create the Super Admin
description: A new Firebase project has no users. Create your first Super Admin account once — every other user is created from inside the panel.
---

A fresh Firebase project has no users, so nobody can log in to the panel yet. You create the **first Super Admin once**; after that every staff member, store owner and rider is created from inside the panel.

Panel access is controlled by two things that must match:

| Where | Value for a Super Admin |
|---|---|
| Firestore document `users/{uid}` | `type: "admin"`, `status: "active"` |
| Firebase Auth **custom claim** on the user | `{ "role": "admin" }` |

## 1. Create the login

1. Firebase console → **Authentication → Users → Add user**.
2. Enter your e-mail and a **strong password** (16+ characters, use a password manager).
3. Copy the **User UID** shown in the list.

## 2. Give the account the admin role

Run this one-time script from the `firebase/tools` folder (it already depends on `firebase-admin`).

:::steps
### Authenticate with Google Cloud
Either sign in with the Google Cloud CLI:

```bash
gcloud auth application-default login
```

or download a service-account key (Project settings → **Service accounts** → *Generate new private key*), save it **outside** the project folder and point to it:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/secure/path/yourstore-admin-key.json
```

### Create the script
Save as `firebase/tools/make-super-admin.mjs`:

```js title="firebase/tools/make-super-admin.mjs"
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const [email, projectId] = process.argv.slice(2);
if (!email || !projectId) throw new Error("Usage: node make-super-admin.mjs <email> <project-id>");

initializeApp({ credential: applicationDefault(), projectId });
const user = await getAuth().getUserByEmail(email);

await getFirestore().doc(`users/${user.uid}`).set(
  {
    type: "admin",
    name: user.displayName || "Super Admin",
    email,
    phone: null,
    status: "active",
    referral_code: "ADMIN" + user.uid.slice(0, 5).toUpperCase(),
    wallet_balance: 0,
    orders_count: 0,
    total_spent: 0,
    fcm_tokens: [],
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  },
  { merge: true },
);
await getAuth().setCustomUserClaims(user.uid, { role: "admin" });
console.log(`✔ ${email} (${user.uid}) is now Super Admin`);
```

### Run it
```bash
cd firebase/tools
npm install
node make-super-admin.mjs you@yourstore.com yourstore-1a2b3
```
:::

## 3. Log in

Open `/admin/login`, sign in with the e-mail and password from step 1. You land on the dashboard with every menu item available.

:::danger Clean up
- Delete the service-account key file (and the key in the console) if you created one — it grants full access to the project.
- Keep **Demo Mode** off in System Settings → General.
:::

## Adding more people

From now on use the panel:

| Who | Where |
|---|---|
| Staff with limited permissions | **Staff Users** + **Roles** — see [Staff, Roles & Permissions](doc:admin/roles-permissions) |
| Store owners | **Stores → Store Users** — see [Store Panel](doc:admin/store-panel) |
| Delivery boys | They register in the app; you approve them — see [Delivery Boys](doc:admin/delivery-boys) |
| Customers | They sign up in the app or on the website |

The panel sets roles and claims automatically for everyone it creates.

**Next:** [Hosting, Domain & SSL →](doc:installation/hosting)
