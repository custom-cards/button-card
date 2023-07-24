import { fireEvent } from './fire-event';

const SPECIAL_TYPES = new Set(['call-service', 'divider', 'section', 'weblink', 'cast', 'select']);
const DOMAIN_TO_ELEMENT_TYPE = {
  alert: 'toggle',
  automation: 'toggle',
  climate: 'climate',
  cover: 'cover',
  fan: 'toggle',
  group: 'group',
  input_boolean: 'toggle',
  input_number: 'input-number',
  input_select: 'input-select',
  input_text: 'input-text',
  light: 'toggle',
  lock: 'lock',
  media_player: 'media-player',
  remote: 'toggle',
  scene: 'scene',
  script: 'script',
  sensor: 'sensor',
  timer: 'timer',
  switch: 'toggle',
  vacuum: 'toggle',
  // Temporary. Once climate is rewritten,
  // water heater should get it's own row.
  water_heater: 'climate',
  input_datetime: 'input-datetime',
};

declare global {
  // eslint-disable-next-line
  interface HASSDomEvents {
    'll-rebuild': Record<string, unknown>;
    'll-badge-rebuild': Record<string, unknown>;
  }
}

export const createThing = (cardConfig, isRow = false) => {
  const _createError = (error, config) => {
    return _createThing('hui-error-card', {
      type: 'error',
      error,
      config,
    });
  };

  const _createThing = (tag, config) => {
    const element = window.document.createElement(tag);
    try {
      // Preventing an error-card infinity loop: https://github.com/custom-cards/custom-card-helpers/issues/54
      if (!element.setConfig) return;
      element.setConfig(config);
    } catch (err) {
      console.error(tag, err);
      return _createError((err as Error).message, config);
    }
    return element;
  };

  if (!cardConfig || typeof cardConfig !== 'object' || (!isRow && !cardConfig.type))
    return _createError('No type defined', cardConfig);
  let tag = cardConfig.type;
  if (tag && tag.startsWith('custom:')) {
    tag = tag.substr('custom:'.length);
  } else if (isRow) {
    if (SPECIAL_TYPES.has(tag)) {
      tag = `hui-${tag}-row`;
    } else {
      if (!cardConfig.entity) {
        return _createError('Invalid config given.', cardConfig);
      }

      const domain = cardConfig.entity.split('.', 1)[0];
      tag = `hui-${DOMAIN_TO_ELEMENT_TYPE[domain] || 'text'}-entity-row`;
    }
  } else {
    tag = `hui-${tag}-card`;
  }

  if (customElements.get(tag)) return _createThing(tag, cardConfig);

  // If element doesn't exist (yet) create an error
  const element = _createError(`Custom element doesn't exist: ${cardConfig.type}.`, cardConfig);
  element.style.display = 'None';
  const timer = setTimeout(() => {
    element.style.display = '';
  }, 2000);
  // Remove error if element is defined later
  customElements.whenDefined(cardConfig.type).then(() => {
    clearTimeout(timer);
    fireEvent(element, 'll-rebuild', {}, element);
  });

  return element;
};
