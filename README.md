# Button card

Simple button card for your entities. 

![all](all.png)

## Features

  - works with any toggleable entity
  - 2 actions on tap `toggle` and `more_info` (more to come)
  - shows state if no icon specified for a very simple on/off button
  - custom color for `on` state
  - custom size
  - custom icon
  - icon automagically takes the color of light entities if rgb attribute is present

## Options

| Name | Type | Default | Example   | Description
| ---- | ---- | ------- | --------- | -----------
| type | string | **Required** | `custom:button-card` | Type of the card
| entity | string | **Required** | `switch.ac` | entity_id
| icon | string | optional | `mdi:air-conditioner` | Icon to display in place of the state
| color | string | `var(--primary-text-color)` | `rgb(28, 128, 199)` |  Color of the icon when state is `on`. Can be any html color
| size | string | `40%` | `20px` | Size of the icon. Can be percentage or pixel
| action | string | `toggle` | `toggle` \| `more_info` | Define the type of action

## Instructions

1. Download the [button-card](https://raw.githubusercontent.com/kuuji/button-card/master/button-card.js)
2. Place the file in your `config/www` folder
3. Include the card code in your `ui-lovelace-card.yaml`
```yaml
title: Home
resources:
  - url: /local/button-card.js
    type: module
```
4. Write configuration for the card in your `ui-lovelace.yaml`

## Examples


Show a button for the air conditioner (blue when on):
```yaml
- type: "custom:button-card"
  entity: switch.ac
  icon: mdi:air-conditioner
  color: rgb(28, 128, 199)
```
![ac](ac.png)

Show an ON/OFF button for the home_lights group:
```yaml
- type: "custom:button-card"
  entity: group.home_lights
```
![no-icon](no_icon.png)

Light entity with custom icon and "more info" pop-in
```yaml
- type: "custom:button-card"
  entity: light.living_room_lights
  icon: mdi:sofa
  action: more_info
```
![sofa](sofa.png)

## Credits

  - [ciotlosm](https://github.com/ciotlosm) for the readme template and the awesome examples