/* eslint-disable @typescript-eslint/no-explicit-any */
import { LovelaceCardConfig, LovelaceCard } from './lovelace';
import { HassServiceTarget } from 'home-assistant-js-websocket';

export interface ButtonCardConfig {
  template?: string | string[];
  triggers_update?: string[] | 'all';
  group_expand: boolean;
  type: string;
  entity?: string;
  name?: string;
  icon?: string;
  color_type: ColorType;
  color?: 'auto' | 'auto-no-temperature' | string;
  size: string;
  aspect_ratio?: string;
  lock: LockConfig;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  show_name?: boolean;
  show_state?: boolean;
  show_icon?: boolean;
  show_units?: boolean;
  show_entity_picture?: boolean;
  show_last_changed?: boolean;
  show_label?: boolean;
  show_live_stream?: boolean;
  label?: string;
  numeric_precision?: number;
  entity_picture?: string;
  units?: string;
  state_display?: string;
  state?: StateConfig[];
  styles?: StylesConfig;
  confirmation?: string;
  layout: Layout;
  entity_picture_style?: CssStyleConfig[];
  custom_fields?: CustomFields;
  variables?: Variables;
  extra_styles?: string;
  card_size: number;
  tooltip?: string;
}

export interface ExternalButtonCardConfig {
  template?: string | string[];
  triggers_update?: string[] | 'all';
  group_expand?: boolean;
  entity?: string;
  name?: string;
  icon?: string;
  color_type?: 'icon' | 'card' | 'label-card' | 'blank-card';
  color?: 'auto' | 'auto-no-temperature' | string;
  size?: string;
  aspect_ratio?: string;
  lock?: LockConfig;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  show_name?: boolean;
  show_state?: boolean;
  show_icon?: boolean;
  show_units?: boolean;
  show_entity_picture?: boolean;
  show_last_changed?: boolean;
  show_label?: boolean;
  show_live_stream?: boolean;
  label?: string;
  entity_picture?: string;
  units?: string;
  state_display?: string;
  state?: StateConfig[];
  styles?: StylesConfig;
  confirmation?: string;
  layout?: Layout;
  entity_picture_style?: CssStyleConfig[];
  custom_fields?: CustomFields;
  variables?: Variables;
  extra_styles?: string;
  card_size?: number;
  tooltip?: string;
}

export type Layout =
  | 'vertical'
  | 'icon_name_state'
  | 'name_state'
  | 'icon_name'
  | 'icon_state'
  | 'icon_name_state2nd'
  | 'icon_state_name2nd'
  | 'icon_label';

export type ColorType = 'icon' | 'card' | 'label-card' | 'blank-card';

export interface LockConfig {
  enabled: boolean;
  duration: number;
  unlock: 'tap' | 'double_tap' | 'hold';
  exemptions?: (ExemptionUserConfig | ExemptionUsernameConfig)[];
}

export interface ExemptionUserConfig {
  user: string;
}

export interface ExemptionUsernameConfig {
  username: string;
}

export interface StateConfig {
  id?: string;
  operator?: '<' | '<=' | '==' | '>=' | '>' | '!=' | 'regex' | 'template' | 'default';
  value?: any;
  name?: string;
  icon?: string;
  color?: 'auto' | 'auto-no-temperature' | string;
  entity_picture_style?: CssStyleConfig[];
  entity_picture?: string;
  styles?: StylesConfig;
  spin?: boolean;
  label?: string;
  custom_fields?: CustomFields;
  state_display?: string;
}

export interface StylesConfig {
  card?: CssStyleConfig[];
  entity_picture?: CssStyleConfig[];
  icon?: CssStyleConfig[];
  name?: CssStyleConfig[];
  state?: CssStyleConfig[];
  label?: CssStyleConfig[];
  grid?: CssStyleConfig[];
  img_cell?: CssStyleConfig[];
  lock?: CssStyleConfig[];
  tooltip?: CssStyleConfig[];
  custom_fields?: CustomStyleConfig;
}

export interface CustomStyleConfig {
  [key: string]: CssStyleConfig[];
}

export interface CssStyleConfig {
  [key: string]: any;
}

export interface CustomFields {
  [key: string]: string | CustomFieldCard;
}

export interface CustomFieldCard {
  card: LovelaceCardConfig;
  do_not_eval?: boolean;
}

export interface Variables {
  [key: string]: any;
}

export interface ButtonCardEmbeddedCards {
  [key: string]: LovelaceCard;
}

export interface ButtonCardEmbeddedCardsConfig {
  [key: string]: string | undefined;
}

export interface ToggleActionConfig extends BaseActionConfig {
  action: 'toggle';
}

export interface CallServiceActionConfig extends BaseActionConfig {
  action: 'call-service';
  service: string;
  target?: HassServiceTarget;
  // "service_data" is kept for backwards compatibility. Replaced by "data".
  service_data?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

export interface NavigateActionConfig extends BaseActionConfig {
  action: 'navigate';
  navigation_path: string;
}

export interface UrlActionConfig extends BaseActionConfig {
  action: 'url';
  url_path: string;
}

export interface MoreInfoActionConfig extends BaseActionConfig {
  action: 'more-info';
}

export interface NoActionConfig extends BaseActionConfig {
  action: 'none';
}

export interface CustomActionConfig extends BaseActionConfig {
  action: 'fire-dom-event';
}

export interface AssistActionConfig extends BaseActionConfig {
  action: 'assist';
  pipeline_id?: string;
  start_listening?: boolean;
}

export interface BaseActionConfig {
  action: string;
  confirmation?: ConfirmationRestrictionConfig;
  repeat?: number;
  repeat_limit?: number;
}

export interface ConfirmationRestrictionConfig {
  text?: string;
  exemptions?: RestrictionConfig[];
}

export interface RestrictionConfig {
  user: string;
}

export type ActionConfig =
  | ToggleActionConfig
  | CallServiceActionConfig
  | NavigateActionConfig
  | UrlActionConfig
  | MoreInfoActionConfig
  | AssistActionConfig
  | NoActionConfig
  | CustomActionConfig;

export type Constructor<T = any> = new (...args: any[]) => T;
