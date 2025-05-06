import React from 'react';
import { AirQualityData } from '../types';
import PollutantCard from './UI/PollutantCard';

type PollutantsOverviewProps = {
  data: AirQualityData;
  className?: string;
};

const PollutantsOverview: React.FC<PollutantsOverviewProps> = ({ 
  data, 
  className = '' 
}) => {
  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-4">Current Pollutant Levels</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <PollutantCard type="pm25" value={data.pollutants.pm25} />
        <PollutantCard type="pm10" value={data.pollutants.pm10} />
        <PollutantCard type="co2" value={data.pollutants.co2} />
        <PollutantCard type="no2" value={data.pollutants.no2} />
        <PollutantCard type="o3" value={data.pollutants.o3} />
      </div>
    </div>
  );
};

export default PollutantsOverview;