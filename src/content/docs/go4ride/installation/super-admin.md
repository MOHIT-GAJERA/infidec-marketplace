---
title: Create the First Admin
description: A new Firebase project has no admin. Create your first admin login once by giving an Email/Password user the admin custom claim. Every other staff account is then created from inside the panel.
---

A fresh Firebase project has no users, so nobody can use the panel yet. You create the **first admin once**. After that, employees and dispatch users are created from inside the panel, and riders and drivers sign up in the apps.

Panel access is decided by one thing only: the Firebase Auth **custom claim** `role` on the user.

| Claim | Access |
|---|---|
| `{ "role": "admin" }` | Everything, every menu item |
| `{ "role": "staff", "roleId": "…" }` | The modules ticked in `roles/{roleId}` (created by the panel) |
| `{ "role": "dispatcher", "roleId": "…" }` | Same, used for dispatch users |
| anything else, or no claim | The **Admin access required** screen |

There is no admin document to create in Firestore. The Firestore and Storage rules also check this same claim.

## 1. Create the login

Either:

- open your deployed panel, click **First time? Create an admin account**, enter your e-mail and a **strong password** and click **Create account**. You land on *Admin access required*, which is expected. Or
- Firebase console → **Authentication → Users → Add user**, with your e-mail and password.

Copy the account's **User UID** from Authentication → Users.

## 2. Give the account the admin claim

Production has no button for this. On purpose, the `devBootstrapAdmin` function only works in the emulator, and `setUserRole` may only be called by an existing admin. Set the claim once with the Admin SDK:

:::steps
### Authenticate with Google Cloud
Either sign in with the Google Cloud CLI:

```bash
gcloud auth application-default login
```

or download a service-account key (Project settings → **Service accounts** → *Generate new private key*), save it **outside** the project folder and point to it:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/secure/path/your-project-admin-key.json
```

### Create the script
The `functions/` folder already has `firebase-admin` installed. Save this as `functions/make-admin.mjs`:

```js title="functions/make-admin.mjs"
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const [email, projectId] = process.argv.slice(2);
if (!email || !projectId) throw new Error("Usage: node make-admin.mjs <email> <project-id>");

initializeApp({ credential: applicationDefault(), projectId });
const user = await getAuth().getUserByEmail(email);
await getAuth().setCustomUserClaims(user.uid, { role: "admin" });
console.log(`${email} (${user.uid}) is now an admin`);
```

### Run it
```bash
cd functions
node make-admin.mjs admin@yourcompany.com your-project-id
```

### Delete the script
Remove `functions/make-admin.mjs` so it isn't uploaded with your next functions deploy.
:::

## 3. Sign in

Back in the panel, click **Sign out** on the *Admin access required* screen and sign in again (or reload the page). The panel forces a fresh ID token on load, picks up the new claim and opens the dashboard with every menu item.

![Admin dashboard](/docs/go4ride/images/admin-dashboard.jpg "The dashboard after the first admin sign-in")

:::danger Clean up
- If you created a service-account key, delete the file **and** the key in the console (Project settings → Service accounts → Manage keys). It grants full access to the project.
- Anyone can create an Email/Password account from the login screen, but without the claim they only see *Admin access required*. Delete unknown accounts in Authentication → Users.
:::

## On the emulator

Against the local Firebase Emulator Suite you don't need the script: sign up in the panel, then click **Grant admin (dev / emulator only)** on the *Admin access required* screen. That calls `devBootstrapAdmin`, which works only when `FUNCTIONS_EMULATOR` is `true`. See [Localhost & Emulators](doc:installation/localhost-setup).

## Adding more people

From now on, use the panel:

| Who | Where | How it works |
|---|---|---|
| Employees with limited access | **Employees** + **Roles** | The `createStaffUser` function creates the Auth user (e-mail + password, at least 8 characters), sets the claims `role: "staff"` and `roleId`, and writes `staff/{uid}`. See [Employees, Roles & Permissions](doc:admin/roles-permissions) |
| Dispatch users | **Dispatch users** | Same, with `role: "dispatcher"`. See [Dispatch & Dispatch Users](doc:admin/dispatch) |
| Drivers | Register in the Driver App. You approve their KYC | The claim `driver` is set automatically when `drivers/{uid}` is created |
| Customers | Sign up in the Customer App | The claim `customer` is set automatically when `users/{uid}` is created |

A second **full admin** needs the same one-time claim (`role: "admin"`). Run the script again with that person's e-mail, or have an existing admin call the `setUserRole` callable.

![Employees](/docs/go4ride/images/admin-employees.jpg "Employees: staff accounts created by the createStaffUser function")

**Next:** [Hosting, Domain & SSL →](doc:installation/hosting)
