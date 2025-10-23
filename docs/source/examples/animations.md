## blink

You can make the whole button blink:

![blink-animation](../images/blink-animation.gif)

```yaml
- type: 'custom:button-card'
  color_type: card
  entity: binary_sensor.intruder
  name: Intruder Alert
  state:
    - value: 'on'
      color: red
      icon: mdi:alert
      styles:
        card:
          - animation: blink 2s ease infinite
    - operator: default
      color: green
      icon: mdi:shield-check
```
