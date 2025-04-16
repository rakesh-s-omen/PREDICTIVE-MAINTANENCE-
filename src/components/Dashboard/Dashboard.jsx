import React from 'react';
import styled from 'styled-components';
import { useMachine } from '../../context/MachineContext';
import DigitalTwin from '../DigitalTwin/DigitalTwin';
import MonitoringPanel from '../MonitoringPanel/MonitoringPanel';

const DashboardContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 1rem;
  gap: 1rem;
  overflow: hidden;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const Panel = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const LeftPanel = styled(Panel)`
  flex: 1;
  min-width: 300px;
`;

const RightPanel = styled(Panel)`
  flex: 2;
  min-width: 400px;
`;

const Dashboard = () => {
  const { machineState } = useMachine();

  return (
    <DashboardContainer>
      <LeftPanel>
        <MonitoringPanel />
      </LeftPanel>
      <RightPanel>
        <DigitalTwin />
      </RightPanel>
    </DashboardContainer>
  );
};

export default Dashboard;