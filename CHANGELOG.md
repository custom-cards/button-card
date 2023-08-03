### [4.1.1](https://github.com/custom-cards/button-card/compare/v4.1.0...v4.1.1) (2023-08-03)


### Bug Fixes

* **color:** color wouldn't follow light color with `color: auto` ([b63f0db](https://github.com/custom-cards/button-card/commit/b63f0db220b8a9c72383c4288546112625fdff04)), closes [#737](https://github.com/custom-cards/button-card/issues/737)

## [4.1.0](https://github.com/custom-cards/button-card/compare/v4.0.1...v4.1.0) (2023-08-03)


### Features

* **templates:** Support for one time evaluation of js templates in `triggers_update` and `entity` ([#741](https://github.com/custom-cards/button-card/issues/741)) ([b372642](https://github.com/custom-cards/button-card/commit/b372642253c890b08c7de7395d138b01fb90120b)), closes [#618](https://github.com/custom-cards/button-card/issues/618) [#558](https://github.com/custom-cards/button-card/issues/558) [#368](https://github.com/custom-cards/button-card/issues/368)


### Bug Fixes

* Keep default background color for color_type: card when off ([41dea3f](https://github.com/custom-cards/button-card/commit/41dea3f72a607ea0fc1c71269bb0122f27970a6e)), closes [#737](https://github.com/custom-cards/button-card/issues/737)
* lock would not display on many browsers ([245441b](https://github.com/custom-cards/button-card/commit/245441b69fad5f56f43ea1b5d189b4ddbbab2ebb)), closes [#740](https://github.com/custom-cards/button-card/issues/740)
* remove margin-top on name/label/state introduced with 4.0.0 which broke many cards ([53fee75](https://github.com/custom-cards/button-card/commit/53fee75c163b72df42b859705af536c4c7dffac6)), closes [#742](https://github.com/custom-cards/button-card/issues/742) [#744](https://github.com/custom-cards/button-card/issues/744)

## [4.1.0-dev.3](https://github.com/custom-cards/button-card/compare/v4.1.0-dev.2...v4.1.0-dev.3) (2023-08-01)


### Bug Fixes

* lock would not display on many browsers ([245441b](https://github.com/custom-cards/button-card/commit/245441b69fad5f56f43ea1b5d189b4ddbbab2ebb)), closes [#740](https://github.com/custom-cards/button-card/issues/740)

## [4.1.0-dev.2](https://github.com/custom-cards/button-card/compare/v4.1.0-dev.1...v4.1.0-dev.2) (2023-08-01)


### Bug Fixes

* remove margin-top on name/label/state introduced with 4.0.0 which broke many cards ([53fee75](https://github.com/custom-cards/button-card/commit/53fee75c163b72df42b859705af536c4c7dffac6)), closes [#742](https://github.com/custom-cards/button-card/issues/742) [#744](https://github.com/custom-cards/button-card/issues/744)

## [4.1.0-dev.1](https://github.com/custom-cards/button-card/compare/v4.0.1...v4.1.0-dev.1) (2023-07-30)


### Features

* **templates:** Support for one time evaluation of js templates in `triggers_update` and `entity` ([#741](https://github.com/custom-cards/button-card/issues/741)) ([b372642](https://github.com/custom-cards/button-card/commit/b372642253c890b08c7de7395d138b01fb90120b)), closes [#618](https://github.com/custom-cards/button-card/issues/618) [#558](https://github.com/custom-cards/button-card/issues/558) [#368](https://github.com/custom-cards/button-card/issues/368)


### Bug Fixes

* Keep default background color for color_type: card when off ([41dea3f](https://github.com/custom-cards/button-card/commit/41dea3f72a607ea0fc1c71269bb0122f27970a6e)), closes [#737](https://github.com/custom-cards/button-card/issues/737)

### [4.0.1](https://github.com/custom-cards/button-card/compare/v4.0.0...v4.0.1) (2023-07-30)


### Bug Fixes

* color: auto/auto-no-temperature was broken ([a63f9a9](https://github.com/custom-cards/button-card/commit/a63f9a96a5e4d4582ca90095c49464b0462a451a)), closes [#737](https://github.com/custom-cards/button-card/issues/737)

## [4.0.0](https://github.com/custom-cards/button-card/compare/v3.5.0...v4.0.0) (2023-07-29)


### ⚠ BREAKING CHANGES

* **helpers:** If you were using any of the beta before `4.0.0-dev14`. Please replace all the calls to helper functions with `helpers.xxx` for eg. `helpers.relativeTime(entity.state)` or `helpers.localize(entity)`
* **hacs:** Minimum required HA Version is now 2023.7
* **actions:** Requires HA 2023.4 minimum. Support for the new action format (`target` is also be supported), `service_data` should be renamed to `data` (but it still works with the old format)
* **icons:** This might break your card-mod setup
* this might break some of your color settings

### Features

* **action:** `repeat_limit` for `hold_action` ([73c216f](https://github.com/custom-cards/button-card/commit/73c216f1bf82c104848bb5d7aef2d91ba3597a95)), closes [#564](https://github.com/custom-cards/button-card/issues/564) [#555](https://github.com/custom-cards/button-card/issues/555)
* **actions:** Support for the new action (assist) and all the future ones ([d9c17a4](https://github.com/custom-cards/button-card/commit/d9c17a40652c020a42497828a56f49d11748d1b8)), closes [#711](https://github.com/custom-cards/button-card/issues/711) [#685](https://github.com/custom-cards/button-card/issues/685)
* **custom_fields:** Add `do_not_eval` to stop evaluating js templates in an embedded card ([1638cf8](https://github.com/custom-cards/button-card/commit/1638cf81217ef696a6b0967550cbbb9f3849c813))
* **helpers:** all template functions are now available through the `helpers` object ([f22ed69](https://github.com/custom-cards/button-card/commit/f22ed6982f09d1ffbc303a14f81a9a6345acd274))
* **icons:** replace ha-icon with ha-state-icon to follow new HA's icons per domain automatically ([ab6a3f5](https://github.com/custom-cards/button-card/commit/ab6a3f5bd39fc48890f1b851e929df2fe1d8796c))
* **templates:** new `relativeTime` function to display a relative time in a template and update it automatically ([965a3d7](https://github.com/custom-cards/button-card/commit/965a3d7b97b9fe1d155029dd6156f7a2f051f5a9)), closes [#701](https://github.com/custom-cards/button-card/issues/701)
* **templates:** New date and time format helpers ([9b4fb05](https://github.com/custom-cards/button-card/commit/9b4fb05e4e5b3d70fa4c1f8f7f5778ca55e551f6))
* **variables:** A variable can depend on another variable based on their name's alphabetical order ([8cddccb](https://github.com/custom-cards/button-card/commit/8cddccb83466d2db29f832085e2c701bdef6b254)), closes [#656](https://github.com/custom-cards/button-card/issues/656)
* Force the `numeric_precision` for states which are numbers ([24d75c2](https://github.com/custom-cards/button-card/commit/24d75c2651c9e6b3b080b1c2561bda2c30a2f294))
* new helper functions for date/time in templates ([2b75993](https://github.com/custom-cards/button-card/commit/2b75993f22e4624776c839bfa9dafe1ddde7660d)), closes [#701](https://github.com/custom-cards/button-card/issues/701)
* Support for localization in templates ([5de2dc9](https://github.com/custom-cards/button-card/commit/5de2dc906781f46a952377d40ba77d75728f19e3))


### Bug Fixes

* *_action more-info entity as a template was not evaluated ([02441b2](https://github.com/custom-cards/button-card/commit/02441b29820bc84816bb480a94307291c20028d4)), closes [#734](https://github.com/custom-cards/button-card/issues/734)
* `group_expand` now works even if the entity is not a `group.xxx` ([f192ded](https://github.com/custom-cards/button-card/commit/f192ded67f092a47d4bafe2c0fec2d8ccc55dc44)), closes [#645](https://github.com/custom-cards/button-card/issues/645)
* Color are now aligned with HA > 2022.12 ([685d55e](https://github.com/custom-cards/button-card/commit/685d55e49cacfacace96a56d17f97649a4e3cafd)), closes [#635](https://github.com/custom-cards/button-card/issues/635)
* custom fields would sometime throw unsafeHTML errors ([c67e1d5](https://github.com/custom-cards/button-card/commit/c67e1d550c79bc6610e1592c95e509cfc6a06fa5)), closes [#725](https://github.com/custom-cards/button-card/issues/725)
* ha-icon (if in custom_fields) size was weird ([a448c8e](https://github.com/custom-cards/button-card/commit/a448c8e826605d17591beebd4a230d0287cdf945))
* ha-state-icon CSS selector was wrong ([a1bb39a](https://github.com/custom-cards/button-card/commit/a1bb39a71c55dca505d4b1a7d820229e26d4e0eb))
* icon would be cut with card height defined ([19f8393](https://github.com/custom-cards/button-card/commit/19f83931939a8c15bd9e1174f11c0e52dd451bf8)), closes [#731](https://github.com/custom-cards/button-card/issues/731)
* localization fix ([02dfab3](https://github.com/custom-cards/button-card/commit/02dfab3db391d2ab671f9722c730c1e70dd723db)), closes [#685](https://github.com/custom-cards/button-card/issues/685) [#693](https://github.com/custom-cards/button-card/issues/693)
* lock icon was displaying over more-info dialog ([bf075b0](https://github.com/custom-cards/button-card/commit/bf075b00e4a2f7aa6a193d03eb8c93e0aa30e8ae)), closes [#694](https://github.com/custom-cards/button-card/issues/694)
* lock would go out of the button ([0b3e4d3](https://github.com/custom-cards/button-card/commit/0b3e4d331cfa21b5f682c962ea6222c9e1be7754))
* non string fiels would error with an unsafeHTML error ([d65c347](https://github.com/custom-cards/button-card/commit/d65c34757a20859a8c3c70fd2b612bfe818a662a)), closes [#725](https://github.com/custom-cards/button-card/issues/725)
* numerical states would not follow HA's format ([72d7c41](https://github.com/custom-cards/button-card/commit/72d7c4133ff96713ecbe42168db0d6732b82510c)), closes [#662](https://github.com/custom-cards/button-card/issues/662)
* optimize contrast color compute ([35109c3](https://github.com/custom-cards/button-card/commit/35109c3d5c8454958f67be706026e73786f853bc))
* relativeTime didn't support to set the first letter uppercase ([f8b9b09](https://github.com/custom-cards/button-card/commit/f8b9b0916964495c3b0b9341b5c6751a9a99a1c8)), closes [#735](https://github.com/custom-cards/button-card/issues/735)
* Some cards with child cards wouldn't be clickable ([9f21c58](https://github.com/custom-cards/button-card/commit/9f21c58dacf5605851ef3ab2d936ef8f35d0b783))
* text/icon contrast when using label-card ([01e199b](https://github.com/custom-cards/button-card/commit/01e199b18b9caa31d4bc1a43c5a143e8d40f2836))
* variable which were objects were only evaluated once ([e40bda9](https://github.com/custom-cards/button-card/commit/e40bda9da67008cbca8f18fc0ef4d65c7b8f08b5))
* **templates:** `variables` was `undefined` if none where provided. ([fad332b](https://github.com/custom-cards/button-card/commit/fad332b80d0fe910fa99e13e1e291ffa4b65188e)), closes [#718](https://github.com/custom-cards/button-card/issues/718)
* tooltip would show over everything ([1bc8f99](https://github.com/custom-cards/button-card/commit/1bc8f9950159a260536d6918b55c3cb15eb7bb04))
* **color:** main config `color` was broken ([b93c996](https://github.com/custom-cards/button-card/commit/b93c9969c2d1d9be9486edc1607a11635b03c29a))
* **hacs:** minimum HA version 2023.7 ([db3b394](https://github.com/custom-cards/button-card/commit/db3b394fa6e970599d58c51d0caaa0ab2afbda1d))
* **templates:** don't use the `numeric_precision` from the card config for `localize` in js templates by default ([2cc384f](https://github.com/custom-cards/button-card/commit/2cc384f9dc5cb91a88a31b363db6083147092bb5))

## [4.0.0-dev.19](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.18...v4.0.0-dev.19) (2023-07-29)


### Bug Fixes

* variable which were objects were only evaluated once ([e40bda9](https://github.com/custom-cards/button-card/commit/e40bda9da67008cbca8f18fc0ef4d65c7b8f08b5))

## [4.0.0-dev.18](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.17...v4.0.0-dev.18) (2023-07-28)


### Features

* **custom_fields:** Add `do_not_eval` to stop evaluating js templates in an embedded card ([1638cf8](https://github.com/custom-cards/button-card/commit/1638cf81217ef696a6b0967550cbbb9f3849c813))


### Bug Fixes

* relativeTime didn't support to set the first letter uppercase ([f8b9b09](https://github.com/custom-cards/button-card/commit/f8b9b0916964495c3b0b9341b5c6751a9a99a1c8)), closes [#735](https://github.com/custom-cards/button-card/issues/735)

## [4.0.0-dev.17](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.16...v4.0.0-dev.17) (2023-07-27)


### Features

* **variables:** A variable can depend on another variable based on their name's alphabetical order ([8cddccb](https://github.com/custom-cards/button-card/commit/8cddccb83466d2db29f832085e2c701bdef6b254)), closes [#656](https://github.com/custom-cards/button-card/issues/656)

## [4.0.0-dev.16](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.15...v4.0.0-dev.16) (2023-07-27)


### Bug Fixes

* *_action more-info entity as a template was not evaluated ([02441b2](https://github.com/custom-cards/button-card/commit/02441b29820bc84816bb480a94307291c20028d4)), closes [#734](https://github.com/custom-cards/button-card/issues/734)

## [4.0.0-dev.15](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.14...v4.0.0-dev.15) (2023-07-26)


### Features

* **templates:** New date and time format helpers ([9b4fb05](https://github.com/custom-cards/button-card/commit/9b4fb05e4e5b3d70fa4c1f8f7f5778ca55e551f6))

## [4.0.0-dev.14](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.13...v4.0.0-dev.14) (2023-07-26)


### ⚠ BREAKING CHANGES

* **helpers:** If you were using any of the beta before `4.0.0-dev14`. Please replace all the calls to helper functions with `helpers.xxx` for eg. `helpers.relativeTime(entity.state)` or `helpers.localize(entity)`

### Features

* **helpers:** all template functions are now available through the `helpers` object ([f22ed69](https://github.com/custom-cards/button-card/commit/f22ed6982f09d1ffbc303a14f81a9a6345acd274))


### Bug Fixes

* `group_expand` now works even if the entity is not a `group.xxx` ([f192ded](https://github.com/custom-cards/button-card/commit/f192ded67f092a47d4bafe2c0fec2d8ccc55dc44)), closes [#645](https://github.com/custom-cards/button-card/issues/645)

## [4.0.0-dev.13](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.12...v4.0.0-dev.13) (2023-07-26)


### Bug Fixes

* **templates:** `variables` was `undefined` if none where provided. ([fad332b](https://github.com/custom-cards/button-card/commit/fad332b80d0fe910fa99e13e1e291ffa4b65188e)), closes [#718](https://github.com/custom-cards/button-card/issues/718)

## [4.0.0-dev.12](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.11...v4.0.0-dev.12) (2023-07-26)


### Bug Fixes

* icon would be cut with card height defined ([19f8393](https://github.com/custom-cards/button-card/commit/19f83931939a8c15bd9e1174f11c0e52dd451bf8)), closes [#731](https://github.com/custom-cards/button-card/issues/731)

## [4.0.0-dev.11](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.10...v4.0.0-dev.11) (2023-07-26)


### Features

* **templates:** new `relativeTime` function to display a relative time in a template and update it automatically ([965a3d7](https://github.com/custom-cards/button-card/commit/965a3d7b97b9fe1d155029dd6156f7a2f051f5a9)), closes [#701](https://github.com/custom-cards/button-card/issues/701)


### Bug Fixes

* ha-state-icon CSS selector was wrong ([a1bb39a](https://github.com/custom-cards/button-card/commit/a1bb39a71c55dca505d4b1a7d820229e26d4e0eb))
* tooltip would show over everything ([1bc8f99](https://github.com/custom-cards/button-card/commit/1bc8f9950159a260536d6918b55c3cb15eb7bb04))
* **templates:** don't use the `numeric_precision` from the card config for `localize` in js templates by default ([2cc384f](https://github.com/custom-cards/button-card/commit/2cc384f9dc5cb91a88a31b363db6083147092bb5))

## [4.0.0-dev.10](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.9...v4.0.0-dev.10) (2023-07-25)


### Bug Fixes

* **color:** main config `color` was broken ([b93c996](https://github.com/custom-cards/button-card/commit/b93c9969c2d1d9be9486edc1607a11635b03c29a))

## [4.0.0-dev.9](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.8...v4.0.0-dev.9) (2023-07-24)


### Bug Fixes

* numerical states would not follow HA's format ([72d7c41](https://github.com/custom-cards/button-card/commit/72d7c4133ff96713ecbe42168db0d6732b82510c)), closes [#662](https://github.com/custom-cards/button-card/issues/662)

## [4.0.0-dev.8](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.7...v4.0.0-dev.8) (2023-07-24)


### Features

* Force the `numeric_precision` for states which are numbers ([24d75c2](https://github.com/custom-cards/button-card/commit/24d75c2651c9e6b3b080b1c2561bda2c30a2f294))
* **action:** `repeat_limit` for `hold_action` ([73c216f](https://github.com/custom-cards/button-card/commit/73c216f1bf82c104848bb5d7aef2d91ba3597a95)), closes [#564](https://github.com/custom-cards/button-card/issues/564) [#555](https://github.com/custom-cards/button-card/issues/555)
* new helper functions for date/time in templates ([2b75993](https://github.com/custom-cards/button-card/commit/2b75993f22e4624776c839bfa9dafe1ddde7660d)), closes [#701](https://github.com/custom-cards/button-card/issues/701)


### Bug Fixes

* ha-icon (if in custom_fields) size was weird ([a448c8e](https://github.com/custom-cards/button-card/commit/a448c8e826605d17591beebd4a230d0287cdf945))

## [4.0.0-dev.7](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.6...v4.0.0-dev.7) (2023-07-24)


### Bug Fixes

* non string fiels would error with an unsafeHTML error ([d65c347](https://github.com/custom-cards/button-card/commit/d65c34757a20859a8c3c70fd2b612bfe818a662a)), closes [#725](https://github.com/custom-cards/button-card/issues/725)

## [4.0.0-dev.6](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.5...v4.0.0-dev.6) (2023-07-24)


### ⚠ BREAKING CHANGES

* **hacs:** Minimum required HA Version is now 2023.7

### Features

* Support for localization in templates ([5de2dc9](https://github.com/custom-cards/button-card/commit/5de2dc906781f46a952377d40ba77d75728f19e3))


### Bug Fixes

* custom fields would sometime throw unsafeHTML errors ([c67e1d5](https://github.com/custom-cards/button-card/commit/c67e1d550c79bc6610e1592c95e509cfc6a06fa5)), closes [#725](https://github.com/custom-cards/button-card/issues/725)
* **hacs:** minimum HA version 2023.7 ([db3b394](https://github.com/custom-cards/button-card/commit/db3b394fa6e970599d58c51d0caaa0ab2afbda1d))

## [4.0.0-dev.5](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.4...v4.0.0-dev.5) (2023-07-24)


### Bug Fixes

* optimize contrast color compute ([35109c3](https://github.com/custom-cards/button-card/commit/35109c3d5c8454958f67be706026e73786f853bc))
* Some cards with child cards wouldn't be clickable ([9f21c58](https://github.com/custom-cards/button-card/commit/9f21c58dacf5605851ef3ab2d936ef8f35d0b783))

## [4.0.0-dev.4](https://github.com/custom-cards/button-card/compare/v4.0.0-dev.3...v4.0.0-dev.4) (2023-07-24)


### Bug Fixes

* text/icon contrast when using label-card ([01e199b](https://github.com/custom-cards/button-card/commit/01e199b18b9caa31d4bc1a43c5a143e8d40f2836))

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
