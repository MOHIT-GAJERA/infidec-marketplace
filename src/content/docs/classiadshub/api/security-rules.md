---
title: Security Rules & Storage
description: How ClassiAds-Hub's Firestore and Storage rules lock the database down to the API, which chat documents clients may read directly, and how public and private upload folders work.
---

ClassiAds-Hub follows one principle: **every write goes through the API**. The `api` Cloud Function uses the Admin SDK, which bypasses the rules, and does its own checks (signed-in user, account status, owner, role and module permission). The rules therefore deny almost everything to clients. They live in two files, deployed with `firebase deploy --only firestore:rules,storage`.

| File | Protects |
|---|---|
| `firebase/firestore.rules` | All Firestore collections |
| `firebase/storage.rules` | The Storage bucket |

## Firestore rules

```text title="firebase/firestore.rules"
rules_version = '2';

// All writes go through the `api` Cloud Function (Admin SDK bypasses these rules).
// Clients may only open realtime listeners on their own chat threads.
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }

    match /conversations/{id} {
      allow read: if signedIn() && request.auth.uid in resource.data.participant_uids;
    }
    match /messages/{id} {
      allow read: if signedIn() && request.auth.uid in resource.data.participant_uids;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

| Collection | Client read | Client write |
|---|---|---|
| `conversations` | Only when the signed-in Firebase uid is in `participant_uids` | Never |
| `messages` | Only when the signed-in Firebase uid is in `participant_uids` | Never |
| Everything else | Never | Never |

`participant_uids` holds the **Firebase uids** of the buyer and the seller: the numeric user id as a string for API-created accounts, or the provider uid (`auth_uid`) for Google / Apple accounts. The API fills it when it creates a conversation and copies it onto every message.

A client query must include the same condition, or Firestore rejects it:

```ts title="Listening to a thread (web)"
query(
  collection(db, "messages"),
  where("conversation_id", "==", conversationId),
  where("participant_uids", "array-contains", auth.currentUser!.uid),
  orderBy("id"),
);
```

The composite index for this query (`conversation_id`, `participant_uids`, `id`) is in `firebase/firestore.indexes.json`.

## Storage rules

```text title="firebase/storage.rules"
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{folder}/{allPaths=**} {
      allow read: if folder in ['ads', 'sliders', 'categories', 'custom-fields', 'avatars', 'blog', 'banners', 'packages', 'brand'];
      allow write: if false;
    }
  }
}
```

Clients never upload directly. They send files to the API (multipart), which checks the type and size and stores them with a random name (`<folder>/<uuid>.<ext>`).

| Folder | Contents | Readable |
|---|---|---|
| `ads/{adId}/` | Ad photos | Public |
| `avatars/{userId}/` | Profile photos | Public |
| `categories/` | Category icons and images | Public |
| `custom-fields/` | Custom field icons | Public |
| `sliders/` | Slider images | Public |
| `banners/` | Banner ad images | Public |
| `packages/` | Package icons | Public |
| `blog/` | Blog cover images | Public |
| `brand/notifications/` | Images uploaded with push notifications | Public |
| `kyc/{userId}/` | Seller verification documents | **Private** |
| `receipts/{userId}/` | Bank-transfer receipts | **Private** |
| `resumes/{userId}/` | Job application résumés | **Private** |

Public files are stored as a **path**, and the API returns `https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<path>?alt=media`. Private files are stored as a **tokenised URL** (`…?alt=media&token=<uuid>`): the rules deny reading them, but the download token lets the holder open that one file. The API hands those URLs only to the owner and to admins (and résumés to the employer). The admin **File Manager** lists private files without a URL.

:::warning Treat tokenised URLs as secrets
Anyone who has a KYC, receipt or résumé URL can open it. Don't paste them into public places. To revoke one, delete the file (or create a new download token in the Firebase console → Storage → file → *Revoke*).
:::

## Where the real checks are

Because the rules deny client access, the security of the data lives in the API:

| Check | Code |
|---|---|
| Valid Firebase ID token, active account | `requireAuth` in `functions/src/lib/auth.ts` |
| Admin area: `super-admin`, `admin` or `staff` | `requireRole(...)` on `/admin` |
| Staff module permissions | `can(module, readBy)` in `functions/src/routes/admin/guard.ts` |
| Ownership (ads, images, jobs, offers, chats, payments, invoices) | Inside each route (`authorizeOwner`, `assertParticipant`, `user_id` comparisons) |
| Input | `validate()` rules on every write |
| Uploads | `assertImage()`: JPEG, PNG, WebP, GIF, SVG, ≤ 5 MB |
| Public profiles | `userRes(…, { contact: false })` hides e-mail and phone |
| Secret settings | `publicSettings()` drops keys listed in `_secret` from `GET /config` |

## Changing the rules safely

- If you add a client-side listener (for example notifications), add a narrow `allow read` for that collection with an ownership condition, and the field it needs (like `participant_uids`).
- Keep `allow write: if false` everywhere: writes through the API keep numeric ids, counters, notifications and caches consistent.
- Test with the Firestore emulator or the **Rules Playground** in the console before deploying. The console keeps every deployed version under **Rules → History**.

**Next:** [Scheduled Jobs →](doc:api/scheduled-jobs)
