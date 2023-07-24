import { PropertyValues } from 'lit';
import tinycolor, { TinyColor } from '@ctrl/tinycolor';
import { HomeAssistant } from './types/homeassistant';
import { LovelaceConfig } from './types/lovelace';
import { StateConfig } from './types/types';
import { HassEntity, HassEntityAttributeBase, HassEntityBase } from 'home-assistant-js-websocket';
import { OFF, UNAVAILABLE, isUnavailableState } from './common/const';

export const atLeastVersion = (version: string, major: number, minor: number): boolean => {
  const [haMajor, haMinor] = version.split('.', 2);
  return Number(haMajor) > major || (Number(haMajor) === major && Number(haMinor) >= minor);
};

export function computeDomain(entityId: string): string {
  return entityId.substr(0, entityId.indexOf('.'));
}

export function computeEntity(entityId: string): string {
  return entityId.substr(entityId.indexOf('.') + 1);
}

export const computeStateDomain = (stateObj: HassEntity) => computeDomain(stateObj.entity_id);

export function getColorFromVariable(elt: Element, color: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colorArray: string[] = [];
  let result = color;
  if (color.trim().substring(0, 3) === 'var') {
    color.split(',').forEach((singleColor) => {
      const matches = singleColor.match(/var\(\s*([a-zA-Z0-9-]*)/);
      if (matches) {
        colorArray.push(matches[1]);
      }
    });

    colorArray.some((color) => {
      const card = window.getComputedStyle(elt).getPropertyValue(color);
      if (card) {
        result = card;
        return true;
      }
      return false;
    });
  }
  return result;
}

export function getFontColorBasedOnBackgroundColor(elt: Element, backgroundColor: string): string {
  const bgLuminance = new TinyColor(getColorFromVariable(elt, backgroundColor)).getLuminance();
  const light = new TinyColor({ r: 225, g: 225, b: 225 });
  const lightLuminance = light.getLuminance();
  const dark = new TinyColor({ r: 28, g: 28, b: 28 });
  const darkLuminance = dark.getLuminance();

  if (bgLuminance === 0) {
    return light.toRgbString();
  }

  const whiteContrast = (Math.max(bgLuminance, lightLuminance) + 0.05) / Math.min(bgLuminance, lightLuminance + 0.05);
  const blackContrast = (Math.max(bgLuminance, darkLuminance) + 0.05) / Math.min(bgLuminance, darkLuminance + 0.05);
  return whiteContrast > blackContrast ? light.toRgbString() : dark.toRgbString();
}

export function getLightColorBasedOnTemperature(current: number, min: number, max: number): string {
  const high = new TinyColor('rgb(255, 160, 0)'); // orange-ish
  const low = new TinyColor('rgb(166, 209, 255)'); // blue-ish
  const middle = new TinyColor('white');
  const mixAmount = ((current - min) / (max - min)) * 100;
  if (mixAmount < 50) {
    return tinycolor(low)
      .mix(middle, mixAmount * 2)
      .toRgbString();
  } else {
    return tinycolor(middle)
      .mix(high, (mixAmount - 50) * 2)
      .toRgbString();
  }
}

export function buildNameStateConcat(name: string | undefined, stateString: string | undefined): string | undefined {
  if (!name && !stateString) {
    return undefined;
  }
  let nameStateString: string | undefined;
  if (stateString) {
    if (name) {
      nameStateString = `${name}: ${stateString}`;
    } else {
      nameStateString = stateString;
    }
  } else {
    nameStateString = name;
  }
  return nameStateString;
}

export function applyBrightnessToColor(elt: Element, color: string, brightness: number): string {
  const colorObj = new TinyColor(getColorFromVariable(elt, color));
  if (colorObj.isValid) {
    const validColor = colorObj.mix('black', 100 - brightness).toString();
    if (validColor) return validColor;
  }
  return color;
}

// Check if config or Entity changed
export function myHasConfigOrEntityChanged(element: any, changedProps: PropertyValues): boolean {
  if (changedProps.has('_config')) {
    return true;
  }

  const oldHass = changedProps.get('_hass') as HomeAssistant | undefined;
  if (oldHass) {
    function hasChanged(elt: string): boolean {
      return oldHass?.states[elt] !== element._hass!.states[elt];
    }
    return element._entities.some(hasChanged);
  }
  return false;
}

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation and filtering.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
export function mergeDeep(...objects: any): any {
  const isObject = (obj: any) => obj && typeof obj === 'object';

  return objects.reduce((prev: any, obj: any) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        /* eslint no-param-reassign: 0 */
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}

export function mergeStatesById(
  intoStates: StateConfig[] | undefined,
  fromStates: StateConfig[] | undefined,
): StateConfig[] {
  let resultStateConfigs: StateConfig[] = [];
  if (intoStates) {
    intoStates.forEach((intoState) => {
      let localState = intoState;
      if (fromStates) {
        fromStates.forEach((fromState) => {
          if (fromState.id && intoState.id && fromState.id == intoState.id)
            localState = mergeDeep(localState, fromState);
        });
      }
      resultStateConfigs.push(localState);
    });
  }
  if (fromStates) {
    /* eslint eqeqeq: 0 no-confusing-arrow: 0 */
    resultStateConfigs = resultStateConfigs.concat(
      fromStates.filter((x) => (!intoStates ? true : !intoStates.find((y) => (y.id && x.id ? y.id == x.id : false)))),
    );
  }
  return resultStateConfigs;
}

export function getLovelaceCast(): any {
  let root: any = document.querySelector('hc-main');
  root = root && root.shadowRoot;
  root = root && root.querySelector('hc-lovelace');
  root = root && root.shadowRoot;
  root = root && (root.querySelector('hui-view') || root.querySelector('hui-panel-view'));
  if (root) {
    const ll = root.lovelace;
    ll.current_view = root.___curView;
    return ll;
  }
  return null;
}

export function getLovelace(): LovelaceConfig | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let root: any = document.querySelector('home-assistant');
  root = root && root.shadowRoot;
  root = root && root.querySelector('home-assistant-main');
  root = root && root.shadowRoot;
  root = root && root.querySelector('app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver');
  root = (root && root.shadowRoot) || root;
  root = root && root.querySelector('ha-panel-lovelace');
  root = root && root.shadowRoot;
  root = root && root.querySelector('hui-root');
  if (root) {
    const ll = root.lovelace;
    ll.current_view = root.___curView;
    return ll;
  }
  return null;
}

export function slugify(value: string, delimiter = '_'): string {
  const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;';
  const b = `aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz${delimiter}${delimiter}${delimiter}${delimiter}${delimiter}${delimiter}`;
  const p = new RegExp(a.split('').join('|'), 'g');

  return value
    .toString()
    .toLowerCase()
    .replace(/\s+/g, delimiter) // Replace spaces with delimiter
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, `${delimiter}and${delimiter}`) // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/-/g, delimiter) // Replace - with delimiter
    .replace(new RegExp(`(${delimiter})\\1+`, 'g'), '$1') // Replace multiple delimiters with single delimiter
    .replace(new RegExp(`^${delimiter}+`), '') // Trim delimiter from start of text
    .replace(new RegExp(`${delimiter}+$`), ''); // Trim delimiter from end of text
}

interface GroupEntityAttributes extends HassEntityAttributeBase {
  entity_id: string[];
  order: number;
  auto?: boolean;
  view?: boolean;
  control?: 'hidden';
}
export interface GroupEntity extends HassEntityBase {
  attributes: GroupEntityAttributes;
}

export const computeGroupDomain = (stateObj: GroupEntity): string | undefined => {
  const entityIds = stateObj.attributes.entity_id || [];
  const uniqueDomains = [...new Set(entityIds.map((entityId) => computeDomain(entityId)))];
  return uniqueDomains.length === 1 ? uniqueDomains[0] : undefined;
};

export function stateActive(stateObj: HassEntity | undefined, state?: string): boolean {
  if (stateObj === undefined) {
    return false;
  }
  const domain = computeDomain(stateObj.entity_id);
  const compareState = state !== undefined ? state : stateObj?.state;

  if (['button', 'event', 'input_button', 'scene'].includes(domain)) {
    return compareState !== UNAVAILABLE;
  }

  if (isUnavailableState(compareState)) {
    return false;
  }

  // The "off" check is relevant for most domains, but there are exceptions
  // such as "alert" where "off" is still a somewhat active state and
  // therefore gets a custom color and "idle" is instead the state that
  // matches what most other domains consider inactive.
  if (compareState === OFF && domain !== 'alert') {
    return false;
  }

  // Custom cases
  switch (domain) {
    case 'alarm_control_panel':
      return compareState !== 'disarmed';
    case 'alert':
      // "on" and "off" are active, as "off" just means alert was acknowledged but is still active
      return compareState !== 'idle';
    case 'cover':
      return compareState !== 'closed';
    case 'device_tracker':
    case 'person':
      return compareState !== 'not_home';
    case 'lock':
      return compareState !== 'locked';
    case 'media_player':
      return compareState !== 'standby';
    case 'vacuum':
      return !['idle', 'docked', 'paused'].includes(compareState);
    case 'plant':
      return compareState === 'problem';
    case 'group':
      return ['on', 'home', 'open', 'locked', 'problem'].includes(compareState);
    case 'timer':
      return compareState === 'active';
    case 'camera':
      return compareState === 'streaming';
  }

  return true;
}

export const batteryStateColorProperty = (state: string): string | undefined => {
  const value = Number(state);
  if (isNaN(value)) {
    return undefined;
  }
  if (value >= 70) {
    return '--state-sensor-battery-high-color';
  }
  if (value >= 30) {
    return '--state-sensor-battery-medium-color';
  }
  return '--state-sensor-battery-low-color';
};

export function computeCssVariable(props: string | string[]): string | undefined {
  if (Array.isArray(props)) {
    return props
      .reverse()
      .reduce<string | undefined>((str, variable) => `var(${variable}${str ? `, ${str}` : ''})`, undefined);
  }
  return `var(${props})`;
}

export function computeCssValue(prop: string | string[], computedStyles: CSSStyleDeclaration): string | undefined {
  if (Array.isArray(prop)) {
    for (const property of prop) {
      const value = computeCssValue(property, computedStyles);
      if (value) return value;
    }
    return undefined;
  }

  if (!prop.endsWith('-color')) {
    return undefined;
  }
  return computedStyles.getPropertyValue(prop).trim() || undefined;
}

export function durationToSeconds(duration: string): number {
  const parts = duration.split(':').map(Number);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

const leftPad = (num: number) => (num < 10 ? `0${num}` : num);

export function secondsToDuration(d: number): string | null {
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  if (h > 0) {
    return `${h}:${leftPad(m)}:${leftPad(s)}`;
  }
  if (m > 0) {
    return `${m}:${leftPad(s)}`;
  }
  if (s > 0) {
    return '' + s;
  }
  return null;
}

export function isNumericFromAttributes(attributes: HassEntityAttributeBase): boolean {
  return !!attributes.unit_of_measurement || !!attributes.state_class;
}
