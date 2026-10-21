---
title: Onboarding Images & Text
description: Change the three introduction slides shown on first launch.
---

New users see three onboarding slides before choosing their location.

## Images

Replace the files (keep names, portrait illustration, WebP or PNG, around 1080 × 1080):

```text
customer_app/assets/images/onboarding/onboarding-1.webp
customer_app/assets/images/onboarding/onboarding-2.webp
customer_app/assets/images/onboarding/onboarding-3.webp
```

## Text

Titles and descriptions are translation keys in `assets/l10n/<language>.json`:

```json title="assets/l10n/en.json"
"onb_title_1": "Groceries in minutes",
"onb_body_1": "Fresh groceries, dairy, snacks and daily essentials from your neighbourhood store — delivered in as little as 8 minutes.",
"onb_title_2": "…",
"onb_body_2": "…",
"onb_title_3": "…",
"onb_body_3": "…"
```

Change the same keys in `hi.json`, `ar.json` and any language you add.

## Slide order, colours, number of slides

`lib/features/onboarding/onboarding_screen.dart` defines the slides — each with emoji accents, title/body keys, background gradient and image:

```dart
_Slide(['🛒', '⚡', '🥛'], 'onb_title_1', 'onb_body_1', AppColors.quickGradient, 'assets/images/onboarding/onboarding-1.webp'),
```

Add or remove `_Slide(...)` entries to change the number of slides.

**Next:** [Configure Home Screen →](doc:app-customer/home-screen)
