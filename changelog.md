## 0.0.3
Custom state, label card and icon attribute

### New features :

 - New setting for custom states
 - Label card for organization https://github.com/kuuji/button-card/pull/23 by [jxwolstenholme](https://github.com/jxwolstenholme)
 - Use icon attribute from entity if it exists https://github.com/kuuji/button-card/pull/21 by [emilp333](https://github.com/emilp333)
 - Support for hex color in auto mode https://github.com/kuuji/button-card/pull/10 by [simo878](https://github.com/simo878)

#### Custom state example with input select entity

```yaml
              - type: "custom:button-card"
                entity: input_select.cube_mode
                icon: mdi:cube
                action: service
                show_state: true
                state:
                  - value: 'sleeping'
                    color: var(--disabled-text-color)
                  - value: 'media'
                    color: rgb(5, 147, 255)
                  - value: 'light'
                    color: rgb(189, 255, 5)
```

### Other

  - Allow to show both state and name (and doesn't break the style)
  - Support for unit of measurement



## 0.0.2
Custom service, blank card and custom_updater support

### New features :

 - New action type `service`
 - Service + data configuration
 - Blank-card
 - Support for custom_updater

![volume](examples/volume.png)

### Other

  - Refactoring
  - Linting


## 0.0.1
Initial release that supports versioning

### New features :

 - Color on off state
 - Default color on light (when color set to `auto` and detection fails)
 - Background color card
 - Boolean to show/hide state
 - Automatic font color based on card color (for readability)

### Changed features :

 - Automatic color mode for lights now has to be enabled via `color: auto`
 - State display has to be enabled explicity via `show_state: true` and is not enabled by default when an icon is not set

### Other

  - Lots of refactoring
  - Versionning

