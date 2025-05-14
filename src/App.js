import React from 'react';
import styled from 'styled-components';
import { MachineProvider } from './context/MachineContext';
import Dashboard from './components/Dashboard/Dashboard';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
`;

const Header = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

function App() {
  return (
    <MachineProvider>
      <AppContainer>
        <Header>
          <Title>CNC Machine Monitoring System</Title>
        </Header>
        <Dashboard />
        
      </AppContainer>
    </MachineProvider>
  );
}

export default App;
