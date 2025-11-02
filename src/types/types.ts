import { LovelaceCardConfig, LovelaceCard } from './lovelace';
import { HassServiceTarget } from 'home-assistant-js-websocket';

export interface ButtonCardConfig {
  template?: string | string[];
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
  press_action?: ActionConfig;
  release_action?: ActionConfig;
  icon_tap_action?: ActionConfig;
  icon_hold_action?: ActionConfig;
  icon_double_tap_action?: ActionConfig;
  icon_press_action?: ActionConfig;
  icon_release_action?: ActionConfig;
  show_name?: boolean;
  show_state?: boolean;
  show_icon?: boolean;
  show_units?: boolean;
  show_entity_picture?: boolean;
  show_last_changed?: boolean;
  show_label?: boolean;
  show_live_stream?: boolean;
  show_ripple?: boolean;
  live_stream_aspect_ratio?: string;
  live_stream_fit_mode?: 'cover' | 'contain' | 'fill';
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
  tooltip?: string | TooltipConfig;
  section_mode?: boolean;
  update_timer?: number;
  hidden?: string | boolean;
  disable_kbd?: boolean;
  spinner?: boolean;
  protect?: ButtonCardProtect;
  rotate?: boolean;
}

export interface GridOptions {
  rows?: number;
  columns?: number;
}

export interface ExternalButtonCardConfig {
  template?: string | string[];
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
  press_action?: ActionConfig;
  release_action?: ActionConfig;
  icon_tap_action?: ActionConfig;
  icon_hold_action?: ActionConfig;
  icon_double_tap_action?: ActionConfig;
  icon_press_action?: ActionConfig;
  icon_release_action?: ActionConfig;
  show_name?: boolean;
  show_state?: boolean;
  show_icon?: boolean;
  show_units?: boolean;
  show_entity_picture?: boolean;
  show_last_changed?: boolean;
  show_label?: boolean;
  show_live_stream?: boolean;
  show_ripple?: boolean;
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
  tooltip?: string | TooltipConfig;
  section_mode?: boolean;
  grid_options?: GridOptions;
  update_timer?: number;
  hidden?: string | boolean;
  disable_kbd?: boolean;
  spinner?: boolean;
  protect?: ButtonCardProtect;
  rotate?: boolean;
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
  keep_unlock_icon?: boolean;
  lock_icon: string;
  unlock_icon: string;
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
  rotate?: boolean;
  label?: string;
  custom_fields?: CustomFields;
  state_display?: string;
  spinner?: boolean;
  tooltip?: string | TooltipConfig;
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
  [key: string]: any | VariablesExtended;
}

export interface VariablesExtended {
  value: any;
  force_eval?: boolean;
}

export interface EvaluatedVariables {
  [key: string]: { value?: any; loop?: boolean };
}

export interface ButtonCardEmbeddedCards {
  [key: string]: LovelaceCard;
}

export interface ButtonCardEmbeddedCardsConfig {
  [key: string]: string | undefined;
}

export interface ButtonCardProtect {
  pin?: string;
  password?: string;
  failure_message?: string;
  success_message?: string;
}

export interface ToggleActionConfig extends BaseActionConfig {
  action: 'toggle';
  entity?: string;
}

export interface CallServiceActionConfig extends BaseActionConfig {
  action: 'call-service';
  service: string;
  target?: HassServiceTarget;
  // "service_data" is kept for backwards compatibility. Replaced by "data".
  service_data?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

export interface PerformActionActionConfig extends BaseActionConfig {
  action: 'perform-action';
  perform_action: string;
  target?: HassServiceTarget;
  // "service_data" is kept for backwards compatibility. Replaced by "data".
  service_data?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

export interface NavigateActionConfig extends BaseActionConfig {
  action: 'navigate';
  navigation_path: string;
  navigation_replace?: boolean;
}

export interface UrlActionConfig extends BaseActionConfig {
  action: 'url';
  url_path: string;
}

export interface MoreInfoActionConfig extends BaseActionConfig {
  action: 'more-info';
  entity?: string;
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

export interface JavascriptActionConfig extends BaseActionConfig {
  action: 'javascript';
  javascript?: string;
}

export interface MultiActionsActionConfig extends BaseActionConfig {
  action: 'multi-actions';
  actions?: string;
}

export interface ToastActionConfig extends BaseActionConfig {
  action: 'toast';
  toast?: ShowToastParams;
}

export interface BaseActionConfig {
  action: string;
  confirmation?: ConfirmationRestrictionConfig | string;
  repeat?: number;
  repeat_limit?: number;
  sound?: string;
  haptic?: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error' | 'none';
  protect?: ButtonCardProtect;
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
  | PerformActionActionConfig
  | NavigateActionConfig
  | UrlActionConfig
  | MoreInfoActionConfig
  | AssistActionConfig
  | NoActionConfig
  | CustomActionConfig
  | JavascriptActionConfig
  | MultiActionsActionConfig
  | ToastActionConfig
  | string;

export type EvaluatedActionConfig = Exclude<ActionConfig, string>;

export type Constructor<T = any> = new (...args: any[]) => T;

export type EntityPicture = Promise<string> | string | undefined;

export interface ActionEventData {
  tap_action?: EvaluatedActionConfig;
  entity?: string;
}

export interface ActionCustomEvent extends CustomEvent {
  detail: {
    buttonCardCustomAction: CustomButtonCardActionEvent;
  };
}

export interface CustomActionBase {
  callback: (ev: ActionCustomEvent) => void;
  this?: any;
}

export interface CustomActionJavascript extends CustomActionBase {
  type: 'javascript';
  data?: {
    javascript?: string;
  };
}

export interface CustomActionMultiActions extends CustomActionBase {
  type: 'multi-actions';
  data?: {
    multiActions?: Array<ActionConfig | CustomActionMultiActionsDelay>;
  };
}

export interface CustomActionToast extends CustomActionBase {
  type: 'toast';
  data?: {
    toast?: ShowToastParams;
  };
}

export interface CustomActionMultiActionsDelay {
  delay?: string | number;
  wait_completion?: boolean;
  timeout?: number | string;
}

export type CustomButtonCardActionEvent = CustomActionJavascript | CustomActionMultiActions | CustomActionToast;

export interface TooltipConfig {
  content: string | undefined;
  placement?: string;
  delay?: string | number;
  hide_delay?: string | number;
  distance?: number;
  skidding?: number;
  arrow?: boolean;
}

export interface ToastActionParams {
  action: () => void;
  text: string;
}

export interface ShowToastParams {
  message?: string;
  action?: ToastActionParams;
  duration?: number;
  dismissable?: boolean;
}
