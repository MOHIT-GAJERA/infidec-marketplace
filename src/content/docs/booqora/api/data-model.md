---
title: Data Model (Firestore)
description: Every Firestore collection Booqora uses, with its key fields, taken from the schema contract in lib/data/schema.dart.
---

The single source of truth for collection names and document shapes is `booqora_platform/lib/data/schema.dart` (class `C`). The Mobile App carries a copy in `booqora_mobile/lib/data/schema.dart`. Read it before you add or rename a field.

## Conventions

- **Tenant data** lives under `workspaces/{wid}/<collection>`. Only four collections are at the top level.
- Every tenant document created through `Db.create` gets `createdAt` and `updatedAt` (server timestamps) and `createdBy` (the user's uid). Updates refresh `updatedAt`.
- `tags` (list of strings) is optional on most documents.
- Orders, customers and documents get a sequential `number` from `workspaces/{wid}.counters`, assigned in a transaction by `Db.nextNumber`.
- **Query rule:** use a single `orderBy('createdAt')` or a single equality `where()` per query and filter the rest in the client. This is why there are no composite indexes.

## Top-level collections

### `users/{uid}`

| Field | Type | Notes |
|---|---|---|
| `name`, `email` | string | E-mail stored lower-case |
| `workspaceId` | string | The workspace this user belongs to |
| `avatarUrl` | string | Optional, uploaded to `users/{uid}/…` in Storage |
| `locale` | string | `en` by default |

### `workspaces/{wid}`

| Field | Type | Notes |
|---|---|---|
| `name`, `slug`, `industry` | string | `slug` is unique and matches `publicStores/{slug}` |
| `ownerId` | string | uid of the owner; cannot be changed by an update |
| `plan` | string | `trial`, `starter`, `pro` or `business` |
| `trialEndsAt` | timestamp | 14 days after creation |
| `counters` | map | `order`, `customer`, `quote`, `contract`, `invoice`, `packing` |
| `onboarding` | map of bool | Setup Guide steps done: `product`, `customer`, `order`, `tax`, `store`, `payments`, `team`, `branding` |
| `settings` | map of maps | Sections: `general`, `pricing`, `taxes`, `rentalPeriod`, `payments`, `emails`, `documents`, `translations`, `security`, `store`, `crossSell`, `fulfillment`, `checkout`, `seo` |

Settings the Cloud Functions read: `general.companyName`, `general.email`, `general.logoUrl`, `general.timezone`, `pricing.currency`, `payments.<provider>.enabled`, `checkout.paymentMode` (`none`, `full`, `down`, `deposit`), `checkout.downPaymentPercent`, `store.brandColor`, `emails.fromName`, `emails.replyTo`, `emails.ccAll`, `emails.footer`, `emails.sysOrderConfirmation`.

### `publicStores/{slug}`

The public directory the Online Store reads by address. Fields: `workspaceId`, `name`, `logoUrl`, `brandColor`, `enabled`, `description`, `currency`, `currencyPosition`, `seoTitle`, `seoDescription`, `showPrices`, `termsRequired`, `termsLabel`, `termsText`, `email`, `phone`.

### `invites/{email}`

Document ID is the invitee's e-mail in lower case. Fields: `workspaceId`, `workspaceName`, `role` (`admin` or `member`), `invitedBy`, `createdAt`.

## Workspace sub-collections

### `members/{uid}`

| Field | Notes |
|---|---|
| `uid`, `name`, `email` | Copied from the user |
| `role` | `owner`, `admin` or `member` |
| `active`, `joinedAt` | – |

### `products`

| Group | Fields |
|---|---|
| Identity | `name`, `sku`, `type` (`rental`, `sale`, `service`), `trackingType` (`trackable`, `bulk`), `status` (`active`, `archived`), `description`, `excerpt`, `imageUrls` |
| Pricing | `pricingMethod` (`flat`, `fixed`, `structure`, `none`), `price`, `pricePer` (`hour`, `day`, `week`, `month`), `pricingStructureId`, `chargeEnabled`, `discountEligible` |
| Tax and deposit | `taxable`, `taxProfileId`, `deposit`, `purchaseCost` |
| Availability | `quantity` (stock count, kept in sync), `allowShortage`, `bufferBefore`, `bufferAfter` (hours) |
| Shipping | `weight`, `weightUnit` |
| Variations | `variationsEnabled`, `properties`, `variations` (list of `id`, `name`, `values`, `price`, `weight`, `sku`) |
| Store and SEO | `showInStore`, `collectionIds`, `crossSellIds`, `slug`, `seoTitle`, `seoDescription`, `tags` |

### `stockItems`

`productId`, `productName`, `variationId`, `identifier` (serial number or barcode), `kind` (`regular`, `temporary`), `availableFrom`, `availableTill`, `purchaseCost`, `purchaseDate`, `locationId`, `status` (`available`, `out`, `downtime`).

### `bundles` and `collections`

| Collection | Fields |
|---|---|
| `bundles` | `name`, `description`, `imageUrl`, `items` (list of `productId`, `name`, `qty`, `discount`), `price` (optional), `collectionIds`, `showInStore`, `tags` |
| `collections` | `name`, `parentId`, `imageUrl`, `showInStore`, `description`, `slug`, `seoTitle`, `seoDescription`, `isSystem` (`all-products` is the system collection) |

### `downtimes`

`productId`, `productName`, `stockItemId` (optional), `quantity`, `reason` (`maintenance`, `repair`, `missing`), `status` (`scheduled`, `started`, `ended`, `cancelled`), `startsAt`, `endsAt`, `locationId`, `note`.

### `customers`

| Group | Fields |
|---|---|
| Identity | `number`, `name`, `email`, `phone`, `type` (`individual`, `company`), `marketing` |
| Defaults | `discountPercent`, `taxProfileId`, `depositMode` (`default`, `none`, `percentage`, `product`, `fixed`), `depositValue` |
| Addresses | `addresses` (list of `label`, `country`, `firstName`, `lastName`, `line1`, `line2`, `city`, `state`, `zip`, `isMain`) |
| Totals | `balanceDue`, `orderCount`, `revenue`, `latestOrderAt` |
| Other | `customFields`, `tags` |

### `orders`

| Group | Fields |
|---|---|
| Status | `number`, `status` (`draft`, `reserved`, `started`, `returned`, `archived`, `canceled`), `paymentStatus` (`payment_due`, `partially_paid`, `paid`, `overpaid`, `process_deposit`), `source` (`manual`, `online`) |
| Customer | `customerId`, `customerName`, `customerEmail`, `customerPhone`, `billingAddress`, `deliveryAddress` |
| Fulfilment | `fulfillment` (`pickup`, `delivery`), `locationId`, `startsAt`, `stopsAt` |
| Lines | `lines`: list of `id`, `kind` (`product`, `bundle`, `custom`), `productId`, `name`, `qty`, `unitPrice`, `periods`, `total`, `taxRate`, `imageUrl` |
| Money | `discountPercent`, `couponCode`, `couponDiscount`, `subtotal`, `discountTotal`, `taxTotal`, `total`, `deposit`, `paid`, `due`, `depositPaid` |
| Other | `itemCount`, `customFields`, `tags`, `note` |

Online Store orders start as `source: online`, `status: draft`, `paid: 0` and no `number`. See [Security Rules](doc:api/security-rules#orders).

### `payments`

`orderId`, `orderNumber`, `amount`, `method` (`cash`, `card`, `bank`, `upi`, `online`), `kind` (`charge`, `refund`, `deposit`), `note`, `paidAt`. Online payments recorded by `verifyPayment` also carry `currency`, `provider`, `reference` (the provider's transaction ID) and `createdBy: system`; their document ID is `{provider}_{transactionId}`, which makes recording idempotent.

### `paymentSessions`

Written only by Cloud Functions. `provider`, `orderId`, `amount`, `currency`, `purpose` (`checkout`, `balance`, `custom`), `kind` (`charge`, `deposit`), `mode` (`test`, `live`), `status` (`pending`, `paid`), `providerRef` (Razorpay order, Stripe session or PayPal order ID), `transactionId`, `createdBy`, `staff`, `paidAt`. See [Payment Flow](doc:api/payment-flow).

### `coupons`

`code` (upper case), `active`, `discountType` (`percentage`, `fixed`), `value`, `startsAt`, `endsAt`, `eligible` (`all`, `products`, `collections`), `productIds`, `collectionIds`, `minimumSpend`, `maxUses`, `onePerCustomer`, `stackWithCustomerDiscount`, `uses`.

### `documents`

`type` (`invoice`, `quote`, `contract`, `packing`), `number`, `orderId`, `orderNumber`, `customerId`, `customerName`, `date`, `dueDate`, `reference`, `lines` (copied from the order), `subtotal`, `taxTotal`, `total`, `deposit`, `paid`, `due`, `paymentStatus`, `finalized`, `sent`, `text`, `footer`, `signature` (`name`, `signedAt`), `tags`.

### Settings collections

| Collection | Fields |
|---|---|
| `taxProfiles` | `name`, `kind` (`product`, `customer`), `rate` (percent), `compound` |
| `pricingStructures` | `name`, `interval` (`hour`, `day`, `week`), `tiers` (list of `upTo`, `price`), `minimum`, `description` |
| `locations` | `name`, `address`, `pickup`, `delivery`, `showInStore`, `isDefault` (`main` is created with the workspace) |
| `customFields` | `scope` (`customer`, `order`, `product`), `name`, `type` (`text`, `number`, `date`, `select`, `checkbox`), `options`, `showOnDocuments`, `inCheckout`, `position` |
| `emailTemplates` | `name`, `kind` (`system`, `manual`), `context` (`orders`, `invoices`, `quotes`, `contracts`, `customers`), `subject`, `body`, `enabled` |
| `apps` | `appId`, `name`, `category`, `installedAt`, `status` (`configured`, `needs_attention`), `config` |

### Logs and content

| Collection | Fields |
|---|---|
| `notes` | `entity`, `entityId`, `text`, `authorName`, `createdAt` |
| `activity` | `entity`, `entityId`, `action` (`created`, `updated`, `deleted`, `paid` …), `label`, `actorName`, `createdAt` |
| `emailLog` | `to`, `subject`, `body`, `context`, `entityId`, `status` (`sent` or `failed` from the functions), `error`, `messageId`, `sentBy`, `createdAt` |
| `assistantChats` | `role` (`user`, `assistant`), `text`, `createdAt` |
| `pages`, `menus`, `blogPosts`, `redirects` | Website-builder content: `title`/`slug`/`body`/`published`; `name`/`items`; `title`/`body`/`status`/`publishAt`; `from`/`to` |

## Status vocabularies

Defined at the bottom of `schema.dart` and shared by every module:

| Class | Values |
|---|---|
| `OrderStatus.all` | `draft`, `reserved`, `started`, `returned`, `archived`, `canceled` |
| `PaymentStatus.all` | `payment_due`, `partially_paid`, `paid`, `overpaid`, `process_deposit` |

**Next:** [Cloud Functions Reference →](doc:api/cloud-functions)
