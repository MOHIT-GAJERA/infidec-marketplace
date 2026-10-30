---
title: Maps & Location
description: OpenStreetMap maps, address search and reverse geocoding with Nominatim, location permissions, and how to switch to another tile or geocoding provider.
---

Go4Market uses **OpenStreetMap** everywhere: no Google Maps API key or billing account is needed.

| Feature | Package / service | Code |
|---|---|---|
| Map display | `flutter_map` + `latlong2`, tiles from `tile.openstreetmap.org` | `lib/screens/location/location_picker_screen.dart`, `lib/screens/orders/order_detail_screen.dart` |
| Current position | `geolocator` | `lib/core/location.dart` |
| Address search and reverse geocoding | OpenStreetMap **Nominatim** | `lib/core/location.dart` |

![Add address](/docs/go4market/images/app-customer-add-address.webp "Add address after pinning the location: label, receiver, phone, house, area, city, pincode, state")

## Customer flow

1. On first use, the app asks for location permission (`ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`) and shows the **Deliver to** picker.
2. The customer searches an address or drags the pin; the app reverse-geocodes it into street, area, city, pincode and state.
3. They save it as **Home**, **Work** or **Other**. Addresses are stored in `users/{uid}/addresses` with `lat` and `lng`.
4. The quote uses those coordinates for **distance, fee and ETA**, and the order map shows the rider live.

## Configure

| Setting | Where |
|---|---|
| Search country | `countrycodes: 'in'` in the Nominatim search in `lib/core/location.dart`. Change or remove it if you sell outside India |
| Tile server | `urlTemplate` in the map widgets (search `lib/` for `tile.openstreetmap.org`) |
| User agent | `userAgentPackageName` in the same widgets; set it to your package name |

:::warning OpenStreetMap usage policies
The public tile and Nominatim servers are free but rate-limited and require a valid user agent ([tile policy](https://operations.osmfoundation.org/policies/tiles/), [Nominatim policy](https://operations.osmfoundation.org/policies/nominatim/)). For a busy marketplace, switch to a commercial OSM provider (MapTiler, Stadia Maps, Thunderforest and others) or your own tile server by changing `urlTemplate`, and to a hosted geocoder by changing the URLs in `location.dart`.
:::

The Admin, Seller and Delivery panels and the Partner app use the same tile URL. Change it there too (search `apps/panel/lib` and `apps/partner_app/lib`).

**Next:** [Shopping Features Tour →](doc:app-customer/shopping-features)
