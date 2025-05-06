import React from 'react';
import { formatPollutantValue } from '../../utils/formatters';
import { pollutantInfo } from '../../services/mockData';

type PollutantCardProps = {
  type: string;
  value: number;
  className?: string;
};

const PollutantCard: React.FC<PollutantCardProps> = ({ 
  type, 
  value, 
  className = '' 
}) => {
  const info = pollutantInfo[type];
  
  if (!info) return null;
  
  return (
    <div className={`rounded-lg p-4 bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-semibold">{info.name}</h4>
          <div className="bg-primary-50 text-primary-700 font-semibold px-2 py-1 rounded-full text-sm">
            {formatPollutantValue(value, type)}
          </div>
        </div>
        <p className="text-xs text-neutral-500">{info.fullName}</p>
        <div className="mt-2">
          <div 
            className="h-1.5 bg-neutral-200 rounded-full overflow-hidden"
            title={`Value: ${value} ${info.unit}`}
          >
            <div 
              className="h-full bg-primary-500 rounded-full"
              style={{ 
                width: `${Math.min(value / (type === 'co2' ? 1200 : 100) * 100, 100)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollutantCard;