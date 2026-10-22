---
title: Reservations
description: Table bookings and private-event requests from your website and app. Confirm, check in, complete, cancel or mark no-show, and edit a booking's date, time and party size.
---

**Admin → Reservations** (*"Table bookings & private events from your guests."*) collects every booking made on the website's **Book a table** page and in the Customer App. There are two kinds:

| Kind | Reference | Comes from | Contains |
|---|---|---|---|
| **Table Booking** | `SV-123456` | Live-availability slot picker (10:00–21:30, 6 bookings per slot) | Date, time, guests, occasion, requests |
| **Private Event** | `EV-123456` | Private-event request form | Date, event type, estimated guests, space, company, details |

![Reservations](/docs/go4foodie/images/admin-reservations.jpg "Admin → Reservations")

**Permission:** `manage:reservations` (**OWNER**, **MANAGER** and **STAFF**).

You can't create a reservation from the admin panel. Guests book on the website (see [Ordering](doc:web/ordering)) or in the app (see [Customer App](doc:app/customer)). Each booking gets a confirmation email: *table reservation confirmed* or *private-event request* (see [Emails](doc:admin/emails)). New requests also appear in [Notifications](doc:admin/notifications) and count towards the bell badge.

## Stats

| Tile | Counts |
|---|---|
| **Total** | All reservations |
| **New Requests** | Status *Pending* (`REQUESTED`) |
| **Confirmed** | *Confirmed* + *Checked In* |
| **Private Events** | Kind *Private Event* |

## Filters

- Status pills: **All, Pending, Confirmed, Checked In, Completed, Cancelled, No-show**
- **Date** picker: shows only bookings on that exact date. **Clear date** removes the filter
- Kind: **All kinds / Table Booking / Private Event**
- **Search ref, name, email…**

## Reservation list

| Column | Shows |
|---|---|
| **Reference** | Icon (cutlery = table, party popper = event) + reference |
| **Guest** | Name and email |
| **Kind** | Table Booking / Private Event |
| **Date** | `Oct 24 · 19:30` (time for table bookings) |
| **Party** | `4 guests`, or the event's guest range (e.g. *25–50*) |
| **Status** | Badge |
| **View** | Eye icon. Clicking the row opens the detail |

If nothing matches you see *"No reservations match your filters."*

## Statuses

| Status (stored) | Label | Colour | Table Booking | Private Event |
|---|---|---|---|---|
| `REQUESTED` | **Pending** | Amber | ✓ | ✓ |
| `CONFIRMED` | **Confirmed** | Blue | ✓ | ✓ |
| `SEATED` | **Checked In** | Orange | ✓ | — |
| `COMPLETED` | **Completed** | Green | ✓ | ✓ |
| `CANCELED` | **Cancelled** | Red | ✓ | ✓ |
| `NO_SHOW` | **No-show** | Grey | ✓ | — |

Flows:

- **Table Booking:** Pending → Confirmed → Checked In → Completed (or Cancelled / No-show at any open step)
- **Private Event:** Pending → Confirmed → Completed (or Cancelled)

## Reservation detail

![Reservation detail](/docs/go4foodie/images/admin-reservation-detail.jpg "Reservations → detail")

The modal (titled with the reference) shows the kind pill and status badge, the **stepper**, and a red note for *"This reservation was cancelled."* / *"This reservation was no-show."*. It also has:

- **Contact**: name, email (click to write a mail) and phone (click to call),
- **Details**: *Date* (`Sat, Oct 24, 2026`), then for tables *Time, Guests, Occasion, Requests*, and for events *Event type, Estimated guests, Space, Company, Details*. Empty fields are hidden,
- **Update status** buttons.

## Confirm and complete a table booking

:::steps
### Confirm the request
Open a **Pending** booking and click **Mark Confirmed**. Call or email the guest using the contact links if you need to.

### Check the guest in
When they arrive, click **Mark Checked In**. Seat them on the [Floor](doc:admin/floor) (**Open & seat**) to start the bill. Reservations and table sessions are separate, so set the table to **Reserved** beforehand if you want to hold it.

### Mark the reservation completed
After the visit, click **Mark Completed**. If the booking has an email, the guest receives the branded **reservation completed** thank-you email. The status changes even if the email fails (the failure is logged).
:::

Other buttons:

- **Mark Cancelled** (red outline): for both kinds, while the reservation is open.
- **Mark No-show** (red outline): table bookings only.

Completed, cancelled and no-show reservations are closed: *"This reservation is Completed — no further actions."* Cancelled and no-show bookings free their slot on the website again.

## Edit a booking

**Edit reservation** (pencil) is shown for **table bookings** that are not completed, cancelled or no-show.

| Field | Input | Rule |
|---|---|---|
| **Date** | Date picker | Format `YYYY-MM-DD` (*"The date field must match the format Y-m-d."*) |
| **Time** | Time picker | e.g. `19:30` |
| **Guests** | Number | Whole number, at least 1 |
| **Occasion** | Text | e.g. *Birthday* |
| **Notes / requests** | Text | e.g. *Window seat, high chair* |

Click **Save changes** (or **Cancel**). Private-event requests can't be edited. Agree changes with the client and note them on your side.

:::warning Edits don't check slot capacity
The website limits table bookings to **6 per time slot** and refuses full slots. When you move a booking in the admin panel, that limit isn't checked, so you can put a 7th booking into a slot. Check the day's list (date filter) before moving a booking.
:::

**Next:** [Dashboard →](doc:admin/dashboard)
