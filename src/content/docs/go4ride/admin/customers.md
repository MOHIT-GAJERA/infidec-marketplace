---
title: Customers & Wallet
description: Rider accounts created by phone OTP sign-up, with contact details, wallet balance, loyalty points, ride history and block / unblock.
---

**Admin → People → Customers** (*"Rider accounts, wallets and access"*) lists everyone who signed up in the Customer App. Riders are added **automatically**: after the phone OTP login they fill in their profile, which creates `users/{uid}`, and the `onUserProfileCreated` function gives the account the `customer` role. You can't add riders by hand.

![Customers](/docs/go4ride/images/admin-customers.jpg "Admin → People → Customers")

## Filters and toolbar

- Tabs **All / Active / Blocked**, with counts.
- **Search name, phone or email**.
- **Export CSV**: UID, Name, Phone, Email, Gender, Joined, Wallet, Loyalty points, Blocked.

## Customer table

| Column | Shows |
|---|---|
| **Customer** | Photo or initial, name, and gender (or phone on narrow screens) |
| **Contact** | Phone and e-mail |
| **Joined** | Sign-up date |
| **Wallet** | Balance, e.g. `₹250.00`. A negative balance shows as `−₹25.00` |
| **Points** | Loyalty points, e.g. `0 pts` |
| **Access** | **Active** / **Blocked** pill and a **Block** / **Unblock** button |

Click a row to open the customer.

## Customer profile

The dialog shows four tiles: **Rides** (completed), **Spent** (total of completed fares), **Wallet** and **Points**, then:

- **Profile**: Joined, Gender, Referral code, Cancelled rides, Status.
- **Recent rides**: date, pickup, status and fare of the rider's latest rides.

## Block a customer

Click **Block** and confirm *"Block {name}?"*. The panel sets `isBlocked: true` on the user. Click **Unblock** to undo. Riders can't change this flag themselves (security rules).

:::warning What blocking does in v1.0
Blocking is recorded on the account and counted on the dashboard (*"N blocked"*). The v1.0 Customer App does **not** yet check the flag, so a blocked rider can still open the app and book. To stop someone immediately, also **disable the user** in Firebase Console → Authentication.
:::

## The rider wallet

Every rider has a **Go4Ride Wallet** (`users.walletBalance`). Riders see it under **Wallet** with their transactions.

| Movement | When | Amount |
|---|---|---|
| **Top-up** (`topup`) | The rider taps **Add money** and pays online | Between the **Minimum top-up** and **Maximum top-up** (Settings → App settings, default ₹50–₹10,000) |
| **Trip payment** (`ridePayment`) | A ride paid with **Wallet** is completed | − fare total |
| **Cancellation fee** (`cancellationFee`) | The rider cancels late (see [Commission, Wallet & Settlement](doc:admin/commission-wallet#cancellation-charge)) | − fee |

Every movement is a row in the `transactions` collection, written by Cloud Functions. Clients can't change a wallet balance.

![Customer wallet](/docs/go4ride/images/app-customer-wallet.webp "Customer App: wallet balance and transactions")
![Top-up](/docs/go4ride/images/app-customer-topup.webp "Add money: the amount must be within your limits")

:::note A wallet can go negative
Wallet rides and cancellation fees are debited even if the balance is too low, so a balance can go below zero. **Settings → Business model → Maximum negative wallet balance** (default ₹100) is stored for this purpose, but the v1.0 booking screen doesn't enforce it yet.
:::

:::note No manual wallet adjustment in v1.0
The panel shows the balance but has no "add / deduct money" button. If you must correct a balance, edit `users/{uid}.walletBalance` in the Firestore console **and** add a matching `transactions` row, so the rider's history stays true.
:::

## Loyalty points and referrals

The **Points** column and the **Referral code** come from the rider document (`loyaltyPoints`, `referralCode`). The rules for earning them live in **Settings → App settings** (*Refer & earn*, *Loyalty programme*). See [General & App Settings](doc:admin/settings#app-settings) for what v1.0 does with them.

:::note List size
The page loads up to **200** customer documents, and search and filters work within them. Beyond that, look a rider up in the Firestore console (`users`) by phone or uid.
:::

**Next:** [Drivers & KYC →](doc:admin/drivers)
