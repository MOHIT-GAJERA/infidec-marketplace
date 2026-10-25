---
title: Banners & Onboarding
description: Promotional banners in the Customer App's home carousel, and the intro slides both apps show on first launch.
---

Two content pages under **Admin → Growth** decide what riders and drivers see first:

| Page | Collection | Where it shows |
|---|---|---|
| **Banners** (*"Home-screen promotions"*) | `banners` | The carousel on the Customer App's home screen |
| **Onboarding** (*"First-launch intro slides"*) | `onboarding` | The intro slides before login, in the Customer App and the Driver App |

## Banners

*"Promotional cards on the customer home screen."*

![Banners](/docs/go4ride/images/admin-banners.jpg "Admin → Growth → Banners")

Tabs **All / Active / Inactive**, **Search banners**, **Export CSV**, **Add banner**. The table shows the image thumbnail and title, **Description**, **Offer text**, **Position** and **Active**.

| Field | Type | Notes |
|---|---|---|
| **Banner name** | Text, required | Shown on the banner over the image |
| **Banner image** | Image, required | Uploaded to `admin_uploads/banners/`. The card is wide and short (about 128 px high on a phone), so use a landscape image around **1200 × 400 px** with the important part in the middle |
| **Description** | Multi-line | Stored with the banner |
| **Offer text** | Text | e.g. *Valid on weekdays only* |
| **Tap action** | Text | *"Route or URL, e.g. /offers"*. See below |
| **Position** | Number | Order in the carousel, lowest first |
| **Active** | Switch | Only active banners are shown |

![Customer home](/docs/go4ride/images/app-customer-home.webp "Customer App home: the banner carousel above the services")

:::note Tap action in v1.0
A tap opens the action only when it is a full web address (`https://…`), in the browser. In-app routes such as `/offers` are stored but don't navigate yet. The v1.0 carousel shows the image and the **Banner name**; *Description* and *Offer text* are saved for future layouts, so put the key message in the image itself.
:::

## Onboarding

*"Intro slides shown on first launch of each app."*

![Onboarding](/docs/go4ride/images/admin-onboarding.jpg "Admin → Growth → Onboarding")

Filter tabs **All / Customer / Driver** (by app). On an empty page click **Load 5 defaults**:

| App | Title | Description |
|---|---|---|
| Customer | Rides in minutes | Book a cab, auto or bike and get picked up fast. |
| Customer | Track every trip | Follow your driver live and share your trip with family. |
| Customer | Pay your way | Cash, wallet, UPI or card — whatever suits you. |
| Driver | Drive with Go4Ride | Go online when you want and earn on your schedule. |
| Driver | Get paid fast | Track earnings and withdraw to your bank anytime. |

| Field | Type | Notes |
|---|---|---|
| **Title** | Text, required | Slide heading |
| **Illustration** | Image | A square or portrait illustration with a transparent background |
| **Description** | Multi-line, required | One or two short sentences |
| **App** | Customer / Driver, required | Which app shows the slide |
| **Display order** | Number | Slide order |
| **Active** | Switch | Hide a slide without deleting it |

![Driver onboarding](/docs/go4ride/images/app-driver-onboarding.webp "Driver App: onboarding slides")

### How the apps use it

- Each app loads the active slides for its audience, in order, and shows them before the login screen.
- The Driver App remembers that onboarding was done on that device and doesn't show it again.
- If you publish **no** slides for an app, it shows its built-in slides (for riders: *Ride your way*, *Fair pricing & bidding*, *Safe & reliable*).

## Tips

- Replace *Go4Ride* in the default slide texts with your own brand.
- Keep three slides per app at most. Riders want to book, not read.

**Next:** [Push Notifications →](doc:admin/push-notifications)
