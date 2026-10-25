---
title: Commission, Wallet & Settlement
description: How the platform takes its commission, how the driver and rider wallets move when a ride is completed, the cancellation charge, the ride OTP switch and the transaction ledger.
---

Go4Ride earns money by taking a **commission** on each completed ride (or by selling [driver subscriptions](doc:admin/subscriptions) instead). The split happens on the server, in the `onRideStatusChanged` Cloud Function, **exactly once per ride**: the ride is stamped with `settledAt` so a retried trigger can't pay twice.

You set the rules in **Admin → Settings → Business rules → Business model** (*"Commission and cancellation charges applied by the settlement function."*), stored in `settings/business`.

![Settings](/docs/go4ride/images/admin-settings.jpg "Admin → Settings → Business model")

## Admin commission

*"Platform cut of each completed ride"*

| Field | Default | Notes |
|---|---|---|
| **Charge commission** | On | Off = drivers keep the whole fare |
| **Commission type** | Percentage | **Percentage** or **Fixed amount** |
| **Commission** | `15` | *"Percent or ₹ per ride, depending on type."* |

Rules applied by settlement:

1. If the driver has an **active paid subscription** with rides left, commission is **0**.
2. Else if **Charge commission** is off, commission is **0**.
3. Else if a **Commission** value is saved here, it is used: `fare × value %`, or the fixed amount. Commission never exceeds the fare.
4. Else the **Commission %** from **Settings → Fare & pricing** (`config/pricing`, default 15 %) is used.

:::tip Click Save once
The form shows the defaults even before anything is stored. Until you **save** the Business model page, settlement falls back to the Fare & pricing commission. Open the page, check the values and click **Save changes**.
:::

## What happens when a ride is completed

| Payment mode | Who holds the money | Driver wallet | Rider wallet | Ride |
|---|---|---|---|---|
| **Cash** | The driver collected the full fare | **− commission** | — | Marked **paid** |
| **Wallet** | The platform | **+ driver earning** | **− fare** | Marked **paid** (gateway `wallet`) |
| **Card / online** | The platform, once the rider pays | **+ driver earning** | — | Marked paid when the gateway confirms ([Payment Gateways](doc:admin/payment-gateways)) |

In every case the driver's lifetime **Earnings** grow by the driver earning, and the ride document gets `commission`, `driverEarning` and `settledAt`.

### Worked example

Fare ₹215, commission 10 %:

| | Amount |
|---|---|
| Commission | ₹21.50 |
| Driver earning | ₹193.50 |
| Cash ride | Driver wallet −₹21.50 (the driver already has ₹215 in cash) |
| Wallet or online ride | Driver wallet +₹193.50 |

Settlement writes ledger rows in `transactions`: a `ridePayment` of +₹193.50 for the driver and a `commission` row of ₹21.50 (and, for a wallet ride, a −₹215 `ridePayment` for the rider).

:::warning Cash drivers go negative
On cash rides the commission is taken from the driver's wallet, so a driver who only takes cash builds up a **negative** balance: what they owe you. Use **Settings → Driver & ride → Minimum driver wallet to accept rides** to stop drivers who owe too much: below it they can't go online (*"Keep at least ₹… in your wallet to go online"*) and get no requests. Drivers top up their balance by taking wallet or online rides; v1.0 has no driver top-up screen.
:::

![Low wallet in the Driver App](/docs/go4ride/images/app-driver-low-wallet.webp "Driver App: below the minimum wallet the driver can't go online")

## Cancellation charge

*"Fee when a rider cancels after the driver is assigned"*

| Field | Default | Notes |
|---|---|---|
| **Charge on cancellation** | On | |
| **Charge type** | Fixed amount | **Fixed amount** or **Percentage of fare** |
| **Cancellation charge** | `25` | ₹25, or 25 % |
| **Free cancellation window (seconds)** | `120` | Counted from when the driver **accepted** |
| **Maximum negative wallet balance** | ₹100 | *"Riders can keep booking until their wallet reaches minus this amount."* Stored; not enforced by the v1.0 booking screen |

A fee is charged only when **all** of these are true: the **rider** cancelled, a driver had accepted, and more than the free window has passed. Then, once per ride:

- the rider's wallet is debited by the fee (it may go negative),
- the driver's wallet and earnings are credited with the fee,
- two `cancellationFee` ledger rows are written and the rider gets a push.

Tested example: fixed ₹25, the rider cancels 5 minutes after acceptance → rider wallet −₹25, driver wallet +₹25. Driver and admin cancellations never charge the rider.

![Customer cancel](/docs/go4ride/images/app-customer-cancel.webp "Customer App: \"A cancellation fee may apply once your driver is on the way.\"")

## Ride OTP

*"Rider shares a code before the trip starts"*

**Require OTP to start a ride** (default on). When on, the Customer App creates a random **4-digit** code with each booking and shows it on the ride screen once the driver arrives (*"Share this OTP with your driver to start the trip"*). The Driver App asks for it before **Start trip**. Off: the driver starts the trip without a code.

## The rider and driver wallets

| Wallet | Field | Goes up | Goes down |
|---|---|---|---|
| Rider | `users.walletBalance` | Online top-up | Wallet rides, cancellation fees |
| Driver | `drivers.walletBalance` | Wallet / online rides (driver earning), cancellation fees received | Commission on cash rides, approved withdrawals, paid subscriptions |

Balances only change in Cloud Functions; security rules stop the apps from writing them. Every movement has a row in `transactions` with a `type`: `topup`, `ridePayment`, `commission`, `cancellationFee`, `payout`, `subscription`.

See also [Customers & Wallet](doc:admin/customers), [Payout Requests](doc:admin/payouts) and [Driver Subscriptions](doc:admin/subscriptions).

**Next:** [Driver Subscriptions →](doc:admin/subscriptions)
