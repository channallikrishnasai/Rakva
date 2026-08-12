export const convertUnit = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  if (fromUnit === toUnit) return value;

  const normalize = (unit: string) => unit.toLowerCase().replace(/[^a-z]/g, '');
  const from = normalize(fromUnit);
  const to = normalize(toUnit);

  // Temperature
  if ((from === 'f' || from === 'fahrenheit') && (to === 'c' || to === 'celsius')) {
    return (value - 32) * (5 / 9);
  }
  if ((from === 'c' || from === 'celsius') && (to === 'f' || to === 'fahrenheit')) {
    return (value * (9 / 5)) + 32;
  }

  // Speed
  if ((from === 'mph' || from === 'milesperhour') && to === 'kmh') {
    return value * 1.60934;
  }
  if (from === 'kmh' && (to === 'mph' || to === 'milesperhour')) {
    return value / 1.60934;
  }
  if (from === 'ms' && to === 'kmh') {
    return value * 3.6;
  }
  if (from === 'kmh' && to === 'ms') {
    return value / 3.6;
  }

  // Length/Precipitation
  if ((from === 'in' || from === 'inch' || from === 'inches') && to === 'mm') {
    return value * 25.4;
  }
  if (from === 'mm' && (to === 'in' || to === 'inch' || to === 'inches')) {
    return value / 25.4;
  }
  if ((from === 'ft' || from === 'feet') && (to === 'm' || to === 'meters')) {
    return value * 0.3048;
  }
  if ((from === 'm' || from === 'meters') && (to === 'ft' || to === 'feet')) {
    return value / 0.3048;
  }

  // If no conversion is known, return the original value (could throw error but better to be safe)
  console.warn(`Unknown unit conversion from ${fromUnit} to ${toUnit}`);
  return value;
};
