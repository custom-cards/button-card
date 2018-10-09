# Examples

## Table of Contents
1. [Simple icon button](#simple-icon-button)
1. [On/Off button](#onoff-button)
1. [Light icon button with more_info](#light-icon-button-with-more_info)
1. [Light icon button with text](#light-icon-button-with-text)
1. [Light icon button with custom style](#light-icon-button-with-custom-style)
1. [Light icon card button](#light-icon-card-button)
1. [Stack of light buttons](#stack-of-light-buttons)
1. [Volume up buttons with service call and blank cards](#volume-up-buttons-with-service-call-and-blank-cards)
1. [Scene setting buttons with label card](#scene-setting-buttons-with-label-card)

### Simple icon button

Show a button for the air conditioner (blue when on):

![ac](ac.png)

```yaml
- type: "custom:button-card"
  entity: switch.ac
  icon: mdi:air-conditioner
  color: rgb(28, 128, 199)
```
---------

### On/Off button

Show an On/Off button for the home_lights group:

![no-icon](no_icon.png)

```yaml
- type: "custom:button-card"
  entity: group.home_lights
  show_state: true
```


----------------


### Light icon button with more_info

Light entity with custom icon and "more info" pop-in:

![sofa](sofa.png)

```yaml
- type: "custom:button-card"
  entity: light.living_room_lights
  icon: mdi:sofa
  color: auto
  action: more_info
```


-------------------------

### Light icon button with text

Light card with text:

![text](text.png)

```yaml
- type: "custom:button-card"
  entity: light.living_room_lights
  icon: mdi:sofa
  color: auto
  name: Living room
```



-------------

### Light icon button with custom style

Light card with text and custom style:

![home-custom](home-custom.png)

```yaml
- type: "custom:button-card"
  entity: light._
  icon: mdi:home
  color: auto
  action: more_info
  name: Home
  style:
    - text-transform: none
    - color: rgb(28, 128, 199)
    - font-weight: bold
```

### Light icon card button

-----

Light card with card color type, name, and automatic color:

![color](color.gif)

```yaml
- type: "custom:button-card"
  entity: light._
  icon: mdi:home
  color: auto
  color_type: card
  default_color: rgb(255, 233, 155)
  action: more_info
  name: Home
  style:
    - font-size: 12px
    - font-weight: bold
```

---------------

### Stack of light buttons

Home + all rooms in an horizontal stack

![all-home](all-home.png)


```yaml
- type: horizontal-stack
  cards:
    - type: "custom:button-card"
      entity: light.living_room_lights
      icon: mdi:sofa
      color: auto
      action: more_info
      default_color: rgb(255, 233, 155)
      color_type: card
      name: Living room
      style:
        - font-size: 12px
        - font-weight: bold
    - type: "custom:button-card"
      entity: light.harry
      color: auto
      icon: mdi:ceiling-light
      action: more_info
      name: Ceiling
      style:
        - font-size: 12px
        - font-weight: bold
    - type: "custom:button-card"
      entity: light.ron
      color: auto
      icon: mdi:lamp
      action: more_info
      name: TV
      style:
        - font-size: 12px
        - font-weight: bold
    - type: "custom:button-card"
      entity: light.snape
      icon: mdi:floor-lamp
      color: auto
      action: more_info
      name: Floor
      style:
        - font-size: 12px
        - font-weight: bold
```

------

### Volume up buttons with service call and blank cards

Horizontal stack with :
  - 2x blank cards
  - 1x volume up button with service call
  - 1x volume down button with service call
  - 2x blank cards

![volume](volume.png)

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
      action: service
      service:
        domain: media_player
        action: volume_up
        data:
          entity_id: media_player.livimg_room_speaker
    - type: "custom:button-card"
      color_type: card
      color: rgb(223, 255, 97)
      icon: mdi:volume-minus
      action: service
      service:
        domain: media_player
        action: volume_down
        data:
          entity_id: media_player.livimg_room_speaker
    - type: "custom:button-card"
      color_type: blank-card
    - type: "custom:button-card"
      color_type: blank-card
```
------------
### Scene setting buttons with label card

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
