import { PropertyValues } from 'lit-element';
import { TinyColor } from '@ctrl/tinycolor';
import { HomeAssistant } from './types';

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
    const validColor = colorObj.darken(100 - brightness).toString();
    if (validColor) return validColor;
  }
  return color;
}

// Check if config or Entity changed
export function hasConfigOrEntityChanged(
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
