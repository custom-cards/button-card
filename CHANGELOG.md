## [4.0.0-dev.3](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.2...v4.0.0-dev.3) (2023-07-23)


### ⚠ BREAKING CHANGES

* **actions:** Requires HA 2023.4 minimum. Support for the new action format (`target` is also be supported), `service_data` should be renamed to `data` (but it still works with the old format)

### Features

* **actions:** Support for the new action (assist) and all the future ones ([d9c17a4](https://github.com/custom-cards/button-card/commit/d9c17a40652c020a42497828a56f49d11748d1b8)), closes [#711](https://github.com/custom-cards/button-card/issues/711) [#685](https://github.com/custom-cards/button-card/issues/685)

## [4.0.0-dev.2](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.1...v4.0.0-dev.2) (2023-07-23)


### ⚠ BREAKING CHANGES

* **icons:** This might break your card-mod setup

### Features

* **icons:** replace ha-icon with ha-state-icon to follow new HA's icons per domain automatically ([ab6a3f5](https://github.com/custom-cards/button-card/commit/ab6a3f5bd39fc48890f1b851e929df2fe1d8796c))

## [4.0.0-dev.1](https://github.com/custom-cards/button-card/compare/v3.5.0...v4.0.0-dev.1) (2023-07-23)


### ⚠ BREAKING CHANGES

* this might break some of your color settings

### Bug Fixes

* Color are now aligned with HA > 2022.12 ([685d55e](https://github.com/custom-cards/button-card/commit/685d55e49cacfacace96a56d17f97649a4e3cafd)), closes [#635](https://github.com/custom-cards/button-card/issues/635)
* localization fix ([02dfab3](https://github.com/custom-cards/button-card/commit/02dfab3db391d2ab671f9722c730c1e70dd723db)), closes [#685](https://github.com/custom-cards/button-card/issues/685) [#693](https://github.com/custom-cards/button-card/issues/693)
* lock icon was displaying over more-info dialog ([bf075b0](https://github.com/custom-cards/button-card/commit/bf075b00e4a2f7aa6a193d03eb8c93e0aa30e8ae)), closes [#694](https://github.com/custom-cards/button-card/issues/694)
* lock would go out of the button ([0b3e4d3](https://github.com/custom-cards/button-card/commit/0b3e4d331cfa21b5f682c962ea6222c9e1be7754))

## [3.5.0](https://github.com/custom-cards/button-card/compare/v3.4.2...v3.5.0) (2023-04-02)


### Features

* **state_display:** Support for `state_display` in `state` ([440dc77](https://github.com/custom-cards/button-card/commit/440dc77e7e94ee2db2166be5612419426fcf3582)), closes [#426](https://github.com/custom-cards/button-card/issues/426)


### Bug Fixes

* card broken with HA 2023.04bXX ([9b4f1e2](https://github.com/custom-cards/button-card/commit/9b4f1e23be55a11e7c520e49cbd366380cdba23e)), closes [#669](https://github.com/custom-cards/button-card/issues/669) [#671](https://github.com/custom-cards/button-card/issues/671)
* extra space at bottom because of button-card-action-handler ([699b57d](https://github.com/custom-cards/button-card/commit/699b57d5fce3cd9f9d26b9e1b23fa086239f9f89)), closes [#672](https://github.com/custom-cards/button-card/issues/672)
* remove border from blank card ([b05c6b4](https://github.com/custom-cards/button-card/commit/b05c6b470b70f1b6e3a4383d561eb17ca8557e14)), closes [#652](https://github.com/custom-cards/button-card/issues/652)


### Documentation

* minor quotes correction ([#437](https://github.com/custom-cards/button-card/issues/437)) ([9b5f728](https://github.com/custom-cards/button-card/commit/9b5f728905692649d50f291e738e807e3f5ac36e))
* minor quotes correction ([#438](https://github.com/custom-cards/button-card/issues/438)) ([07ae7a1](https://github.com/custom-cards/button-card/commit/07ae7a129384da329b6f9cb7af62b78e3c34f16a))

## [3.5.0-dev.2](https://github.com/custom-cards/button-card/compare/v3.5.0-dev.1...v3.5.0-dev.2) (2023-04-02)


### Bug Fixes

* card broken with HA 2023.04bXX ([9b4f1e2](https://github.com/custom-cards/button-card/commit/9b4f1e23be55a11e7c520e49cbd366380cdba23e)), closes [#669](https://github.com/custom-cards/button-card/issues/669) [#671](https://github.com/custom-cards/button-card/issues/671)
* extra space at bottom because of button-card-action-handler ([699b57d](https://github.com/custom-cards/button-card/commit/699b57d5fce3cd9f9d26b9e1b23fa086239f9f89)), closes [#672](https://github.com/custom-cards/button-card/issues/672)
* remove border from blank card ([b05c6b4](https://github.com/custom-cards/button-card/commit/b05c6b470b70f1b6e3a4383d561eb17ca8557e14)), closes [#652](https://github.com/custom-cards/button-card/issues/652)


### Documentation

* minor quotes correction ([#437](https://github.com/custom-cards/button-card/issues/437)) ([9b5f728](https://github.com/custom-cards/button-card/commit/9b5f728905692649d50f291e738e807e3f5ac36e))
* minor quotes correction ([#438](https://github.com/custom-cards/button-card/issues/438)) ([07ae7a1](https://github.com/custom-cards/button-card/commit/07ae7a129384da329b6f9cb7af62b78e3c34f16a))

## [3.5.0-dev.1](https://github.com/custom-cards/button-card/compare/v3.4.2...v3.5.0-dev.1) (2021-02-17)


### Features

* **state_display:** Support for `state_display` in `state` ([440dc77](https://github.com/custom-cards/button-card/commit/440dc77e7e94ee2db2166be5612419426fcf3582)), closes [#426](https://github.com/custom-cards/button-card/issues/426)

### [3.4.2](https://github.com/custom-cards/button-card/compare/v3.4.1...v3.4.2) (2021-02-17)


### Bug Fixes

* Support for `fire-dom-event` ([f4fcbfe](https://github.com/custom-cards/button-card/commit/f4fcbfe2ee7e5a9f1ca7a550c77767e921e7b802)), closes [#429](https://github.com/custom-cards/button-card/issues/429)
