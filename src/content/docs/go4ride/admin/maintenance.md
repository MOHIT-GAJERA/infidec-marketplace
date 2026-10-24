---
title: Maintenance Mode & App Versions
description: Pause the Customer App or the Driver App with a "We'll be right back" screen, and force or suggest an update when a user's app is older than your minimum version.
---

Two settings pages control access to the mobile apps without an app release:

| Page | Document | Purpose |
|---|---|---|
| **Maintenance mode** | `settings/maintenance` | Block an app while you work on the platform |
| **App theme & versions** | `settings/app_theme` | Minimum versions per app and platform, store links, force update |

Both apps listen to these documents live, so a change reaches open apps within seconds.

## Maintenance mode

**Settings → App setup → Maintenance mode** (*"Show a blocking screen in the mobile apps while you work on the platform. It clears the moment you turn it off."*).

A status banner at the top shows **Both apps are running normally** or **Maintenance is ON**, a chip per app (**Customer · Live / Paused**, **Driver · Live / Paused**) and *Last changed 24 Oct 2026, 10:15 PM*.

| Field | Help text | Default |
|---|---|---|
| **Customer app under maintenance** | *"Riders cannot open the app or book a ride."* | Off |
| **Driver app under maintenance** | *"Drivers are taken offline so no new rides are assigned."* | Off |
| **Message shown to users** | | *We are improving Go4Ride. Please check back shortly.* |

Each app can be paused on its own. Click **Save changes**.

![Customer maintenance screen](/docs/go4ride/images/app-customer-maintenance.webp "Customer App: We'll be right back, with your message")

### What users see

| App | Effect |
|---|---|
| **Customer App** | A full screen **We'll be right back** with your message, over whatever the rider had open |
| **Driver App** | An **Under maintenance** screen with your message. A driver who is online is switched **offline** automatically, so `onRideCreated` sends them no requests |

When you switch maintenance off, the screen disappears and the user is back where they were (the app keeps its navigation underneath).

:::warning Rides in progress
Maintenance doesn't cancel rides. A driver in the middle of a trip loses the trip screen until you turn maintenance off. Plan maintenance for quiet hours, or pause only the **Customer App** so no new bookings arrive while drivers finish their trips.
:::

## App theme & versions

**Settings → App setup → App theme & versions** (*"Brand colours, app names and minimum versions. Users below the minimum see an update prompt."*).

### App theme

| Field | Default |
|---|---|
| Customer app name | `Go4Ride` |
| Customer app colour | `#FABE24` |
| Driver app name | `Go4Ride Driver` |
| Driver app colour | `#FABE24` |

:::note Theme is built into the apps
In v1.0 the app name, logo and colours come from each app's build (see [Customer App branding](doc:app-customer/branding) and [Theme Colours](doc:app-customer/change-theme)). These four fields are stored for reference.
:::

### Minimum versions

Android and iOS ship separately, so each has its own minimum:

| Section | Field | Example |
|---|---|---|
| **Customer app versions** | Android minimum version | `1.0.0` (*"Semantic version, e.g. 1.2.0."*) |
| | iOS minimum version | `1.0.0` |
| | Play Store URL | `https://play.google.com/store/apps/details?id=com.go4ride.customer` |
| | App Store URL | `https://apps.apple.com/app/id0000000000` |
| | Force update | *"On: users below the minimum must update before using the app. Off: they see an optional update prompt."* |
| **Driver app versions** | Android minimum version, iOS minimum version, Play Store URL, App Store URL | Same as above, for `com.go4ride.driver` |
| | Force update | *"On: drivers below the minimum must update before going online."* |

### How the check works

On Android and iOS each app compares its installed version (from `pubspec.yaml`, e.g. `1.0.3+7`, the `+build` part is ignored) with the minimum for its platform:

| Installed vs minimum | Force update **off** | Force update **on** |
|---|---|---|
| Same or newer | Nothing | Nothing |
| Older | A dismissible banner, in the Customer App: *"A new version of Go4Ride is available."* with **Update** | A blocking update screen, in the Customer App: **Update required** — *"This version of Go4Ride is no longer supported. Please update to keep riding."* with **Update now** |

The Driver App shows the same two levels with its own wording.

The buttons open the store URL you entered. If the Driver App has no Play Store URL, it opens the Play listing of its own package name. Maintenance mode is checked first: while an app is under maintenance, no update prompt is shown.

:::steps
### Publish the new version
Upload the build to Google Play / the App Store and wait until it is live.

### Raise the minimum
Set the **Android minimum version** (and iOS) to the new version number, e.g. `1.1.0`.

### Decide how strict
Leave **Force update** off for a gentle prompt. Turn it on only for breaking changes, such as a new required field in the booking flow.
:::

:::tip Leave it at 1.0.0 until you need it
With the minimum at `1.0.0` (or `0.0.0`), nobody is prompted. Don't raise the minimum before the new build is available in the stores, or users get an update screen with nothing to update to.
:::

**Back to:** [Admin Panel Overview](doc:admin/overview)
