import { HassEntity } from 'home-assistant-js-websocket';
import { LocalizeFunc } from 'custom-card-helpers';
import { computeDomain } from './helpers';

export default (localize: LocalizeFunc, stateObj: HassEntity): string | undefined => {
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
};
