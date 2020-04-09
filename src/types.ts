import { ActionConfig } from 'custom-card-helpers';

export interface ButtonCardConfig {
  template?: string;
  triggers_update?: string[] | 'all';
  type: string;
  entity?: string;
  name?: string;
  icon?: string;
  color_type: 'icon' | 'card' | 'label-card' | 'blank-card';
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
  entity_picture?: string;
  units?: string;
  state_display?: string;
  state?: StateConfig[];
  styles?: StylesConfig;
  confirmation?: string;
  layout: Layout;
  entity_picture_style?: CssStyleConfig[];
  default_color: string;
  color_on: string;
  color_off: string;
  custom_fields?: CustomFields;
  variables?: Variables;
  extra_styles?: string;
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
  custom_fields?: CustomStyleConfig;
}

export interface CustomStyleConfig {
  [key: string]: CssStyleConfig[];
}

export interface CssStyleConfig {
  [key: string]: any;
}

export interface CustomFields {
  [key: string]: any;
}

export interface Variables {
  [key: string]: any;
}
