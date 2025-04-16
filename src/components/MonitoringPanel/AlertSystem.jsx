import React from 'react';
import styled from 'styled-components';

const AlertContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  background-color: #fff;
`;

const AlertItem = styled.div`
  padding: 8px;
  border-bottom: 1px solid #eee;
  color: ${props => (props.severity === 'critical' ? '#e74c3c' : props.severity === 'warning' ? '#f39c12' : '#333')};
  font-weight: ${props => (props.severity === 'critical' ? '700' : '400')};
  
  &:last-child {
    border-bottom: none;
  }
`;

const AlertSystem = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return <AlertContainer>No alerts at this time.</AlertContainer>;
  }

  return (
    <AlertContainer>
      {alerts.map((alert, index) => (
        <AlertItem key={index} severity={alert.severity}>
          <strong>{alert.component}</strong>: {alert.message}
        </AlertItem>
      ))}
    </AlertContainer>
  );
};

export default AlertSystem;
