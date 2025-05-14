import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import styled from 'styled-components';

const ChartContainer = styled.div`
  margin-top: 20px;
  height: 200px;
`;

const EfficiencyGraph = ({ sensorHistory }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (canvasRef.current && sensorHistory && sensorHistory.length > 0) {
      const ctx = canvasRef.current.getContext('2d');

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: sensorHistory.map(item => item.timestamp),
          datasets: [
            {
              label: 'Temperature (°C)',
              data: sensorHistory.map(item => item.temperature),
              borderColor: '#e74c3c',
              backgroundColor: 'rgba(231, 76, 60, 0.2)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#e74c3c',
              pointHoverRadius: 5,
              pointHoverBackgroundColor: '#e74c3c',
              pointHoverBorderColor: '#ffffff',
            },
            {
              label: 'Vibration (mm/s)',
              data: sensorHistory.map(item => item.vibration),
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.2)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#3498db',
              pointHoverRadius: 5,
              pointHoverBackgroundColor: '#3498db',
              pointHoverBorderColor: '#ffffff',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
              padding: 10,
              displayColors: true,
            },
          },
          scales: {
            x: {
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                maxTicksLimit: 8,
                maxRotation: 0,
              }
            },
            y: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: 100,
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                callback: function(value) {
                  return value;
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'nearest',
            axis: 'x'
          },
          animation: {
            duration: 1000
          }
        }
      });
    }
  }, [sensorHistory]);

  return (
    <ChartContainer>
      <canvas ref={canvasRef} />
    </ChartContainer>
  );
};

export default EfficiencyGraph;
