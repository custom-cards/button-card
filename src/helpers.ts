import tinycolor, { TinyColor } from "@ctrl/tinycolor";

export function getColorFromVariable(color: string): string {
  if (color.substring(0, 3) === "var") {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(color.substring(4).slice(0, -1))
      .trim();
  }
  return color;
}

export function getFontColorBasedOnBackgroundColor(
  backgroundColor: string
): string {
  const colorObj = new TinyColor(getColorFromVariable(backgroundColor));
  if (colorObj.isValid && colorObj.getLuminance() > 0.5) {
    return "rgb(62, 62, 62)"; // bright colors - black font
  } else {
    return "rgb(234, 234, 234)"; // dark colors - white font
  }
}

export function getLightColorBasedOnTemperature(
  current: number,
  min: number,
  max: number
): string {
  const high = new TinyColor("rgb(255, 160, 0)"); // orange-ish
  const low = new TinyColor("rgb(166, 209, 255)"); // blue-ish
  const middle = new TinyColor("white");
  const mixAmount = ((current - min) / (max - min)) * 100;
  if (mixAmount < 50) {
    return tinycolor(low)
      .mix(middle, mixAmount * 2)
      .toRgbString();
  } else {
    return tinycolor(middle)
      .mix(high, (mixAmount - 50) * 2)
      .toRgbString();
  }
}

export function buildNameStateConcat(
  name: string | undefined,
  stateString: string | undefined
): string | undefined {
  if (!name && !stateString) {
    return undefined;
  }
  let nameStateString: string | undefined;
  if (stateString) {
    if (name) {
      nameStateString = `${name}: ${stateString}`;
    } else {
      nameStateString = stateString;
    }
  } else {
    nameStateString = name;
  }
  return nameStateString;
}

export function applyBrightnessToColor(
  color: string,
  brightness: number
): string {
  const colorObj = new TinyColor(getColorFromVariable(color));
  if (colorObj.isValid) {
    const validColor = colorObj.mix("black", 100 - brightness).toString();
    if (validColor) return validColor;
  }
  return color;
}
