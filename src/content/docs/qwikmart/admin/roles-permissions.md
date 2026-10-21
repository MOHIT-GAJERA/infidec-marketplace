---
title: Staff, Roles & Permissions
description: Give your team access to only the parts of the panel they need.
---

## Roles

**Admin → Roles → Add**: name the role and tick the permissions. Permissions are grouped by module, each with actions:

| Module | Actions |
|---|---|
| Dashboard, Reports | view |
| Orders | list, view, update, delete |
| Returns, Chat | list, update / reply |
| Products | list, create, update, delete, **approve** |
| Categories, Brands, Attributes, Taxes, Banners | list, create, update, delete |
| Stock | list, update |
| Countries, Zones, Stores | list, create, update, delete |
| Delivery Boys, Customers | list, create, update, delete |
| Wallet, Withdrawals | list, update |
| Promo Codes, Notifications, Email | list, create (update, delete) |
| Blog, FAQs, Pages, Languages | list, create, update, delete |
| Home Builder | list, update |
| Staff, Roles | list, create, update, delete |
| Settings | view, update |

![Roles](/docs/qwikmart/images/admin-roles.jpg "Admin → Roles")

Example roles:

- **Order Manager** — orders (all), returns, chat, delivery boys (list)
- **Catalogue Editor** — products, categories, brands, attributes, stock, banners, home builder
- **Support Agent** — chat (reply), orders (list, view), customers (list)

## Staff users

**Staff Users → Add**: name, e-mail, password and role. The new user logs in at `/admin/login` and sees only the menu items and buttons their role allows. Changing a role takes effect at their next page load.

:::note Secrets stay with the Super Admin
Payment, SMTP, SMS, Firebase and AI settings are readable only by the **Super Admin** role, even for staff with *Settings → update*.
:::

## Store roles

Store owners create their own **Store Roles** and **Store Users** for their staff in the [Store Panel](doc:admin/store-panel); those users can never see other stores' data.
