This will display a normal button with a lock symbol in the corner. Clicking the button will make the lock go away and enable the button to be manoeuvred for `duration` seconds (5 by default).

| Name | JS | Type | Default | Supported options | Description |
| --- | :-: | --- | --- | --- | --- |
| `enabled` | [:white_check_mark:](../advanced/js-templates.md) | boolean | `false` | `true` \| `false` | Enables or disables the lock. |
| `duration` | :no_entry_sign: | number | `5` | any number | Duration of the unlocked state in seconds |
| `exemptions` | :no_entry_sign: | array of user id or username | none | `user: USER_ID` \| `username: test` | Any user declared in this list will not see the confirmation dialog. It can be a user id (`user`) or a username (`username`) |
| `unlock` | :no_entry_sign: | string | `tap` | `tap` \| `hold` \| `double_tap` | The type of click which will unlock the button |
| `keep_unlock_icon` | :no_entry_sign: | boolean | `false` | `true` \| `false` | If `true`, the `unlock_icon` icon will stay visible when the card is unlocked |
| `lock_icon` | :no_entry_sign: | string | `mdi:lock-outline` | any HA icon | The icon when the card is locked |
| `unlock_icon` | :no_entry_sign: | string | `mdi:lock-open-outline` | any HA icon | The icon displayed when the card is unlocked |

Example:

```yaml
lock:
  enabled: '[[[ return entity.state === "on"; ]]]'
  duration: 10
  unlock: hold
  exemptions:
    - username: test
    - user: befc8496799848bda1824f2a8111e30a
```

If you want to lock the button for everyone and disable the unlocking possibility, set the exemptions object to `[]`:

```yaml
lock:
  enabled: true
  exemptions: []
```

By default the lock is visible in the upper-right corner. If you want to move the position of the lock to for example the bottom-right corner you can use this code:

```yaml
styles:
  lock:
    - justify-content: flex-end
    - align-items: flex-end
```

An example:

![lock-animation](../images/lock.gif)

```yaml
- type: horizontal-stack
  cards:
    - type: 'custom:button-card'
      entity: switch.test
      lock:
        enabled: true
    - type: 'custom:button-card'
      color_type: card
      lock:
        enabled: true
      color: black
      entity: switch.test
```
