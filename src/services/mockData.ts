import { PollutantInfo } from "../types";

// Pollutant information
export const pollutantInfo: Record<string, PollutantInfo> = {
  pm25: {
    name: "PM2.5",
    fullName: "Fine Particulate Matter",
    unit: "μg/m³",
    description: "Tiny particles with diameters of 2.5 micrometers or smaller.",
    healthEffects:
      "Can penetrate deep into lungs and even enter the bloodstream, causing respiratory and cardiovascular issues.",
    sources:
      "Combustion (vehicles, power plants), wildfires, agricultural burning, and industrial processes.",
  },
  pm10: {
    name: "PM10",
    fullName: "Coarse Particulate Matter",
    unit: "μg/m³",
    description: "Particles with diameters between 2.5 and 10 micrometers.",
    healthEffects:
      "Can cause irritation to the eyes, nose, and throat, aggravate asthma, and contribute to respiratory problems.",
    sources: "Dust, construction, industrial activities, and road traffic.",
  },
  co2: {
    name: "CO₂",
    fullName: "Carbon Dioxide",
    unit: "ppm",
    description:
      "A colorless, odorless gas produced by burning carbon-based fuels.",
    healthEffects:
      "High concentrations can cause headaches, dizziness, and difficulty concentrating. Primary greenhouse gas.",
    sources:
      "Combustion of fossil fuels, respiration, and industrial processes.",
  },
  no2: {
    name: "NO₂",
    fullName: "Nitrogen Dioxide",
    unit: "ppb",
    description: "Reddish-brown gas with a sharp, biting odor.",
    healthEffects:
      "Can irritate airways, aggravate respiratory diseases like asthma, and contribute to the formation of ground-level ozone.",
    sources: "Vehicle emissions, power plants, and industrial processes.",
  },
  o3: {
    name: "O₃",
    fullName: "Ozone",
    unit: "ppb",
    description:
      "A gas composed of three oxygen atoms, a key component of smog.",
    healthEffects:
      "Can trigger chest pain, coughing, throat irritation, and congestion. Worsens bronchitis, emphysema, and asthma.",
    sources:
      "Created by chemical reactions between nitrogen oxides and volatile organic compounds in the presence of sunlight.",
  },
};
