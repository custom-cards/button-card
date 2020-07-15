import { HomeAssistant, ActionConfig, fireEvent, forwardHaptic, navigate, toggleEntity } from 'custom-card-helpers';

export const handleActionConfig = (
  node: HTMLElement,
  hass: HomeAssistant,
  config: {
    entity?: string;
    camera_image?: string;
    hold_action?: ActionConfig;
    tap_action?: ActionConfig;
    double_tap_action?: ActionConfig;
  },
  actionConfig: ActionConfig | undefined,
): void => {
  if (!actionConfig) {
    actionConfig = {
      action: 'more-info',
    };
  }

  if (
    actionConfig.confirmation &&
    (!actionConfig.confirmation.exemptions ||
      !actionConfig.confirmation.exemptions.some(e => e.user === hass!.user!.id))
  ) {
    forwardHaptic('warning');

    if (!confirm(actionConfig.confirmation.text || `Are you sure you want to ${actionConfig.action}?`)) {
      return;
    }
  }

  switch (actionConfig.action) {
    case 'more-info':
      if (config.entity || config.camera_image) {
        fireEvent(node, 'hass-more-info', {
          entityId: config.entity ? config.entity : config.camera_image!,
        });
      }
      break;
    case 'navigate':
      if (actionConfig.navigation_path) {
        navigate(node, actionConfig.navigation_path);
      }
      break;
    case 'url':
      if (actionConfig.url_path) {
        window.open(actionConfig.url_path);
      }
      break;
    case 'toggle':
      if (config.entity) {
        toggleEntity(hass, config.entity!);
        forwardHaptic('success');
      }
      break;
    case 'call-service': {
      if (!actionConfig.service) {
        forwardHaptic('failure');
        return;
      }
      const [domain, service] = actionConfig.service.split('.', 2);
      hass.callService(domain, service, actionConfig.service_data);
      forwardHaptic('success');
    }
  }
};

export const handleAction = (
  node: HTMLElement,
  hass: HomeAssistant,
  config: {
    entity?: string;
    camera_image?: string;
    hold_action?: ActionConfig;
    tap_action?: ActionConfig;
    double_tap_action?: ActionConfig;
  },
  action: string,
): void => {
  let actionConfig: ActionConfig | undefined;

  if (action === 'double_tap' && config.double_tap_action) {
    actionConfig = config.double_tap_action;
  } else if (action === 'hold' && config.hold_action) {
    actionConfig = config.hold_action;
  } else if (action === 'tap' && config.tap_action) {
    actionConfig = config.tap_action;
  }

  handleActionConfig(node, hass, config, actionConfig);
};
