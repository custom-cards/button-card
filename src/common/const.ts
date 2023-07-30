export const UNAVAILABLE = 'unavailable';
export const BINARY_STATE_ON = 'on';
export const BINARY_STATE_OFF = 'off';
const arrayLiteralIncludes =
  <T extends readonly unknown[]>(array: T) =>
  (searchElement: unknown, fromIndex?: number): searchElement is T[number] =>
    array.includes(searchElement as T[number], fromIndex);

export const UNKNOWN = 'unknown';
export const ON = 'on';
export const OFF = 'off';

export const UNAVAILABLE_STATES = [UNAVAILABLE, UNKNOWN] as const;
export const OFF_STATES = [UNAVAILABLE, UNKNOWN, OFF] as const;

export const isUnavailableState = arrayLiteralIncludes(UNAVAILABLE_STATES);
export const isOffState = arrayLiteralIncludes(OFF_STATES);

export const DOMAINS_TOGGLE = new Set(['fan', 'input_boolean', 'light', 'switch', 'group', 'automation', 'humidifier']);

export const AUTO_COLORS = ['auto', 'auto-no-temperature'];

export const OVERRIDE_CARD_BACKGROUND_COLOR_COLOR_TYPE = ['card', 'label-card'];
export const OVERRIDE_CARD_BACKGROUND_COLOR_COLORS = ['--ha-card-background', '--card-background-color'];

export const DEFAULT_COLOR = 'var(--primary-text-color)';
