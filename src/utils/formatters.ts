import { format } from 'date-fns';

export const formatTimestamp = (date: Date): string => {
  return format(date, 'MMM d, yyyy h:mm a');
};

export const formatShortDate = (date: Date): string => {
  return format(date, 'MMM d');
};

export const formatNumber = (value: number, precision: number = 1): string => {
  return value.toFixed(precision);
};

export const formatPollutantValue = (
  value: number, 
  pollutant: string
): string => {
  switch (pollutant) {
    case 'pm25':
    case 'pm10':
      return `${formatNumber(value)} μg/m³`;
    case 'co2':
      return `${formatNumber(value)} ppm`;
    case 'no2':
    case 'o3':
      return `${formatNumber(value)} ppb`;
    default:
      return formatNumber(value);
  }
};