# Button Card by [@RomRider](https://github.com/RomRider) <!-- omit in toc -->

[![Stable][releases-shield]][releases] [![Beta][releases-dev-shield]][releases-dev] [![HACS Badge][hacs-badge]][hacs-link] ![Project Maintenance][maintenance-shield] <br/> ![Downloads][downloads] [![GitHub Activity][commits-shield]][commits] [![License][license-shield]](LICENSE.md) [![Discord][discord-shield]][discord] [![Community Forum][forum-shield]][forum]

[commits-shield]: https://img.shields.io/github/commit-activity/y/custom-cards/button-card.svg
[commits]: https://github.com/custom-cards/button-card/commits/master
[discord]: https://discord.gg/Qa5fW2R
[discord-shield]: https://img.shields.io/discord/330944238910963714.svg
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg
[forum]: https://community.home-assistant.io/t/lovelace-button-card/65981
[license-shield]: https://img.shields.io/github/license/custom-cards/button-card.svg
[maintenance-shield]: https://img.shields.io/maintenance/yes/2025.svg
[releases-shield]: https://img.shields.io/github/release/custom-cards/button-card.svg
[releases]: https://github.com/custom-cards/button-card/releases/latest
[releases-dev-shield]: https://img.shields.io/github/package-json/v/custom-cards/button-card/dev?label=release%40dev
[releases-dev]: https://github.com/custom-cards/button-card/releases
[hacs-badge]: https://img.shields.io/badge/HACS-Default-41BDF5.svg
[downloads]: https://img.shields.io/github/downloads/custom-cards/button-card/total
[hacs-link]: https://hacs.xyz/

# Useful links

- [Stable version documentation](https://custom-cards.github.io/button-card/)
- [Dev version documentation](https://custom-cards.github.io/button-card/dev/)
- [HA Discord][discord]
- [button-card forum thread][forum]

# What is `custom:button-card`?

This is a lovelace custom card called button-card for your entities with a **LOT** of configuration options.

![all](examples/all.gif)

- works with any entity
- 6 available actions on **tap** and/or **hold** and/or **double click**: `none`, `toggle`, `more-info`, `navigate`, `url`, `assist` and `call-service`
- **icon tap action**: Separate action when clicking the icon specifically which takes precedence over main card actions.
- **momentary actions** for the card and/or icon: `press_action` and `release_action` (if used, replaces default actions)
- 3 button-card custom actions: `javascript`, `multi-actions`, `toast`
- state display (optional)
- custom color (optional), or based on light rgb value/temperature
- custom state definition with customizable color, icon and style
- custom size of the icon, width and height
- aspect ratio support
- Support for javascript templates
- custom icon
- custom css style
- multiple layout support and custom layout support
- units for sensors can be redefined or hidden
- 2 color types
  - `icon` : apply color settings to the icon only
  - `card` : apply color settings to the card only
- automatic font color if `color_type` is set to `card`
- blank card and label card (for organization)
- Native blink animation support
- icon rotation animation support
- confirmation popup for sensitive items or locking mecanism
- password or PIN protection for actions
- haptic support for the [IOS companion App](https://companion.home-assistant.io/docs/integrations/haptics)
- support for [HACS](https://github.com/hacs/integration)
