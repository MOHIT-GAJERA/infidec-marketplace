---
title: Theme Colours & Languages
description: How the Partner app colours each role, where to change the palette, dark mode, and the built-in English/Hindi translations.
---

## Role colours

The Partner app builds on the shared brand palette in `packages/g4m_core/lib/src/theme/brand.dart` ([Theme Colours & Font](doc:app-customer/change-theme)) and adds a role-specific layer in `lib/core/partner_theme.dart`:

| Role | Brand / highlight | Hero card |
|---|---|---|
| **Seller** | Green (`G4MColors.primary`) | Deep-green gradient |
| **Delivery** | Orange highlights (`G4MColors.accent`) on deep-green buttons | Green-to-orange gradient |

`RoleColors.of(role, brightness)` returns the palette, and widgets read it with `context.rc`. Change the values there to restyle one role without touching the other.

![Seller dashboard](/docs/go4market/images/app-partner-seller-dashboard.webp "Seller role: green hero card")
![Delivery home](/docs/go4market/images/app-partner-delivery-home.webp "Delivery role: orange online ring and highlights")

## Dark mode and preferences

**More → Settings** lets users switch **Dark mode** and **Language**, open Help & FAQ, and log out. Preferences are stored on the device.

![Partner settings](/docs/go4market/images/app-partner-settings.webp "More → Settings: notifications, dark mode, language, help, log out")

## Languages (English and Hindi)

The Partner app uses a lightweight translation helper instead of ARB files:

```dart title="apps/partner_app/lib/core/l10n.dart"
extension TrX on BuildContext {
  String tr(String en, String hi) => AppState.instance.lang == 'hi' ? hi : en;
}

class S {
  String get login => _t('Log in', 'लॉग इन करें');
  …
}
```

Screens call `context.tr('Orders', 'ऑर्डर')` for one-off strings and `S.of(context).login` for shared ones. To edit a text, change both arguments. To add a third language, extend `tr()` with another parameter or a map, and add the option in `lib/features/common/preferences_section.dart`.

:::note Material widgets stay in English
`flutter_localizations` is not used in the Partner app (it pins an older `intl` than `g4m_core` needs), so built-in Material texts such as date pickers remain in English. The locale is fixed to `en_IN`.
:::

**Next:** [Seller Mode →](doc:app-partner/seller-mode)
