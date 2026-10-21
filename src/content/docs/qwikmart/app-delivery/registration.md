---
title: Rider Registration & Approval
description: How riders sign up in the app and how you approve them in the Admin Panel.
---

## In the app

**Create Account** opens a step-by-step form:

| Step | Fields |
|---|---|
| Account | Name, e-mail, password, phone, date of birth |
| Area | Country and **zone** (the area the rider wants to work in) |
| Address | Home address |
| Vehicle | Vehicle type (bike, scooter, bicycle…) and number |
| Documents | **Driving licence** and **ID proof** (photo or PDF, uploaded to Firebase Storage) |
| Bank | Account holder, account number, IFSC — for payouts |

On submit the app calls `registerDeliveryBoy` and shows **Pending Approval**. The rider can tap *Check status*; the screen also updates by itself when you decide.

## In the Admin Panel

**Delivery Boys → Pending Approvals** → open → check the documents → **Approve** (confirm the zone) or **Reject** with a remark. See [Delivery Boys](doc:admin/delivery-boys).

After approval the rider's login carries the zone (`zone_id` claim) and they can go online and see that zone's orders.

## Account deletion

Riders can delete their account in **Profile → Delete account** — refused while they have active orders or cash in hand; otherwise the rider record is deactivated and stripped of personal details and documents, and the login deleted. Earnings history is kept for accounting.

**Next:** [Live Location →](doc:app-delivery/location-tracking)
