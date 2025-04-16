import React, { useContext, useMemo } from 'react';
import { MachineContext } from '../../context/MachineContext';
import SensorReadings from './SensorReadings';
import ConditionChart from './ConditionChart';
import AlertSystem from './AlertSystem';
import styled from 'styled-components';

const PanelContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  grid-area: monitoring-panel;
  overflow-y: auto;
  
  h2 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
  }
  
  h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    color: #333;
  }
`;

const MonitoringPanel = () => {
  const { machineState, history } = useContext(MachineContext);
  
  const sensorData = machineState.sensors;
  const alerts = machineState.maintenance.alerts;
  const selectedComponent = null; // No selectedComponent in context, set to null or implement as needed
  
  const filteredAlerts = useMemo(() => {
    if (selectedComponent) {
      return alerts.filter(alert => alert.component === selectedComponent);
    }
    return alerts;
  }, [alerts, selectedComponent]);

  const title = selectedComponent
    ? `Alerts for ${selectedComponent.charAt(0).toUpperCase() + selectedComponent.slice(1)}`
    : 'Alerts & Recommendations';

  return (
    <PanelContainer>
      <h2>Machine Condition</h2>
      
      <SensorReadings sensorData={sensorData} />
      
      <h3>Condition Trend</h3>
      <ConditionChart historyData={history.healthScore} />
      
      <h3>{title}</h3>
      <AlertSystem alerts={filteredAlerts} />
    </PanelContainer>
  );
};

export default MonitoringPanel;
