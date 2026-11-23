---
title: Security Rules
description: How Booqora's Firestore and Storage security rules isolate each workspace, let the Online Store read the catalogue and create booking requests, and protect uploads.
---

Because the Rental Platform, the Online Store and the Mobile App read and write Firestore directly, the security rules **are** the access control. They live in `booqora_platform/firestore.rules` and `storage.rules` and are deployed with:

```bash title="Terminal"
firebase deploy --only firestore:rules,storage --project <your-project-id>
```

## Firestore: the membership model

Every tenant document is under `workspaces/{wid}/…`. Access depends on one document: `workspaces/{wid}/members/{uid}`.

| Helper | Meaning |
|---|---|
| `signedIn()` | `request.auth != null` (an anonymous Online Store session counts) |
| `isMember(wid)` | Signed in and the membership document **exists** |
| `canWrite(wid)` | Like `isMember`, but checked with `existsAfter`, so it is also true inside the batch that creates the workspace and its first member |
| `isAdmin(wid)` | Member with `role` `owner` or `admin` |

Anonymous Online Store visitors are signed in but are never members, so they get only the public access described below.

## Top-level collections

| Path | Read | Write |
|---|---|---|
| `users/{uid}` | Only that user | Create and update by that user; **never deleted** from the client |
| `publicStores/{slug}` | **Everyone** (the Online Store looks up stores by slug) | Create by a member, or by the owner in the workspace-creation batch; update by a member without changing `workspaceId`; delete by an admin |
| `invites/{email}` | Get by the invitee (matching e-mail) or a member; list by members | Create and update by an admin, role must be `admin` or `member`; delete by the invitee or an admin |

## The workspace document

| Operation | Rule |
|---|---|
| Create | Signed in and `ownerId` equals the caller |
| Read | Members |
| Update | Members, and `ownerId` cannot change |
| Delete | Only the owner |

### Members

- **Read:** members of the workspace, or the user reading their own membership.
- **Create:** only for yourself (`uid == memberId`), and only as either the **owner** in the same batch that creates the workspace, or with the **role from a matching invite** (`invites/{your e-mail}` pointing to this workspace).
- **Update:** admins, or the member changing only their own `name` and `updatedAt`.
- **Delete:** admins, but never the owner.

So nobody can add themselves to a workspace without an invite, and nobody can promote themselves.

### Catalogue (products, collections, bundles)

```text
allow read:  if isMember(wid) || resource.data.showInStore == true;
allow write: if canWrite(wid);
```

Items marked **show in store** are readable by anyone; everything else is private to the workspace.

### Orders

Members have full access. Anyone signed in (including an anonymous store visitor) may **create** an order only if all of these hold:

- the workspace's store is not disabled (`settings.store.enabled` is not `false`);
- `source == 'online'`, `status == 'draft'`, `paid == 0` and `number == null`;
- `customerName` is a string of 1–199 characters and `customerEmail` looks like an e-mail address;
- `lines` is a list of 1–100 items and `total` is a number;
- only these fields are present: `source`, `status`, `paymentStatus`, `number`, `customerName`, `customerEmail`, `customerPhone`, `deliveryAddress`, `fulfillment`, `startsAt`, `stopsAt`, `lines`, `subtotal`, `discountTotal`, `taxTotal`, `total`, `deposit`, `paid`, `due`, `itemCount`, `note`, `tags`, `createdAt`, `updatedAt`.

Visitors cannot read, update or delete orders, not even their own. The booking arrives in the platform as a **draft** for staff to review and reserve, and online payments are recorded on it by `verifyPayment` with Admin SDK rights.

### Everything else

```text
match /{sub}/{id} {
  allow read:  if isMember(wid);
  allow write: if canWrite(wid) && !(sub in ['members']);
}
```

Customers, stock items, documents, payments, coupons, settings collections, logs and so on are readable and writable by members only. `paymentSessions` and `emailLog` are written by Cloud Functions, which bypass the rules.

## Storage rules

| Path | Read | Write |
|---|---|---|
| `workspaces/{wid}/**` | **Public**, so the Online Store and e-mails can show product images and logos | Create/update: signed-in, **non-anonymous** user; file under **10 MB**; content type `image/*` or `application/pdf`; custom metadata `uploadedBy` equals the uploader's uid; cannot overwrite a file uploaded by someone else. Delete: only the uploader |
| `users/{uid}/**` | Public | Only that user; images under **5 MB** |
| Anything else | Denied | Denied |

The platform's `Db.upload()` sets `uploadedBy` automatically and stores files as `workspaces/{wid}/{folder}/{timestamp}_{name}`.

:::note Why Storage does not check membership
Storage rules can read Firestore with `firestore.exists()`, but that needs the Storage service agent to be granted Firestore access in your project. Booqora uses the **uploader-uid** model instead so it works with no IAM changes. If you grant that access, you can tighten `workspaces/{wid}/**` writes to `firestore.exists(/databases/(default)/documents/workspaces/$(wid)/members/$(request.auth.uid))`.
:::

## Testing changes

Use the **Rules Playground** in the Firebase console (Firestore → Rules → *Rules Playground*) to simulate a read or write as a given uid, or run the emulator:

```bash title="Terminal"
firebase emulators:start --only firestore,storage
```

Always test both a member and a non-member (or an anonymous user) before deploying a rules change.

**Next:** [Changelog →](doc:changelog)
