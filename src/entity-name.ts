import { HassEntity } from 'home-assistant-js-websocket';
import { HomeAssistant } from './types/homeassistant';
import { EntityName } from './types/types';

function atLeastVersion(hass: HomeAssistant | undefined, major: number, minor: number): boolean {
  const [haMajor, haMinor] = (hass?.config?.version ?? '').split('.', 2);
  return Number(haMajor) > major || (Number(haMajor) === major && Number(haMinor) >= minor);
}

/**
 * `hass.formatEntityName` only accepts a card's `name` option (a user string, a
 * structured name, or undefined) from HA 2026.4. Earlier versions expose the same
 * helper with an incompatible signature - bare type strings in 2025.10, and only
 * structured items between 2025.11 and 2026.3 - so feature detection is not
 * enough and the version has to be checked.
 */
function supportsEntityNames(hass: HomeAssistant | undefined): boolean {
  // A hass can report a recent version without carrying the helper (a test
  // harness, or a hass that has not finished initialising), and calling it
  // then throws - so the version gate alone is not enough.
  if (!hass || typeof (hass as { formatEntityName?: unknown }).formatEntityName !== 'function') {
    return false;
  }
  return atLeastVersion(hass, 2026, 4);
}

type HassWithEntityNames = HomeAssistant & {
  formatEntityName: (stateObj: HassEntity, name: EntityName | undefined) => string;
};

/**
 * Resolves a `name` option against the entity's registry context (entity,
 * device, area, floor). Falls back to the friendly name on Home Assistant
 * versions that cannot resolve a structured name.
 */
export function computeEntityName(
  hass: HomeAssistant | undefined,
  stateObj: HassEntity | undefined,
  name: EntityName | undefined,
): string | undefined {
  // A configured empty name has always meant "use Home Assistant's name", but
  // formatEntityName returns any string verbatim - including the empty one, which
  // would blank the label. Normalise it to undefined so the formatter composes.
  if (name === '') name = undefined;

  // A string name is the override, exactly as formatEntityName treats it.
  if (typeof name === 'string') return name;
  if (!stateObj) return undefined;
  if (hass && supportsEntityNames(hass)) {
    return (hass as HassWithEntityNames).formatEntityName(stateObj, name) || undefined;
  }
  // A structured name cannot be resolved here, so fall back to the friendly name.
  return stateObj.attributes?.friendly_name || undefined;
}

/**
 * `formatEntityName` resolves against the entity/device/area/floor registries,
 * and HA swaps the real formatter in asynchronously once translations load.
 * Neither shows up as an entity state change, so without this a rename (or that
 * swap) leaves a rendered name stale until an unrelated update forces a render.
 */
const NAME_SOURCES = ['formatEntityName', 'entities', 'devices', 'areas', 'floors'] as const;

export function entityNamesChanged(oldHass: HomeAssistant | undefined, newHass: HomeAssistant | undefined): boolean {
  if (!oldHass || !newHass) return false;
  const before = oldHass as unknown as Record<string, unknown>;
  const after = newHass as unknown as Record<string, unknown>;
  return NAME_SOURCES.some((key) => before[key] !== after[key]);
}
