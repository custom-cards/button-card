This option enables you to define a tooltip for the card. Tooltips are not supported on touch devices. The tooltip will display after a delay when the card is in focus and hide after a delay when the card loses focus, or a button card in a custom field shows a tooltip.

## Basic tooltip

| Name | JS | Type | Default | Supported options | Description |
| --- | :-: | --- | --- | --- | --- |
| `tooltip` | [:white_check_mark:](../advanced/js-templates.md) | string | none | A string or an `` html`<elt></elt>` `` object | A simple form of tooltip which allows for string/HTML but with no further control, allowing for backward compatability with configuration prior to 5.1.0 |

```yaml
type: custom:button-card
entity: light.bed_light
tooltip: Tap to toggle
```

Example using state

```yaml
type: custom:button-card
entity: light.bed_light
state:
  - value: 'on'
    tooltip: Tap to turn OFF
  - value: 'off'
    tooltip: Tap to turn ON
```

## Tooltip

All parameters support [JS Templates](../advanced/js-templates.md).

| Name | JS | Type | Default | Supported options | Description |
| --- | --- | --- | --- | --- | --- |
| `content` | [:white_check_mark:](../advanced/js-templates.md) | string | none | A string or an `` html`<elt></elt>` `` object | Tooltip content. |
| `placement` | [:white_check_mark:](../advanced/js-templates.md) | string | `top` | `top`, `top-start`, `top-end`, `right`, `right-start`, `right-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end` | The anchor point of the tooltip im relation to the card. The tooltip shows outside the card at this location. If needed the tooltip will flip to the alternate side. See [placement](https://webawesome.com/docs/components/tooltip/#placement) for examples. |
| `delay` | [:white_check_mark:](../advanced/js-templates.md) | number or string | 150ms | number (ms), string duration in english supported by `helpers.parseDuration` | Delay after which the tooltip will display when the card is in focus. |
| `hide_delay` | [:white_check_mark:](../advanced/js-templates.md) | number or string | `delay` | number (ms), string duration in english supported by `helpers.parseDuration` | Delay after which the tooltip will hide when card loses of focus. |
| `distance` | [:white_check_mark:](../advanced/js-templates.md) | number | 8 | number (pixels) | The distance in pixels by which the tooltip is offset away from the card. This can be negative to move the tooltip closer to or even over the card. If the tooltip is over the card you may need to set tooltip style to include `pointer-events: none` to stop a focus battle between the tooltip and the card. |
| `skidding` | [:white_check_mark:](../advanced/js-templates.md) | number | optinal | number (pixels) | The distance in pixels by which the tooltip is offset along teh card |
| `arrow` | [:white_check_mark:](../advanced/js-templates.md) | boolean | false | true \| false | Whether to show an arrow connecting the button to the tooltip. |

```yaml
type: custom:button-card
entity: light.bed_light
tooltip:
  content: Tap to toggle
  placement: bottom-start
  delay: 1s
  distance: 20
  skidding: 50
  arrow: true
```

Example using state

```yaml
type: custom:button-card
entity: light.bed_light
tooltip:
  placement: bottom-start
  delay: 1s
  distance: 20
  skidding: 50
  arrow: true
state:
  - value: 'on'
    tooltip:
      content: Tap to turn OFF
  - value: 'off'
    tooltip:
      content: Tap to turn ON
```

## Tooltip styles

The following style variables are available for tooltips. See [Styles](../advanced/styling.md) for how to apply style in main config or state.

| CSS Variable | Default | Description |
| --- | --- | --- |
| `--button-card-tooltip-content-color` | var(--primary-text-color) | Tooltip text color |
| `--button-card-tooltip-background-color` | var(--secondary-background-color) | Tooltip background color |
| `--button-card-tooltip-font-family` | var(--ha-tooltip-font-family, var(--ha-font-family-body)) | Tooltip font family |
| `--button-card-tooltip-font-size` | var(--ha-tooltip-font-size, var(--ha-font-size-s)) | Tooltip font size |
| `--button-card-tooltip-font-weight` | var(--ha-tooltip-font-weight, var(--ha-font-weight-normal)) | Tooltip font weight |
| `--button-card-tooltip-line-height` | var(--ha-tooltip-line-height, var(--ha-line-height-condensed)) | Tooltip line height |
| `--button-card-tooltip-text-align` | center | Tooltip text align |
| `--button-card-tooltip-text-transform` | none | Tooltip text transform |
| `--button-card-tooltip-text-decoration` | none | Tooltip text decoration |
| `--button-card-tooltip-overflow-wrap` | normal | Tooltip overflow-wrap |
| `--button-card-tooltip-padding` | 0.25em 0.5em | Tooltip padding |
| `--button-card-tooltip-border-radius` | var(--ha-tooltip-border-radius, var(--ha-border-radius-sm)) | Tooltip border radius |
| `--button-card-tooltip-border-width` | none | Tooltip border width |
| `--button-card-tooltip-border-color` | none | Tooltip border color |
| `--button-card-tooltip-border-style` | none | Tooltip border style |
| `--button-card-tooltip-box-shadow` | none | Tooltip box shadow |
| `--button-card-tooltip-arrow-size` | var(--ha-tooltip-arrow-size, 8px) | Tooltip arrow size, if displayed |
| `--button-card-tooltip-max-width` | 30ch | Tooltip maximum width. Set to `none` to not limit the tooltip width |
| `--button-card-tooltip-opacity` | 1 | Tooltip opacity. Due to the underlying component used, if you set opacity you will likely need to have set `--button-card-tooltip-show-duration` and `--button-card-hide-duration` to 1ms as the underlying component animates to opacity of 1, meaning a flash at full opacity if you don't set small show/hide duartion. |
| `--button-card-tooltip-show-duration` | 100ms | Duration during which the show tooltip animation takes place. The underlying component has a fixed duration of scale (0.8 to 1) and opacity (0 to 1). If you set `--button-card-tooltip-opacity` you should set this to 1ms. |
| `--button-card-tooltip-hide-duration` | 100ms | Duration during which the hide tooltip animation takes place. The underlying component has a fixed duration of scale (1 to 0.8) and opacity (1 to 0). If you set `--button-card-tooltip-opacity` you should set this to 1ms. NOTE: Setting this CSS variable to 0 will stop hiding of the tooltip. |

In addition to the CSS variables above, you can also style parts of the popup directly using [extra_styles](../advanced/styling.md#injecting-css-with-extra_styles). The parts available are listed in the table below.

!!! note

    Keyframes are not injectable by parts so you cannot adjust nor set any keyframes for animation.

| Part | Targets | Usage |
| --- | --- | --- |
| `#tooltip::part(base)` | The component's base wrapper, an <wa-popup> element. | `#tooltip::part(body) { pointer-events: none; }` |
| `#tooltip::part(base__popup)` | The popup's exported popup part. Use this to target the tooltip's popup container. | `#tooltip::part(base__popup) { transform: rotate(90deg) translateY(-100px); }` |
| `#tooltip::part(base__arrow)` | The popup's exported arrow part. Use this to target the tooltip's arrow. | `#tooltip::part(base__arrow) { background-color: red; }` |
| `#tooltip::part(body)` | Tooltip's body where the content is rendered | `#tooltip::part(body) { background-color: red; }` |
