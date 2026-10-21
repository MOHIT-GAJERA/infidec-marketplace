---
title: Maps & Location
description: QwikMart uses OpenStreetMap — no Google Maps API key or billing is required.
---

Maps are drawn with **`flutter_map` and OpenStreetMap tiles**, so there is **no API key to add** and no maps bill.

| Feature | How |
|---|---|
| Detect zone | GPS position (`geolocator`) → `detectZone` function → zone + serving store |
| Choose city manually | Location screen → pick a zone from the list |
| Address pin | Map picker when adding an address |
| Reverse geocoding (address text from the pin) | `geocoding` package (Android/iOS system geocoder) |
| Live tracking | Rider position from the order, updated every few seconds |

## Permissions

The app asks for location **while in use** only (no background location). The Android permissions `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION` and the iOS `NSLocationWhenInUseUsageDescription` text are already set — edit the iOS text in `ios/Runner/Info.plist` to match your brand.

## Tile usage policy

The public OpenStreetMap tile server is free for moderate use and requires a correct user agent (`userAgentPackageName` = your package name) and attribution (shown on the map). For high traffic use a tile provider (MapTiler, Stadia Maps, Thunderforest) by changing the `urlTemplate` of the `TileLayer` in the map widgets.

**Next:** [Payment Gateway (Razorpay) →](doc:app-customer/payment-gateway)
