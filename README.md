# Button Card

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

[![Discord][discord-shield]][discord]
[![Community Forum][forum-shield]][forum]

Lovelace Button card for your entities.

![all](examples/all.gif)

## Features

- confirmation popup for sensitive items (optional)
- works with any toggleable entity
- 3 actions on tap `none`, `toggle`, `more-info` and `call-service`
- state display (optional)
- custom color (optional), or based on light rgb value
- custom state definition with customizable color, icon and style (optional)
- custom size (optional)
- custom icon (optional)
- custom css style (optional)
- 2 color types
  - `icon` : apply color settings to the icon only
  - `card` : apply color settings to the card only
- automatic font color if color_type is set to `card`
- support unit of measurement
- blank card and label card (for organization)
- [blink](#blink) animation support
- support for [custom_updater](https://github.com/custom-components/custom_updater)

## Configuration

### Main Options

| Name         | Type        | Default      | Supported options                                | Description                                                                                                                                                                                                                                                                                                                                   |
| ------------ | ----------- | ------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`       | string      | **Required** | `custom:button-card`                             | Type of the card                                                                                                                                                                                                                                                                                                                              |
| `entity`     | string      | **Required** | `switch.ac`                                      | entity_id                                                                                                                                                                                                                                                                                                                                     |
| `icon`       | string      | `attribute`  | `mdi:air-conditioner` \| `attribute`             | Icon to display in place of the state. Will be overriden by the icon defined in a state (if present). If you use keyword `attribute` it will fetch the icon configured on the entity.                                                                                                                                                         |
| `color_type` | string      | `icon`       | `icon` \| `card` \| `blank-card` \| `label-card` | Color either the background of the card or the icon inside the card. Setting this to `card` enable automatic `font` and `icon` color. This allows the text/icon to be readable even if the background color is bright/dark. Additional color-type options `blank-card` and `label-card` can be used for organisation (see examples).          |
| `color`      | string      | optional     | `auto` \| `rgb(28, 128, 199)`                    | Color of the icon/card. `auto` sets the color based on the color of a light. By default, if the entity state is `off`, the color will be `var(--paper-item-icon-active-color)`, for `on` it will be `var(--paper-item-icon-color)` and for any other state it will be `var(--primary-text-color)`. You can redefine each colors using `state` |
| `size`       | string      | `40%`        | `20px`                                           | Size of the icon. Can be percentage or pixel                                                                                                                                                                                                                                                                                                  |
| `tap_action` | object      | optional     | See [Service](#Action)                           | Define the type of action, if undefined, toggle will be used.                                                                                                                                                                                                                                                                                 |
| `name`       | string      | optional     | `Air conditioner`                                | Define an optional text to show below the icon                                                                                                                                                                                                                                                                                                |
| `show_state` | boolean     | `false`      | `true` \| `false`                                | Show the state on the card. defaults to false if not set                                                                                                                                                                                                                                                                                      |
| `show_icon`  | boolean     | `true`       | `true` \| `false`                                | Wether to show the icon or not. Unless redefined in `icon`, uses the default entity icon from hass                                                                                                                                                                                                                                            |
| `style`      | object list | optional     | `- text-transform: none`                         | Define a list of css attribute and their value to apply to the card                                                                                                                                                                                                                                                                           |
| `state`      | object list | optional     | See [State](#State)                              | State to use for the color, icon and style of the button. Multiple states can be defined                                                                                                                                                                                                                                                      |
| `confirmation` | boolean | `false` | `true` \| `false` | Show a confirmation popup on tap |

### Action

| Name              | Type   | Default  | Supported options                                                | Description                                                                                              |
| ----------------- | ------ | -------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `action`          | string | `toggle` | `more-info`, `toggle`, `call-service`, `none`, `navigate`, `url` | Action to perform                                                                                        |
| `navigation_path` | string | none     | Eg: `/lovelace/0/`                                               | Path to navigate to (e.g. `/lovelace/0/`) when action defined as navigate                                |
| `url`             | string | none     | Eg: `https://www.google.fr`                                      | URL to open on click when action is `url`. The URL will open in a new tab                                |
| `service`         | string | none     | Any service                                                      | Service to call (e.g. `media_player.media_play_pause`) when `action` defined as `call-service`           |
| `service_data`    | object | none     | Any service data                                                 | Service data to include (e.g. `entity_id: media_player.bedroom`) when `action` defined as `call-service` |

### State

| Name       | Type          | Default                                     | Supported options                                                                                                                                                          | Description                                                                                     |
| ---------- | ------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `operator` | string        | `==`                                        | See [Available Operators](#Available-operators)                                                                                                                            | The operator used to compare the current state against the `value`                              |
| `value`    | string/number | **required** (unless operator is `default`) | If your entity is a sensor with numbers, use a number directly, else use a string                                                                                          | The value which will be compared against the current state of the entity                        |
| `icon`     | string        | optional                                    | `mdi:battery`, `attribute`                                                                                                                                                 | The icon to display for this state. If `attribute` is used, the icon of the entity will be used |
| `color`    | string        | `var(--primary-text-color)`                 | Any color, eg: `rgb(28, 128, 199)` or `blue`                                                                                                                               | The color of the icon (if `color_type: icon`) or the background (if `color_type: card`)         |
| `style`    | string        | optional                                    | Any CSS style. If nothing is specified, the main style is used unless undefined. If you want to override the default style of the main part of the config, use `style: []` | Define a list of css attribute and their value to apply to the card                             |

### Available operators

| Operator  | `value` example | Description                                                                                              |
| :-------: | --------------- | -------------------------------------------------------------------------------------------------------- |
|    `<`    | `5`             | Current state is inferior to `value`                                                                     |
|   `<=`    | `4`             | Current state is inferior or equal to `value`                                                            |
|   `==`    | `42` or `'on'`  | **This is the default if no operator is specified.** Current state is equal (`==` javascript) to `value` |
|   `>=`    | `32`            | Current state is superior or equal to `value`                                                            |
|    `>`    | `12`            | Current state is superior to `value`                                                                     |
|   `!=`    | `'normal'`      | Current state is not equal (`!=` javascript) to `value`                                                  |
|  `regex`  | `'^norm.*$'`    | `value` regex applied to current state does match                                                        |
| `default` | N/A             | If nothing matches, this is used                                                                         |

## Installation

### Manual Installation

1. Download the [button-card](https://raw.githubusercontent.com/custom-cards/button-card/master/button-card.js)
2. Place the file in your `config/www` folder
3. Include the card code in your `ui-lovelace-card.yaml`

```yaml
title: Home
resources:
  - url: /local/button-card.js
    type: module
```

4. Write configuration for the card in your `ui-lovelace.yaml`

### Installation and tracking with `custom_updater`

1. Make sure the [custom_updater](https://github.com/custom-components/custom_updater) component is installed and working.
2. Configure Lovelace to load the card.

```yaml
resources:
  - url: /customcards/github/custom-cards/button-card.js?track=true
    type: module
```

3. Run the service `custom_updater.check_all` or click the "CHECK" button if you use the [`tracker-card`](https://github.com/custom-cards/tracker-card).
4. Refresh the website.

## Examples

Show a button for the air conditioner (blue when on, `var(--disabled-text-color)` when off):

![ac](examples/ac.png)

```yaml
- type: "custom:button-card"
  entity: switch.ac
  icon: mdi:air-conditioner
  color: rgb(28, 128, 199)
```

Redefine the color when the state if off to red:

```yaml
- type: "custom:button-card"
  entity: switch.ac
  icon: mdi:air-conditioner
  color: rgb(28, 128, 199)
  state:
    - value: "off"
      color: rgb(255, 0, 0)
```

---

Show an ON/OFF button for the home_lights group:

![no-icon](examples/no_icon.png)

```yaml
- type: "custom:button-card"
  entity: group.home_lights
  show_icon: false
  show_state: true
```

---

Light entity with custom icon and "more info" pop-in:

![sofa](examples/sofa.png)

```yaml
- type: "custom:button-card"
  entity: light.living_room_lights
  icon: mdi:sofa
  color: auto
  tap_action:
    action: more-info
```

---

Light card with card color type, name, and automatic color:

![color](examples/color.gif)

```yaml
- type: "custom:button-card"
  entity: light._
  icon: mdi:home
  color: auto
  color_type: card
  tap_action:
    action: more-info
  name: Home
  style:
    - font-size: 12px
    - font-weight: bold
```

---

Horizontal stack with :

- 2x blank cards
- 1x volume up button with service call
- 1x volume down button with service call
- 2x blank cards

![volume](examples/volume.png)

```yaml
- type: horizontal-stack
  cards:
    - type: "custom:button-card"
      color_type: blank-card
    - type: "custom:button-card"
      color_type: blank-card
    - type: "custom:button-card"
      color_type: card
      color: rgb(223, 255, 97)
      icon: mdi:volume-plus
      tap_action:
        action: service
        service: media_player.volume_up
        service_data:
          entity_id: media_player.livimg_room_speaker
    - type: "custom:button-card"
      color_type: card
      color: rgb(223, 255, 97)
      icon: mdi:volume-minus
      tap_action:
        action: service
        service: media_player.volume_down
        service_data:
          entity_id: media_player.livimg_room_speaker
    - type: "custom:button-card"
      color_type: blank-card
    - type: "custom:button-card"
      color_type: blank-card
```

---

Vertical Stack with :

- 1x label card
- Horizontal Stack with :
  - 1x Scene 1 Button
  - 1x Scene 2 Button
  - 1x Scene 3 Button
  - 1x Scene 4 Button
  - 1x Scene Off Button

![scenes](examples/scenes.png)

```yaml
- type: vertical-stack
  cards:
    - type: "custom:button-card"
      color_type: label-card
      color: rgb(44, 109, 214)
      name: Kitchen
    - type: horizontal-stack
      cards:
        - type: "custom:button-card"
          entity: switch.kitchen_scene_1
          color_type: card
          color: rgb(66, 134, 244)
          icon: mdi:numeric-1-box-outline
        - type: "custom:button-card"
          entity: switch.kitchen_scene_2
          color_type: card
          color: rgb(66, 134, 244)
          icon: mdi:numeric-2-box-outline
        - type: "custom:button-card"
          entity: switch.kitchen_scene_3
          color_type: card
          color: rgb(66, 134, 244)
          icon: mdi:numeric-3-box-outline
        - type: "custom:button-card"
          entity: switch.kitchen_scene_4
          color_type: card
          color: rgb(66, 134, 244)
          icon: mdi:numeric-4-box-outline
        - type: "custom:button-card"
          entity: switch.kitchen_off
          color_type: card
          color: rgb(66, 134, 244)
          icon: mdi:eye-off-outline
```

### Configuration with states

Input select card with select next service and custom color and icon for states. In the example below the icon `mdi:cube-outline` will be used when value is `sleeping` and `mdi:cube` in other cases.

![cube](examples/cube.png)

#### Default behavior

If you don't specify any operator, `==` will be used to match the current state against the `value`

```yaml
- type: "custom:button-card"
  entity: input_select.cube_mode
  icon: mdi:cube
  tap_action:
    action: service
    service: input_select.select_next
    service_data:
      entity_id: input_select.cube_mode
  show_state: true
  state:
    - value: "sleeping"
      color: var(--disabled-text-color)
      icon: mdi:cube-outline
    - value: "media"
      color: rgb(5, 147, 255)
    - value: "light"
      color: rgb(189, 255, 5)
```

#### With Operator on state

The definition order matters, the first item to match will be the one selected.

```yaml
- type: "custom:button-card"
  entity: sensor.temperature
  show_state: true
  state:
    - value: 15
      operator: '<='
      color: blue
      icon: mdi:thermometer-minus
    - value: 25
      operator: '>='
      color: red
      icon: mdi:thermometer-plus
    - operator: 'default' # used if nothing matches
      color: yellow
      icon: mdi: thermometer
      style:
        - opacity: 0.5
```

#### `tap_action` Location

For example, you can switch panel with the `location` action:

```yaml
- type: "custom:button-card"
  color_type: label-card
  icon: mdi:home
  name: Go To Home
  tap_action:
    action: location
    navigation_path: /lovelace/0
```

#### blink

You can make the whole button blink:
![blink-animation](examples/blink-animation.gif)

```yaml
- type: "custom:button-card"
  color_type: card
  entity: binary_sensor.intruder
  name: Intruder Alert
  state:
    - value: "on"
      color: red
      icon: mdi:alert
      style:
        - animation: blink 2s ease infinite
    - operator: default
      color: green
      icon: mdi:shield-check
```

## Credits

- [ciotlosm](https://github.com/ciotlosm) for the readme template and the awesome examples

[commits-shield]: https://img.shields.io/github/commit-activity/y/custom-cards/button-card.svg?style=for-the-badge
[commits]: https://github.com/custom-cards/button-card/commits/master
[discord]: https://discord.gg/Qa5fW2R
[discord-shield]: https://img.shields.io/discord/330944238910963714.svg?style=for-the-badge
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/t/lovelace-button-card/65981
[license-shield]: https://img.shields.io/github/license/custom-cards/button-card.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/maintenance/yes/2019.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/custom-cards/button-card.svg?style=for-the-badge
[releases]: https://github.com/custom-cards/button-card/releases
