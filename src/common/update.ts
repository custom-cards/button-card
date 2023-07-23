import type { HassEntityAttributeBase, HassEntityBase } from 'home-assistant-js-websocket';
import { BINARY_STATE_ON } from './const';
import { supportsFeature, supportsFeatureFromAttributes } from './supports-features';

export const UPDATE_SUPPORT_INSTALL = 1;
export const UPDATE_SUPPORT_SPECIFIC_VERSION = 2;
export const UPDATE_SUPPORT_PROGRESS = 4;
export const UPDATE_SUPPORT_BACKUP = 8;
export const UPDATE_SUPPORT_RELEASE_NOTES = 16;

interface UpdateEntityAttributes extends HassEntityAttributeBase {
  auto_update: boolean | null;
  installed_version: string | null;
  in_progress: boolean | number;
  latest_version: string | null;
  release_summary: string | null;
  release_url: string | null;
  skipped_version: string | null;
  title: string | null;
}

export interface UpdateEntity extends HassEntityBase {
  attributes: UpdateEntityAttributes;
}

export const updateUsesProgress = (entity: UpdateEntity): boolean =>
  updateUsesProgressFromAttributes(entity.attributes);

export const updateUsesProgressFromAttributes = (attributes: { [key: string]: any }): boolean =>
  supportsFeatureFromAttributes(attributes, UPDATE_SUPPORT_PROGRESS) && typeof attributes.in_progress === 'number';

export const updateCanInstall = (entity: UpdateEntity, showSkipped = false): boolean =>
  (entity.state === BINARY_STATE_ON || (showSkipped && Boolean(entity.attributes.skipped_version))) &&
  supportsFeature(entity, UPDATE_SUPPORT_INSTALL);

export const updateIsInstalling = (entity: UpdateEntity): boolean =>
  updateUsesProgress(entity) || !!entity.attributes.in_progress;

export const updateIsInstallingFromAttributes = (attributes: { [key: string]: any }): boolean =>
  updateUsesProgressFromAttributes(attributes) || !!attributes.in_progress;
