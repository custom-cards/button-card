## General

- Define your config template in the main lovelace configuration and then use it in your button-card. This will avoid a lot of repetitions! It's basically YAML anchors, but without using YAML anchors and is very useful if you split your config in multiple files.
- You can overload any parameter with a new one
- You can merge states together **by `id`** when using templates. The states you want to merge have to have the same `id`. This `id` parameter is new and can be anything (string, number, ...). States without `id` will be appended to the state array. Styles embedded in a state are merged together as usual. See [below](#merging-state-by-id) for an example.
- You can also inherit another template from within a template.
- You can inherit multiple templates at once by making it an array. In this case, the templates will be merged together with the current configuration in the order they are defined. This happens recursively.

      ```yaml
      type: custom:button-card
      template:
        - template1
        - template2
      ```

  The button templates will be applied in the order they are defined: `template2` will be merged with `template1` and then the local config will be merged with the result. You can still chain templates together (ie. define template in a button-card template. It will follow the path recursively).

Make sure which type of lovelace dashboard you are using before changing the main lovelace configuration:

- **`managed`** changes are managed by lovelace ui: add the template configuration to the dashboard in the RAW editor.

      - go to your dashboard
      - click the three dots and `Edit dashboard` button
      - click the three dots again and click `Raw configuration editor` button
      - Add your template configuration at the top of the file, before the `views` key

- **`yaml`**: add your template configuration to your `ui-lovelace.yaml` file, before the `views` key

Then you can define your templates in 2 ways:

- Defined directly in the [dashboard configuration](#loading-templates-directly-defined-in-the-dashboard)
- Loaded from a [URL](#loading-templates-from-a-url)

### Loading templates directly defined in the dashboard

!!! info

    If you are in YAML mode, you can use Home Assistant's YAML extensions `!include`, `!include_dir_named` or `!include_dir_merge_named` to split your templates in multiple files. For example, you can create a file `templates.yaml` and include it in your main configuration as follows:

    ```yaml
    button_card_templates: !include templates.yaml
    ```

This would be the content of your lovelace dashboard file (either in the RAW editor of your dashboard if you are in `managed` mode or in your `ui-lovelace.yaml` file if you are in `yaml` mode):

```yaml
button_card_templates:
  header:
    styles:
      card:
        - padding: 5px 15px
        - background-color: var(--paper-item-icon-active-color)
      name:
        - text-transform: uppercase
        - color: var(--primary-background-color)
        - justify-self: start
        - font-weight: bold
      label:
        - text-transform: uppercase
        - color: var(--primary-background-color)
        - justify-self: start
        - font-weight: bold

  header_red:
    template: header
    styles:
      card:
        - background-color: '#FF0000'

  my_little_template: [...]

views:
  - title: My view
  # ...
```

### Loading templates files from a URL

!!! warning "Security Warning"

    By using this feature, you are trusting the source of the URL. Make sure you trust the source and do not blindly load templates from unknown sources as they can contain malicious code. Always review the content of the URL before using it.

You can load templates from a URL using `button_card_templates_url`. This is useful if you want to share your templates between multiple dashboards when they are managed by Home Assistant (i.e., not in yaml mode) or if you want to load templates from an external source.

The only requirement is that the URL returns a valid YAML with the same structure as the `button_card_templates` configuration.

Any valid URL is supported:

- **local files**: eg. `/local/my_templates.yaml` which would download the file `/config/www/my_templates.yaml` located on your Home Assistant's server
- **external URLs**: eg. `https://example.com/my_templates.yaml`.

!!! info

    - None of the Home Assistant's YAML extensions are supported in the file loaded from the URL. This means that you cannot use `!include` or any other Home Assistant's YAML extension in a file loaded from a URL. You can still use YAML anchors and aliases as they are part of the YAML specification.
    - If a template is defined both in `button_card_templates` and in file loaded from `button_card_templates_url`, the one defined in `button_card_templates` will take precedence over the one loaded from the URL.
    - If a template is defined in multiple files loaded from `button_card_templates_url`, the one defined in the last file will take precedence over the previous ones. The order of the files is determined by the order they are defined in the `button_card_templates_url` array.
    - Each URL will be loaded by all the `custom:button-card` displayed on the page. There's only so much we can do to optimize this behavior.
    - This might slow down the loading of your dashboard if the URL is slow to respond.

```yaml
button_card_templates_url:
  - /local/my_templates.yaml
  - https://example.com/my_templates.yaml

views:
  - title: My view
  # ...
```

## Using config templates in a button-card

Once you have defined your template, you can use it in your button-card as follows:

```yaml
type: custom:button-card
template: header_red
name: My Test Header
```

Or you can also inherit multiple templates at once by making it an array:

```yaml
type: custom:button-card
template:
  - template1
  - template2
name: Testing multiple templates
```

In this case, the templates will be merged together with the current configuration in the order they are defined: `template2` will be merged with `template1` and then the local config will be merged with the result. You can still chain templates together (ie. define template in a button-card template. It will follow the path recursively).

Merging means that the last defined parameter will overwrite the previous one. For example, if `template1` defines a `color: red` and `template2` defines a `color: blue`, the resulting color will be `blue`. If the local config also defines a `color: green`, the final color will be `green`.

## Merging state by id

Example to merge state by `id`:

```yaml
button_card_templates:
  sensor:
    styles:
      card:
        - font-size: 16px
        - width: 75px
    tap_action:
      action: more-info
    state:
      - color: orange
        value: 75
        id: my_id

  sensor_humidity:
    template: sensor
    icon: 'mdi:weather-rainy'
    state:
      - color: 'rgb(255,0,0)'
        operator: '>'
        value: 50
      - color: 'rgb(0,0,255)'
        operator: '<'
        value: 25

  sensor_test:
    template: sensor_humidity
    state:
      - color: pink
        id: my_id
        operator: '>'
        value: 75
        styles:
          name:
            - color: '#ff0000'
```

Used like this:

```yaml
type: custom:button-card
template: sensor_test
entity: input_number.test
show_entity_picture: true
```

Will result in this state object for your button (styles, operator and color are overridden for the `id: my_id` as you can see):

```yaml
state:
  - color: pink
    operator: '>'
    value: 75
    styles:
      name:
        - color: '#ff0000'
  - color: 'rgb(255,0,0)'
    operator: '>'
    value: 50
  - color: 'rgb(0,0,255)'
    operator: '<'
    value: 25
```

## Variables

You can add variables to your templates and overload them in the instance of your button card. This lets you easily work with templates without the need to redefine everything for a small change.

An example below:

```yaml
button_card_templates:
  variable_test:
    variables:
      var_name: "var_value"
      var_name2: "var_value2"
    name: '[[[ return variables.var_name ]]]'

[...]

- type: custom:button-card
  template: variable_test
  entity: sensor.test
  # name will be "var_value"

- type: custom:button-card
  template: variable_test
  entity: sensor.test
  variables:
    var_name: "My local Value"
  # name will be "My local Value"
```
