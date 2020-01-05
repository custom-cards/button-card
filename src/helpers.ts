import { PropertyValues } from 'lit-element';
import tinycolor, { TinyColor } from '@ctrl/tinycolor';
import { HomeAssistant } from 'custom-card-helpers';
import { StateConfig } from './types';

export function computeDomain(entityId: string): string {
  return entityId.substr(0, entityId.indexOf('.'));
}

export function computeEntity(entityId: string): string {
  return entityId.substr(entityId.indexOf('.') + 1);
}

export function getColorFromVariable(color: string): string {
  if (color.substring(0, 3) === 'var') {
    return window.getComputedStyle(document.documentElement)
      .getPropertyValue(color.substring(4).slice(0, -1)).trim();
  }
  return color;
}

export function getFontColorBasedOnBackgroundColor(backgroundColor: string): string {
  const colorObj = new TinyColor(getColorFromVariable(backgroundColor));
  if (colorObj.isValid && colorObj.getLuminance() > 0.5) {
    return 'rgb(62, 62, 62)'; // bright colors - black font
  } else {
    return 'rgb(234, 234, 234)';// dark colors - white font
  }
}

export function getLightColorBasedOnTemperature(
  current: number,
  min: number,
  max: number,
): string {
  const high = new TinyColor('rgb(255, 160, 0)'); // orange-ish
  const low = new TinyColor('rgb(166, 209, 255)'); // blue-ish
  const middle = new TinyColor('white');
  const mixAmount = (current - min) / (max - min) * 100;
  if (mixAmount < 50) {
    return tinycolor(low).mix(middle, mixAmount * 2).toRgbString();
  } else {
    return tinycolor(middle).mix(high, (mixAmount - 50) * 2).toRgbString();
  }
}

export function buildNameStateConcat(
  name: string | undefined, stateString: string | undefined,
): string | undefined {
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

export function applyBrightnessToColor(
  color: string, brightness: number,
): string {
  const colorObj = new TinyColor(getColorFromVariable(color));
  if (colorObj.isValid) {
    const validColor = colorObj.mix('black', 100 - brightness).toString();
    if (validColor) return validColor;
  }
  return color;
}

// Check if config or Entity changed
export function myHasConfigOrEntityChanged(
  element: any,
  changedProps: PropertyValues,
  forceUpdate: Boolean,
): boolean {
  if (changedProps.has('config') || forceUpdate) {
    return true;
  }

  if (element.config!.entity) {
    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (oldHass) {
      return (
        oldHass.states[element.config!.entity]
        !== element.hass!.states[element.config!.entity]
      );
    }
    return true;
  } else {
    return false;
  }
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
      fromStates.filter(
        x => !intoStates
          ? true
          : !intoStates.find(y => y.id && x.id ? y.id == x.id : false),
      ),
    );
  }
  return resultStateConfigs;
}

export function getLovelaceCast() {
  let root: any = document.querySelector('hc-main');
  root = root && root.shadowRoot;
  root = root && root.querySelector('hc-lovelace');
  root = root && root.shadowRoot;
  root = root && root.querySelector('hui-view');
  if (root) {
    const ll = root.lovelace;
    ll.current_view = root.___curView;
    return ll;
  }
  return null;
}
