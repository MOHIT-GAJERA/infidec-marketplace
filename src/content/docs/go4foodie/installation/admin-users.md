---
title: Admin Users
description: Admin logins (OWNER, MANAGER, STAFF) live in the users and credentials collections. The panel can't create them, so you create the first Owner, and any later admin user, with a short Admin SDK script.
---

A fresh Firebase project has no admin users, so nobody can sign in to the panel yet. Unlike restaurant employees, **admin users can't be created, invited or edited from the panel**. The *Team* card in Settings is read-only. You create them once with the script on this page.

## How admin logins are stored

An admin login is **two Firestore documents** with the same id:

| Document | Fields |
|---|---|
| `users/{id}` | `name`, `email`, `emailLower`, `role` (`OWNER` \| `MANAGER` \| `STAFF`), `avatarUrl`, `outletId`, `createdAt`, `updatedAt` |
| `credentials/user_{id}` | `kind: "user"`, `refId: {id}`, `email` (lower case), `passwordHash` (bcrypt) |

At sign-in, `POST /api/admin/auth/login` finds the user by `emailLower`, checks the password against `credentials/user_{id}`, and mints a Firebase custom token (uid `user:{id}`, claims `kind`, `refId`, `role`, `outletId`). **You don't create anything in Firebase Authentication yourself.** The user appears there after the first sign-in.

| Role | Panel | Mobile app |
|---|---|---|
| **OWNER** | Everything | **Owner App** (Owner only) and Restaurant App |
| **MANAGER** | Everything except Settings and Audit Log | Restaurant App |
| **STAFF** | Dashboard, Orders, Reservations, running the floor | Restaurant App |

:::note Admin users vs. staff
**Waiters, cashiers and kitchen staff** don't need an admin user. Add them in [Staff](doc:admin/staff) with a password, and they sign in to the **Restaurant App**. Admin users are for the people who use the web panel.
:::

:::tip Migrating?
If you imported your MySQL database ([Data Migration](doc:installation/data-migration)), your existing users and passwords are already there. Sign in with an existing Owner and skip to [Hosting](doc:installation/hosting).
:::

## Create the first Owner

The script uses the Admin SDK and the same `bcryptjs` hashing as the backend.

:::steps
### Get a service-account key
Firebase console → ⚙ **Project settings → Service accounts → Generate new private key**. Save the JSON **outside** the project folder.

### Add the script
Save this file as `firebase/migration/create-admin-user.mjs`. That folder already depends on `firebase-admin`:

```js title="firebase/migration/create-admin-user.mjs"
// Create an admin login, or reset its password / role.
//   node create-admin-user.mjs --key <sa.json> --email <email> --password <password> [--name "Full Name"] [--role OWNER|MANAGER|STAFF]
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import admin from 'firebase-admin';
import bcrypt from 'bcryptjs';

const arg = (n) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : undefined; };
const key = arg('--key');
const email = (arg('--email') ?? '').trim();
const password = arg('--password') ?? '';
const name = arg('--name');
const roleArg = arg('--role')?.toUpperCase();

if (!key || !email || password.length < 8) {
  console.error('Usage: node create-admin-user.mjs --key <sa.json> --email <email> --password <min 8 chars> [--name "Full Name"] [--role OWNER|MANAGER|STAFF]');
  process.exit(1);
}
if (roleArg && !['OWNER', 'MANAGER', 'STAFF'].includes(roleArg)) throw new Error('--role must be OWNER, MANAGER or STAFF');

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(key, 'utf8'))) });
const db = admin.firestore();
const now = admin.firestore.Timestamp.now();
const emailLower = email.toLowerCase();

const found = await db.collection('users').where('emailLower', '==', emailLower).limit(1).get();
const existing = found.empty ? null : found.docs[0];
const id = existing?.id ?? randomUUID().replace(/-/g, '');
const role = roleArg ?? existing?.get('role') ?? 'OWNER';

await db.doc(`users/${id}`).set(
  existing
    ? { email, emailLower, role, ...(name ? { name } : {}), updatedAt: now }
    : { name: name ?? 'Owner', email, emailLower, role, avatarUrl: null, outletId: null, createdAt: now, updatedAt: now },
  { merge: true },
);
await db.doc(`credentials/user_${id}`).set({ kind: 'user', refId: id, email: emailLower, passwordHash: bcrypt.hashSync(password, 10) });

console.log(`${existing ? 'Updated' : 'Created'} ${role} ${email} (users/${id})`);
```

### Install and run
```bash
cd firebase/migration
npm install
npm install bcryptjs
node create-admin-user.mjs --key /secure/path/yourrestaurant-admin-key.json \
  --email owner@yourrestaurant.com --password 'a-long-unique-password' --name "Restaurant Owner" --role OWNER
```

It prints *"Created OWNER owner@yourrestaurant.com (users/…)"*.

### Sign in
Open your admin site, then sign in with that e-mail and password. You land on the **Overview** with every menu item, including **Settings** and **Audit Log**.
:::

:::danger Clean up
- The password you typed is now in your shell history. Clear it (`history -c` in Bash, or `Clear-History` plus deleting the PSReadLine history file in PowerShell), or change the password in **Settings → Change Password** right after you sign in.
- Delete the service-account key file, and revoke the key in the console (*Service accounts → Manage keys*). It grants full access to the project.
:::

## Add more admin users

Run the same script with a new e-mail and `--role MANAGER` or `--role STAFF`.

## Reset a password or change a role

Owners change their own password in **Settings → Change Password** (current password required, new one at least 6 characters). Managers and staff can't open Settings, so the Owner resets theirs with the script:

```bash
node create-admin-user.mjs --key … --email manager@yourrestaurant.com --password 'new-password'
```

For an existing e-mail, the script **keeps the user's id and role** and only replaces the password hash. Add `--role` to change the role, or `--name` to rename the user.

:::note Changes apply at the next sign-in
The role is copied into the session token at sign-in, and the panel keeps people signed in. A new role or password doesn't affect a session that is already open. To make it apply now, go to **Authentication → Users**, find `user:{id}` and **delete** that account. The person is signed out within the hour and signs in again with the new role or password.
:::

## Remove an admin user

1. **Firestore Database**: delete `users/{id}` and `credentials/user_{id}`. They can no longer sign in.
2. **Authentication → Users**: delete or **disable** `user:{id}`. This ends any session that is still open. The API doesn't re-check the `users` document on every call, so step 2 is what locks out a signed-in browser. The current token can stay valid for up to one hour.

:::warning Mobile app sessions
Mobile logins (Owner App, Restaurant App) use tokens signed with `AUTH_SECRET` that stay valid for 30 days after they were issued. To cut off a removed person's phone straight away, change `AUTH_SECRET` and redeploy. This signs **everyone** out of the app.
:::

**Next:** [Hosting, Domain & SSL →](doc:installation/hosting)
