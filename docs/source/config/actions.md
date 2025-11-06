## Actions Configuration

All the fields support [JS templates](../advanced/js-templates.md). You may also provide a single template for the action itself. Such a template needs to return a javascript object that includes the fields below.

| Name | JS | Type | Default | Supported options | Description |
| --- | :-: | --- | --- | --- | --- |
| `action` | [:white_check_mark:](../advanced/js-templates.md) | string | `toggle` | `more-info`, `toggle`, `call-service`, `perform-action`, `none`, `navigate`, `url`, `assist`, `javascript`, `multi-actions`, `fire-dom-event` | Action to perform |
| `entity` | [:white_check_mark:](../advanced/js-templates.md) | string | none | Any entity id | **Only valid for `action: more-info` or `action: toggle`** to override the entity on which you want to call `more-info` |
| `target` | [:white_check_mark:](../advanced/js-templates.md) | object | none |  | Only works with `call-service` or `perform-action`. Follows the [home-assistant syntax](https://www.home-assistant.io/docs/scripts/service-calls/#targeting-areas-and-devices) |
| `navigation_path` | [:white_check_mark:](../advanced/js-templates.md) | string | none | Eg: `/lovelace/0/` | Path to navigate to (e.g. `/lovelace/0/`) when action defined as `navigate` |
| `navigation_replace` | [:white_check_mark:](../advanced/js-templates.md) | boolean | none | `true`, `false` | Whether to replace the current page in the the history with the new URL when the action is defined as `navigate` |
| `url_path` | [:white_check_mark:](../advanced/js-templates.md) | string | none | Eg: `https://www.google.fr` | URL to open on click when action is `url`. The URL will open in a new tab |
| `service` | [:white_check_mark:](../advanced/js-templates.md) | string | none | Any service | Service to call (e.g. `media_player.media_play_pause`) when `action` defined as `call-service` |
| `perform_action` | [:white_check_mark:](../advanced/js-templates.md) | string | none | Any action | Action to call (e.g. `media_player.media_play_pause`) when `action` defined as `perform-action` |
| `data` or `service_data` | [:white_check_mark:](../advanced/js-templates.md) | object | none | Any service data | Service data to include (e.g. `entity_id: media_player.bedroom`) when `action` defined as `call-service` or `perform-action`. If your `data` requires an `entity_id`, you can use the keyword `entity`, this will actually call the service on the entity defined in the main configuration of this card. Useful for [configuration templates](../advanced/config-templates.md) |
| `haptic` | [:white_check_mark:](../advanced/js-templates.md) | string | none | `success`, `warning`, `failure`, `light`, `medium`, `heavy`, `selection`, `none` | [Haptic feedback](https://companion.home-assistant.io/docs/integrations/haptics/) for Home Assistant Companion app on iOS and Android. This overrides any haptic feedback that Home Assistant may use for the action, except for `failure`. Use `none` to diable inbuilt Home Assistant haptics for an action. |
| `repeat` | [:white_check_mark:](../advanced/js-templates.md) | number | none | eg: `500` | For a hold_action, you can optionally configure the action to repeat while the button is being held down (for example, to repeatedly increase the volume of a media player). Define the number of milliseconds between repeat actions here. Not available for `press` or `release` actions. |
| `repeat_limit` | [:white_check_mark:](../advanced/js-templates.md) | number | none | eg: `5` | For Hold action and if `repeat` if defined, it will stop calling the action after the `repeat_limit` has been reached. Not available for `press` or `release` actions. |
| `confirmation` | [:white_check_mark:](../advanced/js-templates.md) | object | none | See [confirmation](#confirmation) | Display a confirmation popup, overrides the default `confirmation` object. |
| `protect` | [:white_check_mark:](../advanced/js-templates.md) | object | none | See [protect](#protect) | Display a password or PIN confirmation popup. |
| `javascript` | [:white_check_mark:](../advanced/js-templates.md) | string | none | any javascript template | A button card javascript template which contains the javascript code to execute. |
| `actions` | [:white_check_mark:](../advanced/js-templates.md) | array of [Actions](./actions.md) or `delay` | none | See [multi-actions](#multi-actions) | Only valid when `action` is set to `multi-actions`. Array of the actions you want to see executed in a row. |
| `pipeline_id` | [:white_check_mark:](../advanced/js-templates.md) | string | none | `last_used`, `prefered`, pipeline ID | Assist pipeline to use when the action is defined as `assist`. It can be either `last_used`, `preferred`, or a pipeline id. |
| `start_listening` | [:white_check_mark:](../advanced/js-templates.md) | boolean | none | `true`, `false` | If supported, listen for voice commands when opening the assist dialog and the action is defined as `assist`. |
| `sound` | [:white_check_mark:](../advanced/js-templates.md) | string | none | eg: `/local/click.mp3` | The path to an audio file (eg: `/local/click.mp3`, `https://some.audio.file/file.wav` or `media-source://media_source/local/click.mp3`). Plays a sound in your browswer when the corresponding action is used. Can be a different sound for each action. Supports also `media-source://` type URLs. |
| `toast` | [:white_check_mark:](../advanced/js-templates.md) | object | none | See [toast](#toast-message) | Only available when action is `toast`. An object describing the toast message to display on the bottom of the screen. |

Example - specifying fields directly:

```yaml
type: custom:button-card
entity: light.bed_light
tap_action:
  action: call-service
  service: light.turn_off
  target:
    entity_id: '[[[ return entity.entity_id ]]]'
```

Example - using a template for action:

```yaml
type: custom:button-card
variables:
  my_action_object: |
    [[[
      if (entity.state == "on")
        return {
          action: "call-service",
          service: "light.turn_off",
          target: { entity_id: entity.entity_id }
        }
      else return { action: "none" }
    ]]]
entity: light.bed_light
tap_action: '[[[ return variables.my_action_object ]]]'
```

Example - Using a javascript action:

```yaml
type: custom:button-card
icon: mdi:console
name: Javascript Action
tap_action:
  action: javascript
  javascript: |
    [[[ alert("Hello from button card"); ]]]
```

## `icon_*_action`

You can configure a separate action for when clicking the icon specifically, while the card itself has a different action:

```yaml
- type: 'custom:button-card'
  entity: light.living_room
  name: Living Room Light
  tap_action:
    action: toggle
  icon_tap_action:
    action: more-info
```

!!! info

    If any `icon_*_action` is defined, the icon will capture **all** the actions for its area. For eg. in the case below, clicking on the icon will not do anything unless you hold it. To execute `tap_action` you'll have to click outside of the icon area.

```yaml
type: 'custom:button-card'
entity: light.living_room
name: Living Room Light
tap_action:
  action: toggle
icon_hold_action:
  action: more-info
```

In this case, if you want to have the same action as the button also on the icon for `tap`, you'll have to define the `icon_tap_action` explicitely.

```yaml
type: 'custom:button-card'
entity: light.living_room
name: Living Room Light
tap_action:
  action: toggle
icon_tap_action:
  action: toggle
icon_hold_action:
  action: more-info
```

## Confirmation

This will popup a dialog box before running the action.

| Name | JS | Type | Default | Supported options | Description |
| --- | :-: | --- | --- | --- | --- |
| `text` | [:white_check_mark:](../advanced/js-templates.md) | string | none | Any text | This text will be displayed in the popup. |
| `exemptions` | [:white_check_mark:](../advanced/js-templates.md) | array of users | none | `user: USER_ID` | Any user declared in this list will not see the confirmation dialog |

Example:

```yaml
confirmation:
  text: '[[[ return `Are you sure you want to toggle ${entity.attributes.friendly_name}?` ]]]'
  exemptions:
    - user: befc8496799848bda1824f2a8111e30a
```

## Protect

This will popup a dialog box with password or PIN confirmation before running the action.

!!! warning

    This is only running in your browser. This is **NOT** a real security feature.

    Anyone with a javascript console access to the UI or admin access can bypass this protection. Don't protect sensitive entities with this feature and use at your own risk.

| Name | JS | Type | Default | Supported options | Description |
| --- | :-: | --- | --- | --- | --- |
| `pin` | [:white_check_mark:](../advanced/js-templates.md) | string | none | any string composed of digits only | This will prompt for a PIN before running the action. Make sure you set this as a **string** like so `"1234"` |
| `password` | [:white_check_mark:](../advanced/js-templates.md) | string | none | any string | Setting this field will prompt for a password before running the action. |
| `failure_message` | [:white_check_mark:](../advanced/js-templates.md) | string | Fixed failure message | any string | If password or PIN is wrong, a toast will popup with this `failure_message` inside. |
| `success_message` | [:white_check_mark:](../advanced/js-templates.md) | string | none | any string | If password or PIN is valid, a toast will popup with the content of `success_message` inside. |

Protect can be defined at the card level, or at the action level. Both objects supports templating. The action level takes precedance over the card level, if both are defined, objects will be "merged" together (see eg. below).

Eg:

```yaml
type: custom:button-card
entity: light.aquarium
tap_action:
  action: toggle
hold_action:
  action: perform-action
  perform_action: switch.toggle
  target:
    entity_id: switch.aquarium_pump
  protect:
    pin: '123456'
```

Defining a PIN for all actions but one:

```yaml
type: custom:button-card
entity: light.aquarium
protect: # (1)!
  pin: '1234'
  success_message: 'PIN is correct!'
  failure_message: 'PIN is wrong!'
tap_action:
  action: toggle
hold_action:
  action: perform-action
  perform_action: switch.toggle
  target:
    entity_id: switch.aquarium_pump
icon_tap_action:
  action: more-info
  entity: sensor.aquarium_temperature
  protect:
    pin: '' # (2)!
```

1. Globally enables the PIN for all actions.
2. Setting this to an empty string disables the pin for this action only.

## Multi-actions

The `action: multi-actions` enables you to run several actions in a row with optional delay between them.

!!! info

    This **only** runs in your browser so there are limitations.

    All the actions will be fired back to back without waiting for the previous action to finish.
    Also, because it's running in the browser, it means that if you navigate away from the page where the button-card is displayed while there are still some actions queued, they won't be executed.

    This should only be used to run `navigate`, `javascript` or `fire-dom-event` actions alongside a normal service call and not as a replacement for a backend script!

Each entry of the `actions` array should be an action. Note that `repeat`, `repeat_limit`, `sound`, `confirmation`, `protect` and `haptic` are not taken into account in the nested actions, if you set any of those properties, it will be ignored.

There are 2 special entries which can be used in the array:

- `delay`: This entry takes a string (parsed with natural language, so you can use `3s` or `1min`) or a number (milliseconds) as an argument and is the delay to wait before firing the next action. It can be templated too.

- `wait_completion`: This entry takes a button card JS template as an argument. The template needs to return `true` or `false`. It will run this template every 1/2 second until the template returns `true` and then run the next step.

  With `wait_completion`, you can also specify a `timeout` value (same format as `delay`). If the timeout is exceeded, it will go to the next step.

  Again, if the card disapears from the screen, it will stop working.

Let's go for some examples:

```yaml
type: 'custom:button-card'
icon: mdi:console
name: multi-actions
variables:
  delay: 3s
tap_action:
  confirmation:
    text: Do you want to run multiple-actions?
  action: multi-actions
  actions:
    - action: call-service
      service: light.toggle
      service_data:
        entity_id: light.test_light
    - action: javascript
      javascript: '[[[ helpers.toastMessage(`Waiting ${variables.delay}...`); ]]]'
    - delay: '[[[ return variables.delay; ]]]'
    - action: call-service
      service: light.toggle
      service_data:
        entity_id: light.test_light
```

With `wait_completion`:

```yaml
type: 'custom:button-card'
icon: mdi:console
name: MA script completion
tap_action:
  action: multi-actions
  actions:
    - action: perform-action
      perform_action: script.turn_on
      target:
        entity_id: script.delay_script # (1)!
    - wait_completion: '[[[ return states["script.delay_script"].state === "off" ]]]'
      timeout: 15s # (2)!
    - action: navigate # (3)!
      navigation_path: /lovelace/0
```

1.  This script runs for 10 seconds, keeping its state to "on"

    `script.delay_script`'s config for the sake of the example:

    ```yaml title="configuration.yaml"
    script:
      delay_script:
        alias: Delay Script
        sequence:
          - delay: '00:00:10'
    ```

2.  Safeguard
3.  This will be called once the script has finished running (state will be "off")

## Toast Message

### Configuration options

All options support templating.

| Name | JS | Type | Default | Supported options | Description |
| --- | :-: | --- | --- | --- | --- |
| `message` | [:white_check_mark:](../advanced/js-templates.md) | string | Optional | any string | The toast message to display |
| `duration` | [:white_check_mark:](../advanced/js-templates.md) | number | Optional | any number | The message will be displayed for `duration` ms |
| `dismissable` | [:white_check_mark:](../advanced/js-templates.md) | boolean | Optional | `true` or `false` | If the toast message is dismissable |
| `action` | [:white_check_mark:](../advanced/js-templates.md) | object | Optional | See [toast actions](#toast-actions) | If defined, will display a button on the toast message and if clicked, an action will be triggered |

Eg:

- Simple toast messages:

      ```yaml
      type: 'custom:button-card'
      icon: mdi:console
      name: Toast action
      tap_action:
        action: toast
        toast:
          message: 'This is a toast message'
      ```

      ```yaml
      type: 'custom:button-card'
      icon: mdi:console
      name: Toast action
      tap_action:
        action: toast
        toast:
          message: 'This is a toast message which is displayed for 20s and can be dismissed'
          duration: 20000
          dismissable: true
      ```

- Used in `action: multi-actions`

      ```yaml
      type: 'custom:button-card'
      entity: light.skylight
      tap_action:
        action: multi-actions
        actions:
          - action: toggle
          - action: toast
            toast:
              message: 'The light has been toggled'
              duration: 20000
              dismissable: true
      ```

### Toast Actions

All options support javascript templating. Mandatory for `action`.

You can display a button on the toast message with an associated action.

| Name | JS | Type | Default | Supported options | Description |
| --- | :-: | --- | --- | --- | --- |
| `text` | [:white_check_mark:](../advanced/js-templates.md) | string |  | any string | The action button text |
| `action` | [:white_check_mark:](../advanced/js-templates.md) | function |  | any javascript function | This needs to be a template and the template needs to return a function. The function is then called if the user clicks on the toast button |

Eg:

```yaml
type: 'custom:button-card'
icon: mdi:console
name: Toast action
tap_action:
  action: toast
  toast:
    message: 'This is a toast with an undo button'
    duration: 10000
    dismissable: true
    action:
      text: 'Undo'
      action: |
        [[[
          return () => setTimeout(
              () => helpers.toastMessage("You clicked Undo!"),
              500
            );
        ]]]
```

### Toast Helpers

2 helpers are available in javascript templates:

- `helpers.toastMessage(message)`: Displays a toast message with the content of `message`.
- `helpers.toast(toastParams)`: Displays a toast message with advanced options, see below.

`helpers.toast(toastParams)` uses the same configuration options as the [toast action](#toast-actions). It takes an object as parameter.

Eg (this produces exactly the same result as the example above from [toast actions](#toast-actions)):

```yaml
type: 'custom:button-card'
icon: mdi:console
name: Toast javascript
tap_action:
  action: javascript
  javascript: |
    [[[
      helpers.toast(
        {
          message: "This is a toast from JS",
          duration: 10000,
          dismissable: true,
          action: {
            text: "Undo",
            action: () => setTimeout(() => helpers.toastMessage("You clicked Undo!"), 500)
          }
        }
      )
    ]]]
```

## `runAction` JS helper

If for any reason, you want to run an action directly from javascript, `helpers.runAction(actionConfig)` is a [JS Template](../advanced/js-templates.md) helper function which takes an [action](./actions.md) object as a parameter and runs the action. All the button-card action options and types are supported.

Eg:

- With the action defined directly in the template:

      ```yaml
      type: 'custom:button-card'
      icon: mdi:console
      name: helper.runAction
      tap_action:
        action: javascript
        javascript: |
          [[[
            const action = {
              action: "toggle",
              entity: "switch.skylight",
              protect: {
                pin: "1234"
              }
            }
            helpers.runAction(action);
          ]]]
      ```

* With the action defined in a variable:

      ```yaml
      type: 'custom:button-card'
      icon: mdi:console
      name: helper.runAction
      variables:
        my_action:
          action: perform-action
          perform_action: switch.turn_on
          target:
            entity_id: switch.my_switch
          protect:
            pin: '1234'
      tap_action:
        action: javascript
        javascript: '[[[ helpers.runAction(variables.my_action); ]]]'
      ```
