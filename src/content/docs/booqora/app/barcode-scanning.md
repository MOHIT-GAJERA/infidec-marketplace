---
title: Barcode Scanning
description: How the Booqora Mobile App scans barcodes and QR codes with mobile_scanner, what a code can match, the typed-code fallback and the camera permission on Android and iOS.
---

The scanner (`/scan`) finds a stock item, product or order by pointing the phone camera at a barcode or QR code. It is built on the `mobile_scanner` package and lives in `lib/features/inventory/scan_page.dart`.

Open it from:

- the centre **+** button → **Scan barcode**;
- the scan icon at the top of the **Inventory** tab.

![Scanner](/docs/booqora/images/app-scan.webp "Live camera with the scan window")
![Typed code](/docs/booqora/images/app-scan-typed.webp "Enter a code manually")
![Scan result](/docs/booqora/images/app-scan-result.webp "The matching product opens")

## What a code can match

When a code is read, the app looks it up in this order and opens the first match:

| # | Code | Opens |
|---|---|---|
| 1 | A Booqora link that contains `/inventory/products/<id>` or `/p/<id>` | That product |
| 2 | A Booqora link that contains `/orders/<id>` | That order |
| 3 | A **stock item identifier** (exact, then upper case) | The product, on its **Inventory** tab |
| 4 | A product **SKU** (exact, then upper case) | The product |
| 5 | An **order number**, with or without `#`, `ORD-` or `ORDER` in front | The order |

If nothing matches, a *No match found* sheet shows the code with **Scan again**.

So the easiest way to make your stock scannable is to print labels whose barcode is the **stock item identifier** or the product **SKU** you entered in Booqora. Any symbology that `mobile_scanner` reads works, including Code 128, EAN-13 and QR. Stock items and identifiers are managed in [Stock Items & Barcodes](doc:admin/stock-items).

## Scanner controls

- Only codes inside the square **scan window** are read. The frame turns green and the phone vibrates on a match.
- **Torch** button: turns the flash on and off (disabled if the camera has no torch).
- **Switch camera** button: front or back camera.
- The same code is ignored for 3 seconds after a scan, so holding the phone still does not open the item twice.

## Typed code fallback

Below the camera is **Enter a code manually** ("Stock identifier, product SKU or order number"). Type a code such as `CAME-001` or `1024` and tap **Find**. It runs exactly the same lookup.

Use it when:

- the label is damaged or the light is poor;
- you test on an **emulator**, which usually has no usable camera;
- the user has denied the camera permission.

## Camera permission

### Android

```xml title="android/app/src/main/AndroidManifest.xml"
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

`required="false"` keeps the app installable on devices without a camera. Android asks for the permission the first time the scanner opens.

### iOS

```xml title="ios/Runner/Info.plist"
<key>NSCameraUsageDescription</key>
<string>Booqora uses the camera to scan barcodes and take product photos.</string>
```

iOS shows this sentence in the permission prompt. Apple rejects apps whose usage description is missing or vague, so keep it specific and replace "Booqora" with your app name.

### When the permission is denied

The camera area shows **Camera access is off** with the hint to allow camera access in the device settings. If the camera cannot start for another reason, it shows **Camera unavailable**. In both cases the typed-code field still works.

:::note Camera frames stay on the phone
Barcode detection runs on the device. No images are uploaded, which is why the Play data safety form lists the camera only for on-device scanning ([Google Play Listing & Review](doc:app/play-console)).
:::

## Testing

1. Create a product with SKU `TEST-001` on the web or in the app.
2. Generate a Code 128 or QR code for `TEST-001` with any online barcode generator and show it on your computer screen.
3. Scan it with a real phone. The product should open.
4. On an emulator, type `TEST-001` into **Enter a code manually** instead.

**Next:** [PDF Documents, Share & Print →](doc:app/documents-pdf)
