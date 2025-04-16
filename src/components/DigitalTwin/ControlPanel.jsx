// C:\Users\Rakes\Downloads\PERFECT\cnc-monitoring\src\components\DigitalTwin\ControlPanel.jsx

import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 15px 0;
  flex-wrap: wrap;
`;

const ControlButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.active ? '#2980b9' : '#3498db'};
  color: white;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ControlPanel = ({ components, selectedComponent, setSelectedComponent }) => {
  const formatComponentName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <ControlsContainer>
      {components.map(component => (
        <ControlButton
          key={component}
          active={selectedComponent === component}
          onClick={() => setSelectedComponent(component === selectedComponent ? null : component)}
        >
          {formatComponentName(component)}
        </ControlButton>
      ))}
    </ControlsContainer>
  );
};

export default ControlPanel;