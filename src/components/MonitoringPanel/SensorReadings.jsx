// C:\Users\Rakes\Downloads\PERFECT\cnc-monitoring\src\components\MonitoringPanel\SensorReadings.jsx

import React from 'react';
import styled from 'styled-components';
import Gauge from '../common/Gauge';

const SensorContainer = styled.div`
  margin-bottom: 20px;
`;

const GaugeContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 15px;
`;

const SensorList = styled.div`
  margin-top: 20px;
`;

const SensorItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  
  span:first-child {
    font-weight: 500;
  }
  
  span:last-child {
    color: #555;
  }
`;

const SensorReadings = ({ sensorData }) => {
  return (
    <SensorContainer>
      <GaugeContainer>
        <Gauge 
          value={sensorData.temperature} 
          min={0} 
          max={100} 
          label="Temperature" 
          unit="°C"
          thresholds={{
            warning: 70,
            critical: 85
          }}
        />
        <Gauge 
          value={sensorData.vibration * 100} 
          min={0} 
          max={40} 
          label="Vibration" 
          unit="mm/s"
          thresholds={{
            warning: 20,
            critical: 30 
          }}
        />
      </GaugeContainer>
      
      <SensorList>
        <SensorItem>
          <span>Temperature</span>
          <span>{sensorData.temperature}°C</span>
        </SensorItem>
        <SensorItem>
          <span>Vibration</span>
          <span>{sensorData.vibration} mm/s</span>
        </SensorItem>
        <SensorItem>
          <span>Noise Level</span>
          <span>{sensorData.noise} dB</span>
        </SensorItem>
        <SensorItem>
          <span>Power Consumption</span>
          <span>{sensorData.power} kW</span>
        </SensorItem>
      </SensorList>
    </SensorContainer>
  );
};

export default SensorReadings;