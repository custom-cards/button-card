## Ripple and hover color CSS variables names

Buttons will provide hover feedback (ripple) when an action is available. When the icon also has an action, the hover opacity will be slightly less to indicate this. When button/icon is pressed, the opacity will be less to indicate the button/icon is pressed. You can style color and opacity for hover and pressed states using the following CSS variables for `card`.

| Variable | Default | Description |
| --- | --- | --- |
| `--button-card-ripple-color` | Follows `color` of button card | Base color of main button background when hovering over a button with an action |
| `--button-card-ripple-hover-color` | `--button-card-ripple-color` | Color of main button background when hovering over a button with an action |
| `--button-card-ripple-pressed-color` | `--button-card-ripple-color` | Color of main button background when button with an action is pressed |
| `--button-card-ripple-hover-opacity` | 0.04 | Opacity of main button backgrond when hovering over a button with an action |
| `--button-card-ripple-pressed-opacity` | 0.12 | Opacity of main button when a button with an action is pressed |
| `--button-card-ripple-icon-color` | `--button-card-ripple-color` | Color of icon background when hovering over an icon with an action |
| `--button-card-ripple-pressed-color` | `--button-card-ripple-hover-color` | Color of icon background when an icon with an action is pressed |
| `--button-card-ripple-icon-hover-opacity` | `--button-card-ripple-hover-opacity` + 0.05 | Opacity of icon background when hovering over an icon with an action |
| `--button-card-ripple-icon-pressed-opacity` | `--button-card-ripple-pressed-opacity` + 0.05 | Opacity of icon background when an icon with an action is pressed |

Example to set hover to follow light color rather than standard state color:

```yaml
styles:
  icon:
    - color: var(--button-card-light-color)
  card:
    - --button-card-ripple-color: var(--button-card-light-color)
```

Example to set icon hover color and hover & pressed opacity:

```yaml
styles:
  card:
    - --button-card-ripple-icon-hover-opacity: 0.3
    - --button-card-ripple-icon-press-opacity: 0.6
    - --button-card-ripple-icon-color: red
```

## Icon hover and click size & shape

The size of the icon hover background is calculated dynamically from the icon size with padding.

| Variable | Default | Description |
| --- | --- | --- |
| `--button-card-ripple-icon-inset` | Dynamic | Any valid [`inset`](https://developer.mozilla.org/en-US/docs/Web/CSS/inset) value. |
| `--button-card-ripple-icon-border-radius` | `--ha-card-border-radius` or 12px | Any valid [`border-radius`](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) value. |
| `--button-card-ripple-icon-inset-padding` | 12 | A single numerical value used to pad out the icon hover background by this value in pixels. |

Example to extend icon hover to button size but set different icon hover color:

```yaml
styles:
  card:
    - --button-card-ripple-icon-inset: 0
    - --button-card-ripple-icon-color: red
```

Example to set a minimal inset for icon hover:

```yaml
styles:
  card:
    - --button-card-ripple-icon-inset: 5px
```

Example to set no padding for icon hover:

```yaml
styles:
  card:
    - --button-card-ripple-icon-inset-padding: 0
```

Example to set icon shape to pill on a tall icon/image:

```yaml
styles:
  card:
    - '--button-card-ripple-icon-color': red
    - '--button-card-ripple-icon-border-radius': 9999px
    - '--button-card-ripple-icon-inset': 0% 20% 20% 20%
```
