import React, { useState } from "react";
import Card from "./UI/Card";
import asthmaIcon from "../assets/asthma.svg";
import heartIcon from "../assets/heart-issue.svg";
import fluIcon from "../assets/flu.svg";
import sinusIcon from "../assets/sinus.svg";
import allergiesIcon from "../assets/allergies.svg";

import { AQICategory } from "../types";

type HealthCondition = "asthma" | "heart" | "allergies" | "sinus" | "flu";

interface HealthAdvice {
  icon: string;
  title: string;
  description: string;
  recommendations: Record<
    AQICategory,
    {
      general: string;
      dos: string[];
      donts: string[];
      warning?: string;
      metrics: {
        label: string;
        threshold: string;
        impact: string;
      }[];
    }
  >;
}

const healthAdvice: Record<HealthCondition, HealthAdvice> = {
  asthma: {
    icon: asthmaIcon,
    title: "Asthma",
    description: "Comprehensive guidance for asthma management",
    recommendations: {
      good: {
        general: "Air quality is ideal for most asthma patients.",
        dos: [
          "Maintain regular exercise routine",
          "Keep rescue inhaler accessible",
          "Follow prescribed medication schedule",
          "Monitor peak flow readings",
        ],
        donts: [
          "Skip daily controller medications",
          "Ignore early warning signs",
        ],
        metrics: [
          {
            label: "PM2.5",
            threshold: "< 12 μg/m³",
            impact: "Minimal impact on asthma symptoms",
          },
          {
            label: "Ozone",
            threshold: "< 50 ppb",
            impact: "Safe for outdoor activities",
          },
        ],
      },
      moderate: {
        general: "Take precautionary measures while maintaining activities.",
        dos: [
          "Check air quality forecasts daily",
          "Pre-medicate before outdoor activities if prescribed",
          "Keep windows closed during peak pollution hours",
          "Stay hydrated",
        ],
        donts: [
          "Exercise in high-traffic areas",
          "Spend extended periods outdoors",
          "Skip prescribed medications",
        ],
        metrics: [
          {
            label: "PM2.5",
            threshold: "12-35.4 μg/m³",
            impact: "May trigger mild symptoms",
          },
          {
            label: "Ozone",
            threshold: "50-100 ppb",
            impact: "Consider reducing outdoor exposure",
          },
        ],
      },
      "unhealthy-for-sensitive-groups": {
        general: "Increased risk for asthma symptoms and attacks.",
        dos: [
          "Use air purifiers indoors",
          "Keep rescue inhaler close",
          "Monitor symptoms more frequently",
          "Follow asthma action plan strictly",
        ],
        donts: [
          "Exercise outdoors",
          "Visit high-pollution areas",
          "Ignore worsening symptoms",
        ],
        warning: "Contact healthcare provider if symptoms worsen",
        metrics: [
          {
            label: "PM2.5",
            threshold: "35.5-55.4 μg/m³",
            impact: "High risk of triggering symptoms",
          },
          {
            label: "NO2",
            threshold: "> 100 ppb",
            impact: "Can cause significant bronchial irritation",
          },
        ],
      },
      unhealthy: {
        general: "High risk for asthma exacerbation.",
        dos: [
          "Stay indoors with air filtration",
          "Use prescribed preventive medications",
          "Monitor peak flow every 4 hours",
          "Keep rescue medications readily available",
        ],
        donts: [
          "Go outdoors unnecessarily",
          "Open windows",
          "Delay using rescue inhaler if needed",
          "Exercise outdoors",
        ],
        warning:
          "Seek immediate medical attention if experiencing severe symptoms",
        metrics: [
          {
            label: "PM2.5",
            threshold: "55.5-150.4 μg/m³",
            impact: "Severe risk of asthma attacks",
          },
          {
            label: "SO2",
            threshold: "> 75 ppb",
            impact: "Can cause immediate breathing difficulties",
          },
        ],
      },
      "very-unhealthy": {
        general: "Severe risk for respiratory distress.",
        dos: [
          "Stay indoors with multiple air purifiers",
          "Use peak flow meter frequently",
          "Contact healthcare provider proactively",
          "Follow emergency asthma plan",
        ],
        donts: [
          "Leave home unless absolutely necessary",
          "Engage in any outdoor activities",
          "Delay seeking medical help if needed",
        ],
        warning: "Have emergency contacts and plan ready",
        metrics: [
          {
            label: "PM2.5",
            threshold: "150.5-250.4 μg/m³",
            impact: "Extremely high risk of severe attacks",
          },
          {
            label: "O3",
            threshold: "> 200 ppb",
            impact: "Can cause immediate severe breathing problems",
          },
        ],
      },
      hazardous: {
        general: "Emergency conditions for asthma patients.",
        dos: [
          "Stay indoors with sealed windows",
          "Use multiple air purifiers",
          "Monitor symptoms constantly",
          "Have emergency medications ready",
          "Keep emergency numbers handy",
        ],
        donts: [
          "Go outdoors for any reason",
          "Open windows or doors",
          "Wait to seek help if experiencing symptoms",
          "Ignore any breathing difficulties",
        ],
        warning:
          "Emergency conditions - contact healthcare provider immediately if any symptoms occur",
        metrics: [
          {
            label: "PM2.5",
            threshold: "> 250.5 μg/m³",
            impact: "Critical risk level",
          },
          {
            label: "AQI",
            threshold: "> 300",
            impact: "Severe health alert",
          },
        ],
      },
    },
  },
  heart: {
    icon: heartIcon,
    title: "Heart Issues",
    description: "Guidance for cardiovascular conditions",
    recommendations: {
      good: {
        general: "Safe conditions for heart patients.",
        dos: [
          "Maintain regular exercise routine",
          "Take medications as prescribed",
          "Monitor blood pressure regularly",
          "Stay hydrated",
        ],
        donts: ["Skip medications", "Ignore unusual symptoms"],
        metrics: [
          {
            label: "PM2.5",
            threshold: "< 12 μg/m³",
            impact: "Minimal cardiovascular stress",
          },
          {
            label: "CO",
            threshold: "< 9 ppm",
            impact: "Safe for outdoor activities",
          },
        ],
      },
      moderate: {
        general: "Exercise caution with outdoor activities.",
        dos: [
          "Check air quality before outdoor activities",
          "Keep medication accessible",
          "Monitor heart rate",
          "Stay well-hydrated",
        ],
        donts: [
          "Overexert yourself",
          "Exercise in high-traffic areas",
          "Ignore warning signs",
        ],
        metrics: [
          {
            label: "PM2.5",
            threshold: "12-35.4 μg/m³",
            impact: "May increase heart rate",
          },
          {
            label: "NO2",
            threshold: "< 100 ppb",
            impact: "Monitor for chest discomfort",
          },
        ],
      },
      "unhealthy-for-sensitive-groups": {
        general: "Increased risk for cardiovascular events.",
        dos: [
          "Stay indoors during peak pollution",
          "Monitor blood pressure more frequently",
          "Keep emergency numbers handy",
          "Use air purifiers",
        ],
        donts: [
          "Exercise outdoors",
          "Spend time in traffic",
          "Ignore chest pain or pressure",
        ],
        warning: "Contact doctor if experiencing unusual symptoms",
        metrics: [
          {
            label: "PM2.5",
            threshold: "35.5-55.4 μg/m³",
            impact: "Increased cardiovascular stress",
          },
          {
            label: "O3",
            threshold: "> 100 ppb",
            impact: "May cause chest tightness",
          },
        ],
      },
      unhealthy: {
        general: "High risk for cardiovascular complications.",
        dos: [
          "Stay indoors with air filtration",
          "Monitor symptoms closely",
          "Keep nitroglycerin if prescribed",
          "Check blood pressure regularly",
        ],
        donts: [
          "Perform strenuous activities",
          "Go outdoors unnecessarily",
          "Delay seeking help for symptoms",
        ],
        warning: "Seek immediate care for chest pain or pressure",
        metrics: [
          {
            label: "PM2.5",
            threshold: "55.5-150.4 μg/m³",
            impact: "High risk of cardiac events",
          },
          {
            label: "CO",
            threshold: "> 9 ppm",
            impact: "Dangerous for heart patients",
          },
        ],
      },
      "very-unhealthy": {
        general: "Severe risk for heart patients.",
        dos: [
          "Stay indoors with air purification",
          "Monitor vital signs frequently",
          "Have emergency plan ready",
          "Keep emergency contacts accessible",
        ],
        donts: [
          "Leave home unless necessary",
          "Perform any strenuous activity",
          "Expose yourself to outdoor air",
        ],
        warning: "Have emergency plan and contacts ready",
        metrics: [
          {
            label: "PM2.5",
            threshold: "150.5-250.4 μg/m³",
            impact: "Severe cardiovascular risk",
          },
          {
            label: "AQI",
            threshold: "201-300",
            impact: "Emergency conditions",
          },
        ],
      },
      hazardous: {
        general: "Emergency conditions for heart patients.",
        dos: [
          "Stay indoors with sealed windows",
          "Use multiple air purifiers",
          "Monitor vital signs constantly",
          "Keep emergency medications ready",
          "Have emergency numbers ready",
        ],
        donts: [
          "Go outdoors for any reason",
          "Perform any physical exertion",
          "Delay seeking help for symptoms",
          "Ignore any chest discomfort",
        ],
        warning:
          "Emergency conditions - seek immediate medical care for any cardiac symptoms",
        metrics: [
          {
            label: "PM2.5",
            threshold: "> 250.5 μg/m³",
            impact: "Critical risk level",
          },
          {
            label: "AQI",
            threshold: "> 300",
            impact: "Severe health alert",
          },
        ],
      },
    },
  },
  // Similar detailed structures for other conditions...
  allergies: {
    icon: allergiesIcon,
    title: "Allergies",
    description: "Guidance for allergy sufferers",
    recommendations: {
      good: {
        general: "Favorable conditions for allergy sufferers.",
        dos: [
          "Take regular allergy medications",
          "Monitor pollen forecasts",
          "Maintain normal activities",
          "Keep windows open for ventilation",
        ],
        donts: ["Skip prescribed medications", "Ignore early symptoms"],
        metrics: [
          {
            label: "Pollen",
            threshold: "Low",
            impact: "Minimal allergy triggers",
          },
          {
            label: "PM2.5",
            threshold: "< 12 μg/m³",
            impact: "Low risk of irritation",
          },
        ],
      },
      moderate: {
        general: "Take precautionary measures while maintaining activities.",
        dos: [
          "Use air purifiers",
          "Take antihistamines as prescribed",
          "Monitor symptoms",
          "Keep windows closed during peak hours",
        ],
        donts: [
          "Spend extended time outdoors",
          "Open windows during high pollen times",
        ],
        metrics: [
          {
            label: "PM2.5",
            threshold: "12-35.4 μg/m³",
            impact: "May trigger mild symptoms",
          },
        ],
      },
      "unhealthy-for-sensitive-groups": {
        general: "Increased risk for allergy symptoms.",
        dos: [
          "Stay indoors when possible",
          "Use HEPA filters",
          "Take medications regularly",
          "Wear mask if outdoors",
        ],
        donts: ["Exercise outdoors", "Open windows", "Skip medications"],
        warning: "Contact healthcare provider if symptoms worsen",
        metrics: [
          {
            label: "PM2.5",
            threshold: "35.5-55.4 μg/m³",
            impact: "High risk of allergic reactions",
          },
        ],
      },
      unhealthy: {
        general: "High risk for severe allergic reactions.",
        dos: [
          "Stay indoors with air filtration",
          "Use prescribed medications",
          "Monitor symptoms closely",
          "Keep rescue medications handy",
        ],
        donts: [
          "Go outdoors unnecessarily",
          "Open windows",
          "Ignore worsening symptoms",
        ],
        warning: "Seek medical attention if symptoms are severe",
        metrics: [
          {
            label: "PM2.5",
            threshold: "55.5-150.4 μg/m³",
            impact: "Severe allergy risk",
          },
        ],
      },
      "very-unhealthy": {
        general: "Severe risk for allergic reactions.",
        dos: [
          "Stay indoors",
          "Use multiple air purifiers",
          "Take all prescribed medications",
          "Have emergency plan ready",
        ],
        donts: [
          "Leave home unless necessary",
          "Expose yourself to outdoor air",
          "Delay treatment if needed",
        ],
        warning: "Have emergency contacts ready",
        metrics: [
          {
            label: "PM2.5",
            threshold: "150.5-250.4 μg/m³",
            impact: "Critical allergy risk",
          },
        ],
      },
      hazardous: {
        general: "Emergency conditions for allergy sufferers.",
        dos: [
          "Stay indoors with sealed windows",
          "Use air purifiers continuously",
          "Take all prescribed medications",
          "Have emergency contacts ready",
        ],
        donts: [
          "Go outdoors",
          "Open windows or doors",
          "Delay seeking help if needed",
        ],
        warning: "Seek immediate medical care for severe reactions",
        metrics: [
          {
            label: "PM2.5",
            threshold: "> 250.5 μg/m³",
            impact: "Extreme risk level",
          },
        ],
      },
    },
  },
  // Continue with similar detailed structures for sinus, flu, and copd...
  sinus: {
    icon: sinusIcon,
    title: "Sinus Issues",
    description: "Recommendations for sinus sensitivity",
    recommendations: {
      good: {
        general: "Maintain normal sinus care routine.",
        dos: [
          "Use saline nasal rinse regularly",
          "Stay hydrated",
          "Monitor symptoms",
          "Maintain indoor humidity",
        ],
        donts: ["Skip regular maintenance", "Ignore early symptoms"],
        metrics: [
          {
            label: "Humidity",
            threshold: "30-50%",
            impact: "Optimal for sinus health",
          },
        ],
      },
      moderate: {
        general: "Take extra care with sinus maintenance.",
        dos: [
          "Increase saline rinses",
          "Use air purifier",
          "Monitor symptoms closely",
        ],
        donts: ["Expose to irritants", "Skip medications"],
        metrics: [
          {
            label: "PM2.5",
            threshold: "12-35.4 μg/m³",
            impact: "May cause mild irritation",
          },
        ],
      },
      "unhealthy-for-sensitive-groups": {
        general: "Increased risk for sinus irritation.",
        dos: [
          "Stay indoors when possible",
          "Use air purifier",
          "Increase medication if prescribed",
        ],
        donts: ["Expose to outdoor air", "Skip treatments"],
        metrics: [
          {
            label: "PM2.5",
            threshold: "35.5-55.4 μg/m³",
            impact: "High risk of irritation",
          },
        ],
      },
      unhealthy: {
        general: "High risk for sinus complications.",
        dos: ["Stay indoors", "Use air purifier", "Monitor symptoms closely"],
        donts: ["Go outdoors", "Skip medications"],
        metrics: [
          {
            label: "PM2.5",
            threshold: "55.5-150.4 μg/m³",
            impact: "Severe irritation risk",
          },
        ],
      },
      "very-unhealthy": {
        general: "Severe risk for sinus problems.",
        dos: [
          "Stay indoors",
          "Use air purifier",
          "Monitor symptoms constantly",
        ],
        donts: ["Expose to outdoor air", "Skip treatments"],
        metrics: [
          {
            label: "PM2.5",
            threshold: "150.5-250.4 μg/m³",
            impact: "Critical risk level",
          },
        ],
      },
      hazardous: {
        general: "Emergency conditions for sinus sufferers.",
        dos: [
          "Stay indoors with air purification",
          "Use humidifier",
          "Monitor symptoms closely",
          "Keep medications accessible",
        ],
        donts: ["Go outdoors", "Skip medications", "Ignore severe symptoms"],
        warning: "Seek medical attention for severe symptoms",
        metrics: [
          {
            label: "PM2.5",
            threshold: "> 250.5 μg/m³",
            impact: "Extreme sinus irritation risk",
          },
        ],
      },
    },
  },
  flu: {
    icon: fluIcon,
    title: "Cold/Flu",
    description: "Advice when experiencing cold or flu",
    recommendations: {
      good: {
        general: "Focus on recovery with good air quality.",
        dos: [
          "Rest adequately",
          "Stay hydrated",
          "Take prescribed medications",
          "Monitor temperature",
        ],
        donts: ["Overexert yourself", "Ignore worsening symptoms"],
        metrics: [
          {
            label: "Temperature",
            threshold: "Normal",
            impact: "Good for recovery",
          },
        ],
      },
      moderate: {
        general: "Take extra care during recovery.",
        dos: ["Rest more", "Stay hydrated", "Monitor symptoms"],
        donts: ["Expose to cold air", "Skip medications"],
        metrics: [
          {
            label: "PM2.5",
            threshold: "12-35.4 μg/m³",
            impact: "May slow recovery",
          },
        ],
      },
      "unhealthy-for-sensitive-groups": {
        general: "Increased risk during illness.",
        dos: ["Stay indoors", "Use air purifier", "Monitor symptoms closely"],
        donts: ["Go outdoors", "Skip treatments"],
        metrics: [
          {
            label: "PM2.5",
            threshold: "35.5-55.4 μg/m³",
            impact: "High risk of complications",
          },
        ],
      },
      unhealthy: {
        general: "High risk for complications.",
        dos: [
          "Stay indoors",
          "Use air purifier",
          "Monitor symptoms constantly",
        ],
        donts: ["Expose to outdoor air", "Skip medications"],
        metrics: [
          {
            label: "PM2.5",
            threshold: "55.5-150.4 μg/m³",
            impact: "Severe risk level",
          },
        ],
      },
      "very-unhealthy": {
        general: "Severe risk for complications.",
        dos: [
          "Stay indoors",
          "Use air purifier",
          "Monitor symptoms constantly",
        ],
        donts: ["Expose to outdoor air", "Skip treatments"],
        metrics: [
          {
            label: "PM2.5",
            threshold: "150.5-250.4 μg/m³",
            impact: "Critical risk level",
          },
        ],
      },
      hazardous: {
        general: "Emergency conditions for respiratory illness.",
        dos: [
          "Stay indoors",
          "Use air purification",
          "Monitor symptoms closely",
          "Keep emergency contacts ready",
        ],
        donts: [
          "Leave home",
          "Expose yourself to polluted air",
          "Delay seeking help if needed",
        ],
        warning: "Seek immediate care for breathing difficulties",
        metrics: [
          {
            label: "PM2.5",
            threshold: "> 250.5 μg/m³",
            impact: "Severe risk for complications",
          },
        ],
      },
    },
  },
};

interface HealthAdviceSectionProps {
  category: AQICategory;
  className?: string;
  currentData?: {
    aqi: number;
    pollutants: {
      pm25: number;
      pm10: number;
      co2: number;
      no2: number;
      o3: number;
    };
    temperature: number;
    humidity: number;
  };
}

const HealthAdviceSection: React.FC<HealthAdviceSectionProps> = ({
  category,
  className = "",
  currentData,
}) => {
  const [selectedCondition, setSelectedCondition] =
    useState<HealthCondition>("asthma");
  const advice = healthAdvice[selectedCondition].recommendations[category];

  return (
    <Card className={`${className}`}>
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Health Advice</h3>

        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(healthAdvice).map(([key, condition]) => (
            <button
              key={key}
              onClick={() => setSelectedCondition(key as HealthCondition)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                ${
                  selectedCondition === key
                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                    : "bg-white border border-neutral-200 hover:bg-neutral-50"
                }`}
            >
              <img
                src={condition.icon}
                alt={condition.title}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">{condition.title}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-neutral-50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <img
                src={healthAdvice[selectedCondition].icon}
                alt={healthAdvice[selectedCondition].title}
                className="w-8 h-8"
              />
              <div>
                <h4 className="font-medium text-neutral-900">
                  {healthAdvice[selectedCondition].title}
                </h4>
                <p className="text-sm text-neutral-600 mt-1">
                  {advice.general}
                </p>
              </div>
            </div>
          </div>

          {currentData && (
            <div className="bg-primary-50 rounded-lg p-4">
              <h5 className="font-medium text-primary-700 mb-2">
                Current Conditions
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-primary-600">AQI</p>
                  <p className="font-medium">{currentData.aqi}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-600">PM2.5</p>
                  <p className="font-medium">
                    {currentData.pollutants.pm25.toFixed(1)} μg/m³
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary-600">Temperature</p>
                  <p className="font-medium">{currentData.temperature}°C</p>
                </div>
                <div>
                  <p className="text-sm text-primary-600">Humidity</p>
                  <p className="font-medium">{currentData.humidity}%</p>
                </div>
                <div>
                  <p className="text-sm text-primary-600">O3</p>
                  <p className="font-medium">
                    {currentData.pollutants.o3.toFixed(1)} μg/m³
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary-600">NO2</p>
                  <p className="font-medium">
                    {currentData.pollutants.no2.toFixed(1)} μg/m³
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-success-50 rounded-lg p-4">
              <h5 className="font-medium text-success-700 mb-2">Do's</h5>
              <ul className="space-y-2">
                {advice.dos.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-success-600"
                  >
                    <span className="w-1.5 h-1.5 bg-success-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-error-50 rounded-lg p-4">
              <h5 className="font-medium text-error-700 mb-2">Don'ts</h5>
              <ul className="space-y-2">
                {advice.donts.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-error-600"
                  >
                    <span className="w-1.5 h-1.5 bg-error-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {advice.warning && (
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <p className="text-sm text-warning-700 font-medium">
                ⚠️ {advice.warning}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default HealthAdviceSection;
