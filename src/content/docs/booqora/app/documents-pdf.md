---
title: PDF Documents, Share & Print
description: How the Booqora Mobile App builds invoice, quote, contract and packing slip PDFs on the phone, shares them through the system share sheet and prints them, including the ₹ font handling.
---

The Mobile App creates professional A4 PDFs **on the phone**. No server is involved: the PDF is drawn with the `pdf` package, and the `printing` package shares or prints it. The code is in:

| File | Purpose |
|---|---|
| `lib/features/documents/doc_pdf.dart` | `buildDocumentPdf()`: layout, fonts, logo, totals |
| `lib/features/documents/document_page.dart` | Document screen: Share PDF, Print, Send by email, sign, finalise |
| `lib/features/documents/documents_page.dart` | List of documents by type, filters, CSV export |

## Document types

Documents are created from an order (order editor → **Documents** → *Quote*, *Contract*, *Packing slip* or *Invoice*) and listed under **More → Documents**.

| Type | Contents |
|---|---|
| Invoice | Lines, discounts, tax, total, paid and due, due date |
| Quote | Lines, totals and a signature block for the customer to approve |
| Contract | Lines, totals, terms text and a signature block |
| Packing slip | Items and quantities with a *Packed* mark, no prices |

![Documents](/docs/booqora/images/app-documents.webp "Documents list")
![Invoice](/docs/booqora/images/app-invoice.webp "Invoice on the phone")

## What the PDF contains

- **Header**: workspace logo (downloaded from the logo URL in settings), company name, address, e-mail and phone; document title, number and a *FINALIZED* badge when finalised.
- **Bill to** and the rental period.
- **Lines table** and totals (discount, tax, security deposit; paid and due on invoices), coloured with the workspace **brand colour**.
- The document **text** (terms or notes) when set, and on quotes and contracts a **signature block**. Once signed, it shows the signer's name in a handwriting font with the date.
- **Footer** from the document settings, and *Page X of Y*.

The company details, colour, numbering and footer come from the workspace settings (**Settings → General** and **Settings → Documents**), shared with the web. See [Quotes, Contracts & Invoices](doc:admin/documents).

## Share PDF

![Share sheet](/docs/booqora/images/app-share-pdf.webp "Android share sheet with the PDF")
![Print preview](/docs/booqora/images/app-pdf-preview.webp "Print preview")

**Share PDF** builds the PDF and calls `Printing.sharePdf()` with the file name `<number>.pdf` and the subject "Title number — Company". The system share sheet opens, so the user can send it by WhatsApp, Gmail, Drive or any other app.

## Print

The **Print** button calls `Printing.layoutPdf()`. Android and iOS show their print preview, where the user picks a printer or **Save as PDF**. The PDF is rebuilt for the paper size chosen in the dialog.

## Other document actions

- **Send by email**: opens the e-mail sheet with a template (subject "Invoice {{document.number}} from {{company.name}}") and sends it through the workspace SMTP. The document is then marked *sent*.
- **More actions**: *Finalize*, *Record payment*, *Sign now* (type the full name to sign on the phone), *Request signature* (e-mail to the customer), *Mark as sent / not sent*, *Update from order*, *Print*, *Delete*.
- The documents list can be filtered and exported as CSV.

## The ₹ symbol and other Unicode text

The PDF standard fonts cannot draw ₹, accented names or non-Latin scripts. `doc_pdf.dart` therefore loads **Noto Sans** (regular and bold) and **Dancing Script** for signatures with `PdfGoogleFonts`:

```dart title="lib/features/documents/doc_pdf.dart"
base = await PdfGoogleFonts.notoSansRegular();
bold = await PdfGoogleFonts.notoSansBold();
script = await PdfGoogleFonts.dancingScriptRegular();
```

The fonts are downloaded on first use and cached for the session.

:::warning Offline fallback
If the fonts cannot be downloaded (no internet), the PDF is still created with the built-in font. Amounts then show the ISO currency code instead of the symbol (for example `INR 1,200.00` instead of `₹1,200.00`), and other characters the built-in font cannot draw are removed. Make sure the phone is online the first time it creates a PDF.
:::

To bundle the fonts and avoid the download, put the `.ttf` files in `assets/` and load them with `pw.Font.ttf(await rootBundle.load('assets/fonts/NotoSans-Regular.ttf'))` in `_loadFonts()`.

## Changing the layout

Everything is in `buildDocumentPdf()`:

- Page size: the `format` parameter (A4 by default; print uses the paper size picked in the dialog).
- Font sizes and colours: the `pw.TextStyle` values. `brand` comes from the workspace colour, `muted` and `ink` are fixed greys.
- Section order: the widgets inside the `pw.MultiPage` build list.

Run the app, open a document and tap **Share PDF** to check your changes.

**Next:** [Release Build & Keystore →](doc:app/deployment)
