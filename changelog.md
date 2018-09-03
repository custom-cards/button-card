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

