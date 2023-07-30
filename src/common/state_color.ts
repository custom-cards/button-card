/** Return an color representing a state. */
import { HassEntity } from 'home-assistant-js-websocket';
import { OVERRIDE_CARD_BACKGROUND_COLOR_COLOR_TYPE, OVERRIDE_CARD_BACKGROUND_COLOR_COLORS, UNAVAILABLE } from './const';
import { computeGroupDomain, GroupEntity } from '../helpers';
import { computeCssVariable } from '../helpers';
import { computeDomain, slugify } from '../helpers';
import { batteryStateColorProperty } from '../helpers';
import { stateActive } from '../helpers';
import { ColorType } from '../types/types';

const STATE_COLORED_DOMAIN = new Set([
  'alarm_control_panel',
  'alert',
  'automation',
  'binary_sensor',
  'calendar',
  'camera',
  'climate',
  'cover',
  'device_tracker',
  'fan',
  'group',
  'humidifier',
  'input_boolean',
  'light',
  'lock',
  'media_player',
  'person',
  'plant',
  'remote',
  'schedule',
  'script',
  'siren',
  'sun',
  'switch',
  'timer',
  'update',
  'vacuum',
]);

export const stateColorCss = (stateObj: HassEntity, state?: string, cardColorType?: ColorType): undefined | string => {
  const compareState = state !== undefined ? state : stateObj?.state;
  if (compareState === UNAVAILABLE) {
    return `var(--state-unavailable-color)`;
  }

  const properties = stateColorProperties(stateObj, state, cardColorType);
  if (properties) {
    return computeCssVariable(properties);
  }

  return undefined;
};

export const domainStateColorProperties = (
  domain: string,
  stateObj: HassEntity,
  state?: string,
  cardColorType?: ColorType,
): string[] => {
  const compareState = state !== undefined ? state : stateObj.state;
  const active = stateActive(stateObj, state);

  const properties: string[] = [];

  const stateKey = slugify(compareState, '_');
  const activeKey = active ? 'active' : 'inactive';

  if (cardColorType && OVERRIDE_CARD_BACKGROUND_COLOR_COLOR_TYPE.includes(cardColorType) && activeKey == 'inactive') {
    return OVERRIDE_CARD_BACKGROUND_COLOR_COLORS;
  }

  const dc = stateObj.attributes.device_class;

  if (dc) {
    properties.push(`--state-${domain}-${dc}-${stateKey}-color`);
  }

  properties.push(
    `--state-${domain}-${stateKey}-color`,
    `--state-${domain}-${activeKey}-color`,
    `--state-${activeKey}-color`,
  );

  return properties;
};

export const stateColorProperties = (
  stateObj: HassEntity,
  state?: string,
  cardColorType?: ColorType,
): string[] | undefined => {
  const compareState = state !== undefined ? state : stateObj?.state;
  const domain = computeDomain(stateObj.entity_id);
  const dc = stateObj.attributes.device_class;

  // Special rules for battery coloring
  if (domain === 'sensor' && dc === 'battery') {
    const property = batteryStateColorProperty(compareState);
    if (property) {
      return [property];
    }
  }

  // Special rules for group coloring
  if (domain === 'group') {
    const groupDomain = computeGroupDomain(stateObj as GroupEntity);
    if (groupDomain && STATE_COLORED_DOMAIN.has(groupDomain)) {
      return domainStateColorProperties(groupDomain, stateObj, state, cardColorType);
    }
  }

  if (STATE_COLORED_DOMAIN.has(domain)) {
    return domainStateColorProperties(domain, stateObj, state, cardColorType);
  }

  if (cardColorType && OVERRIDE_CARD_BACKGROUND_COLOR_COLOR_TYPE.includes(cardColorType)) {
    return OVERRIDE_CARD_BACKGROUND_COLOR_COLORS;
  }
  return undefined;
};

export const stateColorBrightness = (stateObj: HassEntity): string => {
  if (stateObj.attributes.brightness && computeDomain(stateObj.entity_id) !== 'plant') {
    // lowest brightness will be around 50% (that's pretty dark)
    const brightness = stateObj.attributes.brightness;
    return `brightness(${(brightness + 245) / 5}%)`;
  }
  return '';
};
