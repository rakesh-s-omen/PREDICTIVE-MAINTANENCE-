// C:\Users\Rakes\Downloads\PERFECT\cnc-monitoring\src\components\common\Gauge.jsx

import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import styled from 'styled-components';

const GaugeWrapper = styled.div`
  width: 120px;
  text-align: center;
  margin: 10px;
`;

const GaugeLabel = styled.div`
  margin-top: 5px;
  font-size: 14px;
  color: #333;
`;

const GaugeValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 2px;
`;

const Gauge = ({ value, min, max, label, unit, thresholds }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Helper function to get color based on value and thresholds
  const getColor = (value) => {
    const normalizedValue = (value - min) / (max - min);
    
    if (thresholds) {
      const normalizedWarning = (thresholds.warning - min) / (max - min);
      const normalizedCritical = (thresholds.critical - min) / (max - min);
      
      if (normalizedValue >= normalizedCritical) {
        return '#e74c3c'; // Red for critical
      } else if (normalizedValue >= normalizedWarning) {
        return '#f39c12'; // Yellow/Orange for warning
      }
    }
    
    return '#2ecc71'; // Green for good
  };
  
  useEffect(() => {
    // Cleanup previous chart if exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    
    // Create new chart
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      
      // Calculate the normalized value for the gauge
      const normalizedValue = Math.min(Math.max((value - min) / (max - min), 0), 1);
      
      chartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [value, max - value],
            backgroundColor: [
              getColor(value),
              '#eeeeee'
            ],
            borderWidth: 0,
            circumference: 180,
            rotation: 270
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: '70%',
          plugins: {
            tooltip: { enabled: false },
            legend: { display: false }
          },
          animation: {
            animateRotate: true,
            animateScale: true
          }
        }
      });
    }
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [value, min, max, thresholds]);
  
  return (
    <GaugeWrapper>
      <canvas ref={canvasRef} width={100} height={100} />
      <GaugeLabel>{label}</GaugeLabel>
      <GaugeValue>{value}{unit}</GaugeValue>
    </GaugeWrapper>
  );
};

export default Gauge;