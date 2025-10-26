## Configuration options

If you don't have [JS templates](./js-templates.md) in your config, you don't need to do anything, else read further.

By default, the card will update itself when:

- The main entity of the card is updated
- Any entity used in any of the JS Templates is updated

!!! info

      If any entity is a group, you might want to set `group_expand: true`. This will expand the group and also update the card if any entities in the group is updated

If you are using `update_timer` you can set `triggers_update: update_timer` which will **ONLY** update at the timer interval. If `update_timer` is a template, the template is checked whenever hass entities update.

If no entity is suitable for `triggers_update` you may consider to use `update_timer`.

## Deprecated

!!! danger "Deprecated"

      The pre `v6.1.0` configuration shouldn't be used anymore.

By setting this configuration option, you can set which entities should trigger an update of the card itself (this rule doesn't apply for nested cards in `custom_fields` as they are always updated with the latest state.

You can change this behavior by setting `triggers_update` to:

- Set the value of `triggers_update` to `all`

      This will update the card whenever **any** entity is updated (could make your frontend very slow)

      ```yaml
      triggers_update: all
      ```

- Set the value of `triggers_update` to a list of entities. When any of the entities in this list is updated, the card will be updated. The logic is the same as the internal home-assistant `* templates` integration (see [here](https://www.home-assistant.io/integrations/binary_sensor.template/#entity_id) for example):

      ```yaml
      type: custom:button-card
      entity: sensor.mysensor # (1)!
      triggers_update:
        - switch.myswitch
        - light.mylight
      ```

      1. No need to repeat this one in the `triggers_update` list, it is added by default

!!! info

    You can also use [JS Templates](./js-templates.md) in triggers update. In this case, it is only evaluated once, when the card configuration is loaded.
