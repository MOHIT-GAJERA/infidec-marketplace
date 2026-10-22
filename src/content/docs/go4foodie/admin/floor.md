---
title: Live Floor
description: The realtime floor plan. See every table's state, seat walk-ins, open the POS, mark tables awaiting payment, close and pay, and set cleaning or out-of-service.
---

**Admin → Floor** (topbar **Floor Plan**, *"Live table status, sessions & occupancy."*) shows every table as a colour-coded card. Hosts and managers use it to seat guests and watch running bills, and to see which tables need clearing. The screen updates itself **live**, so you never have to reload it.

![Floor](/docs/go4foodie/images/admin-floor.jpg "Admin → Floor")

**Permission:** the page needs `manage:tables` (**OWNER** and **MANAGER**). Opening, closing and changing the state of a table also need `operate:floor`, which both roles have.

:::warning Staff can't open the Floor
**STAFF** has `operate:floor` but not `manage:tables`, so the Floor icon is hidden from Staff and opening `/floor` sends them back to the dashboard with *"You do not have permission for that page."* Waiters and cashiers run the floor from the **Restaurant App** (see [Restaurant App](doc:app/restaurant)). Staff can open a table's POS by URL, but **Back to floor** and the redirect after **Close & Pay** both bounce them to the dashboard.
:::

## Live updates (realtime)

The floor stays current without a reload:

- **Firestore listeners.** The page listens to the `tables`, `tableSessions`, `orders` and `payments` collections. When any of them changes (a QR order from the website, a waiter adding items in the Restaurant App, a payment, a colleague closing a table), the page waits 400 ms for related writes to settle and then fetches the fresh floor from the API. Cards, counts, durations and an open table modal all update in place.
- **60-second safety refresh.** The floor is re-fetched every minute even with no change, so it recovers if the browser was offline or the listeners were blocked.
- **30-second clock.** Session durations (`1h 12m`) re-render every 30 seconds.
- **Refresh** button. Forces a re-fetch at any time.

The browser only **reads** through these listeners. `firestore.rules` allows signed-in admin users to listen to `tables`, `tableSessions`, `orders`, `payments`, `reservations` and `inventoryItems`, and denies all writes. Every change goes through the `api` Cloud Function, which checks permissions and writes the audit log.

:::note Nothing to configure
Live updates work as soon as `firestore.rules` is deployed (`firebase deploy --only firestore`). See [Backend deploy](doc:installation/backend-deploy). If the rules are missing, the floor still works and updates every 60 seconds.
:::

## Live stats bar

| Count | Colour | Tables in state |
|---|---|---|
| **Total** | — | All tables |
| **Available** | Green | `AVAILABLE` |
| **Occupied** | Red | `OCCUPIED` |
| **Reserved** | Amber | `RESERVED` |
| **Awaiting Pay** | Brown | `WAITING_PAYMENT` |
| **Cleaning** | Blue | `CLEANING` |
| **Out of Service** | Grey | `OUT_OF_SERVICE` |

## Table states

| State | Label | Typical meaning | Set by |
|---|---|---|---|
| `AVAILABLE` | Available | Free and clean | You (after cleaning) |
| `RESERVED` | Reserved | Held for a booking | You |
| `OCCUPIED` | Occupied | Guests seated, session open | Automatically on **Open & seat** or a QR order |
| `WAITING_PAYMENT` | Waiting Payment | Bill requested | **Awaiting payment** button or **Set state** |
| `CLEANING` | Cleaning | Guests left, table needs clearing | Automatically on **Close & Pay** or **Merge** |
| `OUT_OF_SERVICE` | Out of Service | Broken, blocked or not in use | You |

Tables in **Cleaning** or **Waiting Payment** also show up in [Notifications](doc:admin/notifications) and count towards the bell badge.

## Table cards

Each card shows **Table N**, its name and a state badge. Cards of tables **with an open session** also show:

- *"4 guests · Maria"* (guests · waiter)
- *"1h 12m · 3 orders"* (time since opened · orders on the session)
- the **current bill** in bold (sum of the session's orders)

Tables without a session show *"Seats 4"*. With no tables at all you see *"No tables yet — add tables in Table Management."* Click a card to open its modal.

![Floor table modal](/docs/go4foodie/images/admin-floor-table.jpg "Floor → table modal")

## Table modal

The top of the modal (**Table N**) shows the state badge and *"name · seats N"*, plus two buttons:

- **Open POS** (with the running bill, e.g. *Open POS · $86*) opens [POS](doc:admin/pos) for this table.
- **History** opens the table's session timeline ([Table History](doc:admin/table-analytics#table-history)).

### Table without a session: Open table

| Field | Default | Notes |
|---|---|---|
| **Guests** | `2` | Whole number, at least 1 |
| **Waiter** | — None — | Active employees from [Staff](doc:admin/staff) |
| **Customer name (optional)** | *Walk-in* | Up to 120 characters; shown on the bill and in history |

**Open & seat** opens a session and sets the table to **Occupied**. The audit log records `session.open` (*"2 guests"*). If someone opened the table a moment earlier (a QR order, the Restaurant App), nothing is duplicated and you see the existing session.

### Table with a session: Close & pay

The modal shows **Guests**, **Waiter**, **Duration**, **Orders**, **Customer** and **Current bill**, and a **CLOSE & PAY** box:

- **Payment method**: *Cash, Credit Card, Debit Card, UPI, Wallet, Mixed*
- **Close table · $bill**: closes the session
- **Awaiting payment**: sets the table to **Waiting Payment** (hidden when it already is)

When a session closes, the backend:

1. works out the total as `subtotal − discount + tax + service + tip` (never below 0),
2. subtracts any split / partial payments already taken in the POS,
3. if anything is still due, records a **payment for the remaining amount** with the selected method,
4. sets the session's payment method to that method, or to **Mixed** when more than one method was used, and marks it **Closed / Paid**,
5. sets the table to **Cleaning**,
6. writes `session.close` to the audit log (e.g. *"Mixed · total 128.5"*).

### Set state

Chips for every state other than the current one. Click one to change the table's state. The audit log records `table.state`.

:::warning Available and Out of Service are locked while a session is open
With an open session, the **Available** and **Out of Service** chips are disabled (*"Close the open session first"*), so a table with a running bill can't be freed by mistake. Close the session first. The table then goes to **Cleaning**, and you set **Available** once it is cleared.
:::

## Seat a walk-in and bill the table

:::steps
### Seat the guests
On **Floor**, click a green **Available** table. Enter **Guests**, choose a **Waiter**, optionally type the guest's name, and click **Open & seat**. The card turns red (**Occupied**).

### Take the order
Click **Open POS**, add dishes from the menu and click **Send to kitchen**. The kitchen ticket (KOT) prints. See [POS](doc:admin/pos).

### Present the bill
When the guests ask for the bill, click **Awaiting payment** in the table modal (or print the invoice from the POS). The card shows **Waiting Payment**.

### Take payment and close
Choose the **payment method** and click **Close table · $bill** (or **Close & Pay** in the POS). The remaining amount is recorded, the session closes and the table turns blue (**Cleaning**).

### Free the table
After clearing, open the table and click **Available** under **Set state**.
:::

**Next:** [POS →](doc:admin/pos)
