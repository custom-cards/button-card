## What is a JS Template

`custom:button-card` supports javascript code in specific fields identified by a :white_check_mark: on the JS column in the configuration options.

The code will be executed and the result will be used as a value for the configuration field.

## How to use a JS Template

The template rendering uses a special format. All the fields where JS template is supported (:white_check_mark:) also support plain text. To activate the templating feature for such a field, you'll need to enclose the javascript code inside 3 square brackets: `[[[ javascript code here ]]]`

If you are using a template in a nested `custom:button-card`, either in a custom field or config for an action (e.g. `custom:button-card` as content in `browser_mod.popup`) then you can include your template in extra enclosing `[]` pair. The template will then be rendered in the nested `custom:button-card` with the extra enclosing `[]` pair removed. Template nesting can be at multiple levels, just include another enclosing `[]` pair. See [here](../examples/js-templates.md#nested-custombutton-card) for an example.

Don't forget to quote if it's on one line:

```yaml
name: '[[[ if (entity.state > 42) return "Above 42"; else return "Below 42" ]]]'
name: >
  [[[
    if (entity.state > 42)
      return "Above 42";
    else
      return "Below 42";
  ]]]
```

Those are the configuration fields which support templating:

- `name` (Supports also HTML rendering): This needs to return a string or an `` html`<elt></elt>` `` object
- `state_display` (Supports also HTML rendering): This needs to return a string or an `` html`<elt></elt>` `` object
- `label` (Supports also HTML rendering): This needs to return a string or an `` html`<elt></elt>` `` object
- All the `tooltip` parameters. (Tooltip `content` supports also HTML rendering): This needs to return a string or an `` html`<elt></elt>` ``
- `entity_picture`: This needs to return a path to a file or a url as a string.
- `icon`: This needs to return a string in the format `mdi:icon`
- All the styles in the style object: This needs to return a string
- All the value of the state object, apart from when the operator is `regex`
  - `operator: template`: The function for `value` needs to return a boolean
  - Else: The function for `value` needs to return a string or a number
- All the `custom_fields` (Support also HTML rendering): This needs to return a string or an `` html`<elt></elt>` `` object
- All the `styles`: Each entry needs to return a string (See [here](./custom-fields.md) for some examples)
- The `extra_styles` field
- Everything field in `*_action`
- The confirmation text (`confirmation.text`)
- The lock being enabled or not (`lock.enabled`)
- all the `card` parameters in a `custom_field`
- all the `variables`
- `hidden`: should return a boolean

Special fields which do support templating but are **only evaluated once**, when the configuration is loaded. Error in those templates will only be visible in the javascript console and the card will not display in that case:

- `entity`: You can use JS templates for the `entity` of the card configuration. It is mainly useful when you define your entity in as an entry in `variables`. This is evaluated once only when the configuration is loaded.

  ```yaml
  type: custom:button-card
  variables:
    my_entity: switch.skylight
  entity: '[[[ return variables.my_entity; ]]]'
  ```

- `triggers_update`: Useful when you define multiple entities in `variables` to use throughout the card. Eg:

  ```yaml
  type: custom:button-card
  variables:
    my_entity: switch.skylight
    my_other_entity: light.bedroom
  entity: '[[[ return variables.my_entity; ]]]'
  label: '[[[ return localize(variables.my_other_entity) ]]]'
  show_label: true
  triggers_update:
    - '[[[ return variables.my_entity; ]]]'
    - '[[[ return variables.my_other_entity; ]]]'
  ```

## JS Templates helpers

Inside the javascript code, you'll have access to those variables:

- `this`: The button-card element itself (advanced stuff, don't mess with it)
- `entity`: The current entity object, if the entity is defined in the card
- `states`: An object with all the states of all the entities (equivalent to `hass.states`)
- `user`: The user object (equivalent to `hass.user`)
- `hass`: The complete `hass` object
- `variables`: an object containing all your variables defined in the configuration. See [Variables](./config-templates.md#variables)
- Helper functions availble through the object `helpers`:
  - `helpers.localize(entity, state?, numeric_precision?, show_units?, units?)`: a function which localizes a state to your language (eg. `helpers.localize(entity)`) and returns a string. Takes an entity object as argument (not the state of the entity as we need context) and takes optional arguments. Works with numerical states also.
    - If `state` is not provided, it localizes the state of the `entity` (Eg. `helpers.localize(entity)` or `helpers.localize(states['weather.your_city'])`).
    - If `state` is provided, it localizes `state` in the context of the `entity` (eg. : `helpers.localize(entity, entity.attributes.forecast[0].condition)` or `helpers.localize(states['weather.your_city'], states['weather.your_city'].attributes.forecast[0].condition)`)
    - `numeric_precision` (number or `'card'`. Default is `undefined`): For state which are numbers, force the precision instead of letting HA decide for you. If the value is set to `'card'`, it will use the `numeric_precision` from the main config. If `undefined`, it will use the default value for the entity you're willing to display. The latter is the default.
    - `show_units` (boolean. Default is `true`): Will display units or not. Default is to display them.
    - `units` (string): Will force the units to be the value of that parameter.
    - To skip one or multiple parameter while calling the function, use `undefined`. Eg. `helpers.localize(states['sensor.temperature'], undefined, 1, undefined, 'Celcius')`
  - Date, Time and Date Time format helpers, all localized (takes a string or a `Date` object as input):
    - `helpers.formatTime(time)`: 21:15 / 9:15
    - `helpers.formatTimeWithSeconds(time)`: 9:15:24 PM || 21:15:24
    - `helpers.formatTimeWeekday(time)`: Tuesday 7:00 PM || Tuesday 19:00
    - `helpers.formatTime24h(time)`: 21:15
    - `helpers.formatDateWeekdayDay(date)`: Tuesday, August 10
    - `helpers.formatDate(date)`: August 10, 2021
    - `helpers.formatDateNumeric(date)`: 10/08/2021
    - `helpers.formatDateShort(date)`: Aug 10
    - `helpers.formatDateMonthYear(date)`: August 2021
    - `helpers.formatDateMonth(date)`: August
    - `helpers.formatDateYear(date)`: 2021
    - `helpers.formatDateWeekday(date)`: Monday
    - `helpers.formatDateWeekdayShort(date)`: Mon
    - `helpers.formatDateTime(datetime)`: August 9, 2021, 8:23 AM
    - `helpers.formatDateTimeNumeric(datetime)`: Aug 9, 2021, 8:23 AM
    - `helpers.formatDateTimeWithSeconds(datetime)`: Aug 9, 8:23 AM
    - `helpers.formatShortDateTime(datetime)`: August 9, 2021, 8:23:15 AM
    - `helpers.formatShortDateTimeWithYear(datetime)`: 9/8/2021, 8:23 AM
    - Example: `return helpers.formatDateTime(entity.attribute.last_changed)`
  - `helpers.relativeTime(date, capitalize? = false)`: Returns an lit-html template which will render a relative time and update automatically. `date` should be a string. `capitalize` is an optional boolean, if set to `true`, the first letter will be uppercase. Usage for eg.: `return helpers.relativeTime(entity.last_changed)`
  - `helpers.parseDuration(duration,format?='ms',locale? = <Home Assistant locale>)`: Parses a string duration to number. `helpers.parseDuration('1 day', 's')` returns `86400`. `helpers.parseDuration('1 jour', 'd', 'fr')` returns `1`. If a locale is specified `en` is also used as a fallback.
  - `helpers.toastMessage(message)` and `helpers.toast(toastParams)`: See [toast helpers](../config/actions.md#toast-helpers)
  - `helpers.runAction(actionConfig)`: See [`runAction` JS helper](../config/actions.md#runaction-js-helper)

See [here](../examples/js-templates.md) for some examples or [here](./custom-fields.md) for some advanced configuration using templates.
