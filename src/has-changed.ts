import { HomeAssistant } from "./types";
import { PropertyValues } from "lit-element";

// Check if config or Entity changed
export function hasConfigOrEntityChanged(
  element: any,
  changedProps: PropertyValues
): boolean {
  if (changedProps.has("config")) {
    return true;
  }

  if (element.config!.entity) {
    const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
    if (oldHass) {
      return (
        oldHass.states[element.config!.entity] !==
        element.hass!.states[element.config!.entity]
      );
    }
    return true;
  } else {
    return false;
  }

}