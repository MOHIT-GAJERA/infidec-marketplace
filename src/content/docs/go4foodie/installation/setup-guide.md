---
title: Setup Guide (First 10 Steps)
description: The ten things to do after installation, in order, so the website, the QR codes and the mobile app have a real restaurant to show and can take orders.
---

A new installation is empty: no menu, no tables, no staff. Work through these ten steps in order. Most of them depend on the step before. Steps 1–6 happen in the admin panel, and steps 7–10 on the backend and the other apps.

:::steps
### Sign in as Owner and secure the account
Sign in with the Owner you created in [Admin Users](doc:installation/admin-users). Open **Settings → Change Password** and set a password that only you know. If the shell history still holds the old one, this step clears the risk.

### Restaurant profile
**Settings → Restaurant Profile**: restaurant name, currency, time zone, address, phone and e-mail. Then **Save changes**. Set the backend's `LOCAL_TZ` to the same time zone ([Environment Configuration](doc:installation/environment-configuration)). → [Settings](doc:admin/settings)

![Settings](/docs/go4foodie/images/admin-settings.jpg "Settings: restaurant profile, change password, team and the roles & permissions matrix")

### Menu
**Menu → Add item**: name, description, price, category (Breakfast, Starters, Main Meals, Fish, Pasta & Salads, Desserts or Drinks), image (upload up to 5 MB or paste a URL) and availability. Turn off categories you don't serve. Only available items in active categories appear on the website and in the app. → [Menu](doc:admin/menu)

### Tables & QR codes
Check that `WEBSITE_URL` is your live website address first, because the QR codes are built from it. Then **Tables → Add table** (number, optional name) for every table, and **download or print the QR codes**. → [Tables](doc:admin/tables)

### Staff
**Staff → Add**: name, e-mail, phone, role (Super Admin, Manager, Cashier, Kitchen Staff or Waiter) and a password (at least 6 characters). Staff use this to sign in to the **Restaurant App**. *Super Admin* and *Manager* get manager rights there. Everyone else gets staff rights. → [Staff](doc:admin/staff)

### Inventory
**Inventory → Add**: stock items with unit, quantity, reorder level, cost per unit and supplier. Items below their reorder level show up in **Notifications**. → [Inventory](doc:admin/inventory)

### Payments
Add your Razorpay, Stripe and/or PayPal keys as secrets and `.env` values, start with **test keys**, and redeploy the function. Until then, orders go through **without payment**. → [Payment Gateways](doc:admin/payment-gateways)

### E-mail
Set the `MAIL_*` values and the `MAIL_PASSWORD` secret, then redeploy. Guests then get order, reservation and gift card e-mails. → [SMTP / Email Settings](doc:admin/smtp-settings) · [Emails](doc:admin/emails)

### Website and mobile app
Deploy the website with `ADMIN_API_URL` pointing at your API host ([Web Portal](doc:web/installation-steps)). Build the mobile app with your `API_BASE_URL` ([Mobile App](doc:app/api-configuration)).

### Test the whole flow
Run the end-to-end test below before you print menus or announce the website.
:::

## Test an order end-to-end

1. On the website, place a **take-away order** for *now* (in test mode, pay with a gateway test card). It appears in **Orders** and in **Notifications**, and the guest gets *Order … confirmed*.
2. Move the order through the stepper to **Completed**. The guest gets the *Thanks for dining with us* e-mail.
3. Scan a table's **QR code** with your phone and order from the table. On **Floor** the table becomes *occupied*, and the order is on its open session.
4. Open that table in the **POS**: add an item, print the KOT, take a part payment in cash, then **Close & Pay** the rest by card. The payment is stored as *Mixed*, and the session moves to **Table History** and **Transactions**.
5. Book a table on the website for tomorrow. Confirm it, then complete it in **Reservations**.
6. Buy a gift card on the website. In **Gift Cards**, set it to *Redeemed*. Check both e-mails.
7. Sign in to the **Restaurant App** with a staff account and to the **Owner App** with your Owner login. The same tables and orders appear there.
8. Open **Audit Log**. Every floor and POS action from the test is listed with your name.

:::tip Clean up the test data
Delete the test customer in **Customers** and the test gift card in **Gift Cards**. The panel can't delete orders or reservations. Keep them as test history, or delete them in the Firestore console before you go live. A menu item that has been ordered can't be deleted afterwards, only marked unavailable.
:::

**Next:** [Localhost Setup →](doc:installation/localhost-setup)
