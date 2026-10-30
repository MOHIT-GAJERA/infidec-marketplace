---
title: Create the Super Admin
description: Create your own Super Admin account with the admin role claim, then add staff with limited permissions from the panel.
---

The Admin panel admits only users whose Firebase Auth **custom claim** is `role: "admin"`. Clients cannot set claims, so the first admin is created with the Admin SDK. After that you create everyone else from the panel.

:::note If you ran the seed script
The seed already created `admin@go4market.com` with the demo password. That is fine for testing. For production, create your own admin as below and then delete the demo admin in **Authentication → Users**.
:::

## Option A: a small Admin SDK script (recommended)

Create this file next to the seed script so it can reuse its `node_modules` and the service-account key from [Seed Demo Data](doc:installation/seed-data#1-create-a-service-account-key):

```js title="tools/seed/make-admin.mjs"
// Usage: node make-admin.mjs you@yourmarket.com "Your Name" "<strong-password>"
import fs from 'node:fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const [email, name = 'Super Admin', password] = process.argv.slice(2);
if (!email) throw new Error('usage: node make-admin.mjs <email> [name] [password]');
const sa = JSON.parse(fs.readFileSync('../../secret/<your-project-id>-firebase-adminsdk.json', 'utf8'));
initializeApp({ credential: cert(sa) });
const auth = getAuth();
const db = getFirestore();

let user;
try {
  user = await auth.getUserByEmail(email);
  if (password) await auth.updateUser(user.uid, { password, displayName: name });
} catch (e) {
  if (e.code !== 'auth/user-not-found' || !password) throw e;
  user = await auth.createUser({ email, password, displayName: name, emailVerified: true });
}
await auth.setCustomUserClaims(user.uid, { ...(user.customClaims ?? {}), role: 'admin' });
await db.doc(`users/${user.uid}`).set(
  { name, email, role: 'admin', status: 'active', updatedAt: FieldValue.serverTimestamp() },
  { merge: true },
);
console.log('Super Admin ready:', user.uid);
```

Run it:

```bash
cd tools/seed
node make-admin.mjs you@yourmarket.com "Your Name" "<strong-password>"
```

`onUserCreated` never overwrites a role that is already set, so the `admin` claim stays. With **no** `staff/{uid}` document, this user is a **Super Admin** and sees every menu.

## Option B: promote an existing user

If the person already has an account (for example they signed up on the website), run the same script with only the e-mail:

```bash
node make-admin.mjs existing@yourmarket.com
```

## Sign in

Open `https://<your-project-id>-admin.web.app/login` and sign in. If you were already signed in, sign out and back in so the browser gets a fresh ID token with the new claim.

:::warning "You do not have access to this panel"
The account has no `admin` claim yet, or the browser holds an old token. Run the script again, then sign out and in. Also check that the user's `status` is not `blocked`.
:::

## Add staff with limited access

Once you are in, create the rest of the team from the panel. Do not repeat the script for them.

1. **Staff → Roles & permissions**: create a role (for example *Order desk*) and tick its permissions. The permission keys are `orders`, `catalog`, `sellers`, `delivery`, `customers`, `finance`, `marketing`, `content`, `reports`, `pos`, `settings`, `staff` and `system`. `*` means everything.
2. **Staff → Staff users → Add**: enter name, e-mail, password and role. This calls `createStaffUser`, which creates the Auth user with the `admin` claim and a `staff/{uid}` document holding the `roleId`.

Staff see only the menus their role allows. See [Staff, Roles & Permissions](doc:admin/staff-roles).

## Change your password

Admin panel → profile menu → **My account** (`/account`): change the password and choose which order e-mails you receive.

**Next:** [Custom Domains & SSL →](doc:installation/domains)
