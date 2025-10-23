## Label JS templates

![label_template](../images/labels.png)

```yaml
- type: 'custom:button-card'
  color_type: icon
  entity: light.test_light
  label: |
    [[[
      var bri = states['light.test_light'].attributes.brightness;
      return 'Brightness: ' + (bri ? bri : '0') + '%';
    ]]]
  show_label: true
  size: 15%
  styles:
    card:
      - height: 100px
- type: 'custom:button-card'
  color_type: icon
  entity: light.test_light
  layout: icon_label
  label: |
    [[[
      return 'Other State: ' + states['switch.skylight'].state;
    ]]]
  show_label: true
  show_name: false
  styles:
    card:
      - height: 100px
```

## State JS Templates

The javascript code inside `value` needs to return `true` of `false`.

Example with `template`:

```yaml
- type: 'custom:button-card'
  color_type: icon
  entity: switch.skylight
  show_state: true
  show_label: true
  state:
    - operator: template
      value: |
        [[[
          return states['light.test_light'].attributes
          && (states['light.test_light'].attributes.brightness <= 100)
        ]]]
      icon: mdi:alert
    - operator: default
      icon: mdi:lightbulb
- type: 'custom:button-card'
  color_type: icon
  entity: light.test_light
  show_label: true
  state:
    - operator: template
      value: "[[[ return states['input_select.light_mode'].state === 'night_mode' ]]]"
      icon: mdi:weather-night
      label: Night Mode
    - operator: default
      icon: mdi:white-balance-sunny
      label: Day Mode
```

## Nested `custom:button-card`

A simple nested example. This could be completed with a non-nested card, but the simplicity of this example is to show using templates in nested button cards.

```yaml
type: custom:button-card
entity: sensor.skylight
custom_fields:
  nested:
    card:
      type: custom:button-card
      entity: light.bed_light
      name: | # (1)!
        [[[[
          return entity?.state === 'on' ? 'Light On' : 'Light Off';
        ]]]]
styles:
  grid:
    - grid-template-areas: '"nested"'
```

1.  The template has 4 opening and closing `[]`.

    The entity here is relative to the nested button-card's entity (light.bed_light) because the nested card will receive this JS template with 1 pair of `[]` removed, leaving 3 opening and closing `[]`.

    The nested card's configuration will be:

    ```yaml
    type: custom:button-card
    entity: light.bed_light
    name: |
      [[[
        return entity?.state === 'on' ? 'Light On' : 'Light Off';
      ]]]
    ```
