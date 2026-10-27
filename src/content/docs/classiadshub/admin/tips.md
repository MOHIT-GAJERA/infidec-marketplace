---
title: Offer Item Tips
description: Maintain the list of short safety and selling tips, with translations, an active switch and drag-and-drop order, served to the clients by the tips API.
---

**Admin → Content Management → Offer Item Tips** opens the **Tips** page. A tip is one short sentence of advice for buyers and sellers, for example *"Meet in a public place"* or *"Never pay before you have seen the item."* Tips live in the Firestore collection `tips`.

![Tips](/docs/classiadshub/images/admin-tips.jpg "Admin → Content Management → Offer Item Tips")

Staff need the **content** permission.

## The list

*\* To change the order, drag the table rows up & down.* The list shows all tips at once (no paging), in display order.

| Column | Shows |
|---|---|
| Drag handle | Drag to reorder; saved at once (*"Order saved."*) |
| **Description** | The tip text (first two lines) |
| **Active** | Toggle: inactive tips are not returned to the clients |
| **Action** | **Edit**, **Delete** |

The search box filters by text. The toolbar refreshes, chooses columns and exports `tips.csv`.

## Add or edit a tip

Click **Add Tip**. A dialog **Create Tip** opens.

| Field | Notes |
|---|---|
| Language tabs | Shown when several languages are active. Translate the description per language |
| **Description** | Required, up to 1000 characters |

Click **Save** (or **Update** when editing). The API is `POST` / `PUT /api/v1/admin/crud/tips`. **Delete** asks *"Delete this tip? This cannot be undone."*

## Where tips are served

Active tips are public at:

```http title="GET /api/v1/tips"
GET /api/v1/tips
```

```json
{
  "success": true,
  "data": [
    { "id": 1, "description": "Meet the seller in a safe, public place.", "sort_order": 0 },
    { "id": 2, "description": "Check the item before you pay.", "sort_order": 1 }
  ],
  "message": "Tips."
}
```

:::note Not shown by the bundled clients yet
The website and the Flutter app in this package do not call `/tips` yet. The data is ready for a "safety tips" box on the ad detail, chat or make-an-offer screens. See [Catalogue & Content Endpoints](doc:api/catalog).
:::

**Next:** [Banner Ads →](doc:admin/banner-ads)
