import { HassEntity } from 'home-assistant-js-websocket';
import { LocalizeFunc, HomeAssistant, formatDate, formatTime, formatDateTime } from 'custom-card-helpers';
import { computeDomain } from './helpers';
import { atLeastVersion } from './at_least_version';

const UNAVAILABLE = 'unavailable';
const UNKNOWN = 'unknown';

function legacyComputeStateDisplay(localize: LocalizeFunc, stateObj: HassEntity): string | undefined {
  let display: string | undefined;
  const domain = computeDomain(stateObj.entity_id);

  if (domain === 'binary_sensor') {
    // Try device class translation, then default binary sensor translation
    if (stateObj.attributes.device_class) {
      display = localize(`state.${domain}.${stateObj.attributes.device_class}.${stateObj.state}`);
    }

    if (!display) {
      display = localize(`state.${domain}.default.${stateObj.state}`);
    }
  } else if (stateObj.attributes.unit_of_measurement && !['unknown', 'unavailable'].includes(stateObj.state)) {
    display = stateObj.state;
  } else if (domain === 'zwave') {
    if (['initializing', 'dead'].includes(stateObj.state)) {
      display = localize(`state.zwave.query_stage.${stateObj.state}`, 'query_stage', stateObj.attributes.query_stage);
    } else {
      display = localize(`state.zwave.default.${stateObj.state}`);
    }
  } else {
    display = localize(`state.${domain}.${stateObj.state}`);
  }

  // Fall back to default, component backend translation, or raw state if nothing else matches.
  if (!display) {
    display =
      localize(`state.default.${stateObj.state}`) ||
      localize(`component.${domain}.state.${stateObj.state}`) ||
      stateObj.state;
  }

  return display;
}

export const myComputeStateDisplay = (
  hass: HomeAssistant,
  localize: LocalizeFunc,
  stateObj: HassEntity,
  language: string,
): string | undefined => {
  if (!atLeastVersion(hass.config.version, 0, 109)) {
    return legacyComputeStateDisplay(localize, stateObj);
  }

  if (stateObj.state === UNKNOWN || stateObj.state === UNAVAILABLE) {
    return localize(`state.default.${stateObj.state}`);
  }

  if (stateObj.attributes.unit_of_measurement) {
    return `${stateObj.state} ${stateObj.attributes.unit_of_measurement}`;
  }

  const domain = computeDomain(stateObj.entity_id);

  if (domain === 'input_datetime') {
    let date: Date;
    if (!stateObj.attributes.has_time) {
      date = new Date(stateObj.attributes.year, stateObj.attributes.month - 1, stateObj.attributes.day);
      return formatDate(date, language);
    }
    if (!stateObj.attributes.has_date) {
      const now = new Date();
      date = new Date(
        // Due to bugs.chromium.org/p/chromium/issues/detail?id=797548
        // don't use artificial 1970 year.
        now.getFullYear(),
        now.getMonth(),
        now.getDay(),
        stateObj.attributes.hour,
        stateObj.attributes.minute,
      );
      return formatTime(date, language);
    }

    date = new Date(
      stateObj.attributes.year,
      stateObj.attributes.month - 1,
      stateObj.attributes.day,
      stateObj.attributes.hour,
      stateObj.attributes.minute,
    );
    return formatDateTime(date, language);
  }

  if (!atLeastVersion(hass.config.version, 2023, 4)) {
    return (
      // Return device class translation
      (stateObj.attributes.device_class &&
        localize(`component.${domain}.state.${stateObj.attributes.device_class}.${stateObj.state}`)) ||
      // Return default translation
      localize(`component.${domain}.state._.${stateObj.state}`) ||
      // We don't know! Return the raw state.
      stateObj.state
    );
  }
  return (
    // Return device class translation
    (stateObj.attributes.device_class &&
      localize(`component.${domain}.entity_component.${stateObj.attributes.device_class}.state.${stateObj.state}`)) ||
    // Return default translation
    localize(`component.${domain}.entity_component._.state.${stateObj.state}`) ||
    // We don't know! Return the raw state.
    stateObj.state
  );
};
