import { AQICategory } from '../types';

export const calculateAQICategory = (aqi: number): AQICategory => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy-sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very-unhealthy';
  return 'hazardous';
};

export const getAQICategoryColor = (category: AQICategory): string => {
  switch (category) {
    case 'good':
      return 'bg-success-500';
    case 'moderate':
      return 'bg-warning-400';
    case 'unhealthy-sensitive':
      return 'bg-warning-600';
    case 'unhealthy':
      return 'bg-error-500';
    case 'very-unhealthy':
      return 'bg-error-700';
    case 'hazardous':
      return 'bg-error-900';
    default:
      return 'bg-neutral-500';
  }
};

export const getAQICategoryTextColor = (category: AQICategory): string => {
  switch (category) {
    case 'good':
      return 'text-success-600';
    case 'moderate':
      return 'text-warning-500';
    case 'unhealthy-sensitive':
      return 'text-warning-600';
    case 'unhealthy':
      return 'text-error-500';
    case 'very-unhealthy':
      return 'text-error-700';
    case 'hazardous':
      return 'text-error-900';
    default:
      return 'text-neutral-500';
  }
};

export const getAQIDescription = (category: AQICategory): string => {
  switch (category) {
    case 'good':
      return 'Air quality is satisfactory, and air pollution poses little or no risk.';
    case 'moderate':
      return 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.';
    case 'unhealthy-sensitive':
      return 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
    case 'unhealthy':
      return 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.';
    case 'very-unhealthy':
      return 'Health alert: The risk of health effects is increased for everyone.';
    case 'hazardous':
      return 'Health warning of emergency conditions: everyone is more likely to be affected.';
    default:
      return 'Unknown air quality.';
  }
};

export const getRecommendation = (category: AQICategory): string => {
  switch (category) {
    case 'good':
      return 'Enjoy outdoor activities.';
    case 'moderate':
      return 'Consider reducing prolonged or heavy exertion outdoors if you are unusually sensitive to air pollution.';
    case 'unhealthy-sensitive':
      return 'People with heart or lung disease, older adults, and children should reduce prolonged or heavy exertion.';
    case 'unhealthy':
      return 'Everyone should reduce prolonged or heavy exertion. People with heart or lung disease, older adults, and children should avoid prolonged or heavy exertion.';
    case 'very-unhealthy':
      return 'Everyone should avoid prolonged or heavy exertion. People with heart or lung disease, older adults, and children should avoid all physical activity outdoors.';
    case 'hazardous':
      return 'Everyone should avoid all physical activity outdoors. People with heart or lung disease, older adults, and children should remain indoors and keep activity levels low.';
    default:
      return 'Follow local guidance.';
  }
};