## State configuration

| Name | JS | Type | Default | Supported options | Description |
| --- | :-: | --- | --- | --- | --- |
| `operator` | :no_entry_sign: | string | `==` | See [Available Operators](#available-operators) | The operator used to compare the current state against the `value` |
| `value` | :no_entry_sign:/[:white_check_mark:](../advanced/js-templates.md) | string/number | **required** (unless operator is `default`) | If your entity is a sensor with numbers, use a number directly, else use a string | The value which will be compared against the current state of the entity. JS template is **NOT** supported if operator is `regex` |
| `name` | [:white_check_mark:](../advanced/js-templates.md) | string | optional | Any string, `'Alert'`, `'My little switch is on'`, ... | if `show_name` is `true`, the name to display for this state. If defined uses the general config `name` and if undefined uses the entity name. |
| `icon` | [:white_check_mark:](../advanced/js-templates.md) | string | optional | `mdi:battery` | The icon to display for this state - Defaults to the entity icon. Hide with `show_icon: false`. |
| `color` | :no_entry_sign: | string | `var(--primary-text-color)` | Any color, eg: `rgb(28, 128, 199)` or `blue` | The color of the icon (if `color_type: icon`) or the background (if `color_type: card`) |
| `styles` | :no_entry_sign: | string | optional |  | See [styles](../advanced/styling.md) |
| `rotate` | [:white_check_mark:](../advanced/js-templates.md) | boolean | `false` | `true` \| `false` | Should the icon spin for this state? |
| `entity_picture` | [:white_check_mark:](../advanced/js-templates.md) | string | optional | Can be any of `/local/*` file or a URL | Will override the icon/the default entity_picture with your own image for this state. Best is to use a square image. |
| `label` | [:white_check_mark:](../advanced/js-templates.md) | string | optional | Any string that you want | Display a label below the card. See [Layouts](../advanced/layout.md) for more information. |
| `state_display` | [:white_check_mark:](../advanced/js-templates.md) | string | optional | `On` | If defined, override the way the state is displayed. |
| `spinner` | [:white_check_mark:](../advanced/js-templates.md) | boolean | `false` | `true` or `false` | See [spinner](../advanced/spinner.md). If `true`, it will lock the card and display a spinner. You'll need to use a template or `state` to make this variable. |
| `tooltip` | [:white_check_mark:](../advanced/js-templates.md) | string or object | optionnal | See [Tooltips](./tooltip.md) | Display a tooltip. (Not supported on touchscreens) |

## Available operators

The order of your elements in the `state` object matters. The first one which is `true` will match. The `value` field for all operators except `regex` support [JS templates](../advanced/js-templates.md).

| Operator | `value` example | Description |
| :-: | --- | --- |
| `<` | `5` | Current state is inferior to `value` |
| `<=` | `4` | Current state is inferior or equal to `value` |
| `==` | `42` or `'on'` | **This is the default if no operator is specified.** Current state is equal (`==` javascript) to `value` |
| `>=` | `32` | Current state is superior or equal to `value` |
| `>` | `12` | Current state is superior to `value` |
| `!=` | `'normal'` | Current state is not equal (`!=` javascript) to `value` |
| `regex` | `'^norm.*$'` | `value` regex applied to current state does match |
| `template` |  | See [templates](../advanced/js-templates.md) for examples. `value` needs to be a javascript expression which returns a boolean. If the boolean is true, it will match this state |
| `default` | N/A | If nothing matches, this is used |
