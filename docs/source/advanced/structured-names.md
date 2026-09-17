# Structured names

!!! info "Requires Home Assistant 2026.4 or later"
    On earlier versions a structured `name` falls back to the entity's friendly name.

Home Assistant composes an entity's display name out of its registry context
(entity, device, area, floor) rather than one `friendly_name` string. A `name`
can be a list of those parts instead of a plain string, so it keeps following
renames and matches what the built-in cards show.

```yaml
type: custom:button-card
entity: sensor.living_room_thermostat_temperature
name:
  - type: area
  - type: entity
```

Available part types are `entity`, `device`, `area`, `floor`,
and `text` for a literal:

```yaml
name:
  - type: text
    text: 'Indoor'
  - type: entity
```

Parts that resolve to nothing are dropped, so the surrounding parts still
render. Leaving `name` out uses the entity's own composed name.

!!! warning "Structured names are not [JS templates](js-templates.md)"
    A string `name` can still be a JS template. A structured `name` is resolved
    from the registry instead and is never evaluated as a template, so the two
    cannot be combined in one value. Use a `text` part for literal text, or keep
    a string `name` if you need a template.

See the [Home Assistant developer documentation](https://developers.home-assistant.io/docs/frontend/data#hassformatentitynamestateobj-name-options)
for the full reference.
