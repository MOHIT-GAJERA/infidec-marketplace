---
title: POS (Point of Sale)
description: Table billing. Add dishes, print kitchen tickets, void items, apply discount, tax, service and tip, split payments, merge tables, print the invoice and Close & Pay.
---

The **POS** (topbar **Point of Sale**, *"Table billing, order entry & checkout."*) is the billing screen for one table. Open it from the [Floor](doc:admin/floor) (**Open POS** in a table's modal). The address is `/pos/<tableId>`.

![POS](/docs/go4foodie/images/admin-pos.jpg "Admin → Floor → Open POS")

**Permission:** `manage:orders`. Opening and closing a table also need `operate:floor`. OWNER and MANAGER have both. STAFF has both too, but can't reach the POS from the Floor because the Floor needs `manage:tables`. See the warning on [Floor](doc:admin/floor). On the floor, staff use the [Restaurant App](doc:app/restaurant), the staff POS in the mobile app.

Every action saves to the server and redraws the bill from the server's answer. Buttons are disabled while a request is running. If something fails, an error toast appears and the bill reloads.

## Table without a session: Open Table N

If the table has no open session, the POS shows **Open Table N**, *"Seat guests to start a session."*:

| Field | Default |
|---|---|
| **Guests** | `2` |
| **Waiter** | — None — (or an active employee) |
| **Customer (optional)** | *Walk-in* |

Click **Open & seat** (**Opening…** while saving). The table becomes **Occupied** and the full POS appears.

## Screen layout (open session)

The header reads **← Back to floor** and *"Table 5 · Window · 4 guests · Maria"*.

| Panel | Purpose |
|---|---|
| **Menu picker** (left) | **Search dishes…**, category chips (**All** + categories of available dishes), tiles with name, price and *"In cart: n"* |
| **New items** | The cart of dishes not yet sent to the kitchen (only shown when not empty) |
| **Merge table** | Pull another open table's bill into this one (only shown when other tables have open sessions) |
| **Bill** | Everything already ordered, adjustments, split payments, invoice and **Close & Pay** |

Only dishes switched **Available** in [Menu](doc:admin/menu) appear in the picker.

## Send an order to the kitchen

:::steps
### Pick the dishes
Click menu tiles to add them to **New items**. Use **−** / **+** to change quantities in the cart.

### Send to kitchen
Click **Send to kitchen · $total**. A **KITCHEN ORDER** ticket (KOT) opens in a print window: *"Table 5 · 7:42:10 PM"* and one line per dish, e.g. *"2 × Truffle Risotto"*.

### The order is created
The server creates a **Dine-in**, channel **POS**, status **Pending** order (`ORD-12345`) priced from the current menu, named after the session's customer (or *"Table 5"*). The cart clears and the lines move to the **Bill**. The order also appears in [Orders](doc:admin/orders) and on the Floor card. The audit log records `order.add` (*"2 item(s)"*).
:::

## The bill

The **BILL** card lists every dish ordered on the session (all orders combined) with **−** / qty / **+** and the line total. If nothing has been ordered yet you see *"No items yet — add from the menu."*

| Control | Effect |
|---|---|
| **+** on a line | Orders one more unit immediately (a new 1-item order, `order.add`) |
| **−** on a line | **Voids one unit**, taken from the most recent order that contains the dish. An order left with no items is deleted. Audit `order.void` (*"Removed item"*) |
| **KOT** (printer link) | Prints a kitchen ticket of **all** current bill lines (e.g. to re-send a lost ticket) |

### Discount, tax, service and tip

Below **Subtotal** are four dollar inputs: **Discount**, **Tax**, **Service** and **Tip**. They start from the session's saved values. The **Total** updates as you type:

```text title="Bill total"
Total = max(0, Subtotal − Discount + Tax + Service + Tip)
```

Click **Save adjustments** to store them on the session. Negative values are saved as 0. **Close & Pay** also saves whatever is in the inputs, so you don't need to save separately before closing.

:::note Amounts, not percentages
The four fields are amounts in dollars. For a 10 % service charge on a $120 subtotal, enter `12`. The panel shows whole dollars (e.g. `$12.50` displays as `$13`), but the exact amount with cents is stored and charged.
:::

## Split a bill

Use **Split / partial payment** when guests pay separately or with several methods.

:::steps
### Enter the first share
In the **Amount** box type what the first guest pays, e.g. `40`, choose the method (*Cash, Credit Card, Debit Card, UPI, Wallet, Mixed*) and click **Add**.

### Repeat for the others
Each payment is listed with its method and amount. Under **Total** the bill now shows **Paid** (green) and **Remaining**. Amounts of 0 or less are ignored.

### Close with the rest
The main button now reads **Close & Pay · $remaining**. Pick the method for the last share and click it. The remaining amount is recorded as a final payment with that method.
:::

Each **Add** writes a payment and an audit entry `payment.add` (*"UPI 40"*). If more than one method was used, the session's payment method becomes **Mixed**.

## Merge two tables

When a party moves or two tables join, bring one table's bill into the other.

:::steps
### Open the POS of the table that keeps the bill
For example, open **Table 5**.

### Choose the other table
In **Merge table**, select *Table 6* from **Select a table…** (only tables with an open session are listed).

### Merge
Click **Merge**. Table 6's orders and payments move to Table 5, the guest counts are added together, Table 6's session closes with the note *"Merged into table …"*, and **Table 6 is set to Cleaning**. The audit log records `session.merge`.
:::

## Print the invoice

**Print invoice** opens a 320 px receipt in a print window. It shows **Go4Foodie**, *"Table 5 · 10/22/2026, 8:15:02 PM"*, every line, **Subtotal**, **Discount** (−), **Tax**, **Service** and **Tip** (only the non-zero ones), and **TOTAL**. It uses the values currently in the inputs, even unsaved ones.

:::tip Thermal printers
KOT and invoice use an 80 mm-friendly layout (Courier New, 13 px, dashed separators) and call the print dialog automatically. Set your receipt printer as the default printer, and allow pop-ups for the admin domain.
:::

## Close & Pay

Choose the payment method next to the button and click **Close & Pay**. The server:

1. saves the discount / tax / service / tip from the inputs,
2. records a payment for the **remaining** amount with the selected method (if anything is still due),
3. sets the session's method (single method or **Mixed**) and marks it **Closed / Paid**,
4. sets the table to **Cleaning**,
5. writes `session.close` to the audit log.

You always return to the **Floor** afterwards, even if an error toast was shown, so check the table there.

:::warning After closing
The table now shows **Cleaning**, and it stays that way (and in [Notifications](doc:admin/notifications)) until you set it to **Available** on the Floor. The state is only a signal for your team. Nothing stops a new session or a QR order on a Cleaning table, so clear it promptly. The closed session, with items, adjustments and payments, appears in [Table History](doc:admin/table-analytics#table-history), in [Transactions](doc:admin/transactions) (source **Table**) and in [Table Analytics](doc:admin/table-analytics).
:::

**Next:** [Orders →](doc:admin/orders)
