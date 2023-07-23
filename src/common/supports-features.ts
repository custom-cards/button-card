import { HassEntity } from 'home-assistant-js-websocket';

export const supportsFeature = (stateObj: HassEntity, feature: number): boolean =>
  supportsFeatureFromAttributes(stateObj.attributes, feature);

export const supportsFeatureFromAttributes = (
  attributes: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  },
  feature: number,
): boolean =>
  // eslint-disable-next-line no-bitwise, @typescript-eslint/no-non-null-assertion
  (attributes.supported_features! & feature) !== 0;
