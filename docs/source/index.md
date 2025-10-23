---
hide:
  - navigation
search:
  exclude: true
---

# Welcome to `custom:button-card`'s documentation.

[![Stable][releases-shield]][releases] [![Beta][releases-dev-shield]][releases-dev] [![HACS Badge][hacs-badge]][hacs-link] ![Project Maintenance][maintenance-shield] <br/> [![Downloads][downloads]][releases] [![GitHub Activity][commits-shield]][commits-list] [![License][license-shield]][licence] [![Discord][discord-shield]][discord] [![Community Forum][forum-shield]][forum]

[commits-shield]: https://img.shields.io/github/commit-activity/y/custom-cards/button-card.svg
[commits-list]: https://github.com/custom-cards/button-card/commits/master
[discord]: https://discord.gg/Qa5fW2R
[discord-shield]: https://img.shields.io/discord/330944238910963714.svg
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg
[forum]: https://community.home-assistant.io/t/lovelace-button-card/65981
[licence]: https://github.com/custom-cards/button-card?tab=MIT-1-ov-file
[license-shield]: https://img.shields.io/github/license/custom-cards/button-card.svg
[maintenance-shield]: https://img.shields.io/maintenance/yes/2025.svg
[releases-shield]: https://img.shields.io/github/release/custom-cards/button-card.svg
[releases]: https://github.com/custom-cards/button-card/releases/latest
[releases-dev-shield]: https://img.shields.io/github/package-json/v/custom-cards/button-card/dev?label=release%40dev
[releases-dev]: https://github.com/custom-cards/button-card/releases
[hacs-badge]: https://img.shields.io/badge/HACS-Default-41BDF5.svg
[downloads]: https://img.shields.io/github/downloads/custom-cards/button-card/total
[hacs-link]: https://hacs.xyz/

![all](images/all.gif)

button-card is a highly customizable button for your lovelace interfaces.

## Some features

- works with any entity
- 6 available actions on **tap** and/or **hold** and/or **double click**: `none`, `toggle`, `more-info`, `navigate`, `url`, `assist` and `call-service`
- **icon tap action**: Separate action when clicking the icon specifically which takes precedence over main card actions.
- **momentary actions** for the card and/or icon: `press_action` and `release_action` (if used, replaces default actions)
- 3 button-card custom actions: `javascript`, `multi-actions`, `toast`
- state display (optional)
- custom color (optional), or based on light rgb value/temperature
- custom state definition with customizable color, icon and style
- [custom size of the icon, width and height](./examples/sizing.md)
- [aspect ratio support](./advanced/aspect-ratio.md)
- Support for [javascript templates](./advanced/js-templates.md)
- custom icon
- custom css style
- multiple [layout](./advanced/layout.md) support and [custom layout](./advanced/styling.md#advanced-styling-options) support
- units for sensors can be redefined or hidden
- 2 color types

      - `icon` : apply color settings to the icon only
      - `card` : apply color settings to the card only

- automatic font color if `color_type` is set to `card`
- blank card and label card (for organization)
- Native [blink](./examples/animations.md#blink) animation support
- icon rotation animation support
- confirmation popup for sensitive items or [locking mecanism](./config/lock.md)
- [password or PIN protection](./config/actions.md#protect) for actions
- haptic support for the [IOS companion App](https://companion.home-assistant.io/docs/integrations/haptics)
- support for [HACS](https://github.com/hacs/integration)
