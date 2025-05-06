import React from 'react';
import { AQICategory } from '../../types';
import { getAQICategoryColor, getAQICategoryTextColor } from '../../utils/aqiCalculator';

type BadgeSize = 'sm' | 'md' | 'lg';

type AirQualityBadgeProps = {
  category: AQICategory;
  size?: BadgeSize;
  showLabel?: boolean;
  className?: string;
};

const categoryLabels: Record<AQICategory, string> = {
  'good': 'Good',
  'moderate': 'Moderate',
  'unhealthy-sensitive': 'Unhealthy for Sensitive Groups',
  'unhealthy': 'Unhealthy',
  'very-unhealthy': 'Very Unhealthy',
  'hazardous': 'Hazardous',
};

const AirQualityBadge: React.FC<AirQualityBadgeProps> = ({ 
  category, 
  size = 'md', 
  showLabel = true,
  className = '',
}) => {
  const bgColor = getAQICategoryColor(category);
  const textColor = getAQICategoryTextColor(category);
  
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };
  
  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className={`${sizeClasses[size]} ${bgColor} rounded-full`}></div>
      {showLabel && (
        <span className={`${textColor} font-medium ${labelSizeClasses[size]}`}>
          {categoryLabels[category]}
        </span>
      )}
    </div>
  );
};

export default AirQualityBadge;