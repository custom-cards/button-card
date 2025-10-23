This field defines which entities should trigger an update of the card itself (this rule doesn't apply for nested cards in `custom_fields` as they are always updated with the latest state. This is expected and fast!).

If you are using `update_timer` you can set `triggers_update: update_timer` which will **ONLY** update at the timer interval. If `update_timer` is a template, the template is checked whenever hass entities update.

If you don't have javascript `[[[ ]]]` templates in your config, you don't need to do anything, else read further.

By default, the card will update itself when the main entity in the configuration is updated. In any case, the card will parse your code and look for entities that it can match (**it only matches the format `states['ENTITY_ID']`**) so:

```js
// This will match switch.myswitch and add switch.myswitch to the trigger list
return states['switch.myswitch'].state;
// but this won't match anything
const entity = 'switch.myswitch';
return states[entity].state;
```

In this second case, you have 2 options:

- Set the value of `triggers_update` to `all`

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

If your entity, any entity in the `triggers_update` field or any entity matched from your templates are a group and you want to update the card if any of the nested entity in that group update its state, then you can set `group_expand` to `true`. It will do the work for you and you won't have to specify manually the full list of entities in `triggers_update`.

If no entity is suitable for `triggers_update` you may consider to use `update_timer`.
