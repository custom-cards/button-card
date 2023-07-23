const DAY_IN_MILLISECONDS = 86400000;

const leftPad = (num: number, digits = 2) => {
  let paddedNum = '' + num;
  for (let i = 1; i < digits; i++) {
    paddedNum = parseInt(paddedNum) < 10 ** i ? `0${paddedNum}` : paddedNum;
  }
  return paddedNum;
};

export default function millisecondsToDuration(d: number): string | null {
  const h = Math.floor(d / 1000 / 3600);
  const m = Math.floor(((d / 1000) % 3600) / 60);
  const s = Math.floor(((d / 1000) % 3600) % 60);
  const ms = Math.floor(d % 1000);

  if (h > 0) {
    return `${h}:${leftPad(m)}:${leftPad(s)}`;
  }
  if (m > 0) {
    return `${m}:${leftPad(s)}`;
  }
  if (s > 0 || ms > 0) {
    return `${s}${ms > 0 ? `.${leftPad(ms, 3)}` : ``}`;
  }
  return null;
}
const HOUR_IN_MILLISECONDS = 3600000;
const MINUTE_IN_MILLISECONDS = 60000;
const SECOND_IN_MILLISECONDS = 1000;

export const UNIT_TO_MILLISECOND_CONVERT = {
  ms: 1,
  s: SECOND_IN_MILLISECONDS,
  min: MINUTE_IN_MILLISECONDS,
  h: HOUR_IN_MILLISECONDS,
  d: DAY_IN_MILLISECONDS,
};

export const formatDuration = (duration: string, units: string): string =>
  millisecondsToDuration(parseFloat(duration) * UNIT_TO_MILLISECOND_CONVERT[units]) || '0';
