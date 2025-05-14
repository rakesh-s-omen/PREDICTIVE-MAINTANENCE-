import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

// Component for Machine Health Index Chart
function MachineHealthIndexChart({ sensorData, anomalyStatus }) {
  const [healthData, setHealthData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Machine Health Index',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.1
      }
    ]
  });

  // Configuration for health index calculation
  const weights = {
    temperature: 0.25,      // 25% weight to temperature
    vibration: 0.30,        // 30% weight to vibration
    magneticField: 0.15,    // 15% weight to magnetic field
    voltage: 0.15,          // 15% weight to voltage
    current: 0.15           // 15% weight to current
  };

  // Thresholds for each parameter (ideal values and ranges)
  const thresholds = {
    temperature: { min: 20, max: 40, ideal: 25 },
    vibration: { min: 0, max: 1.5, ideal: 0.2 },
    magneticField: { min: 100, max: 500, ideal: 300 },
    voltage: { min: 220, max: 240, ideal: 230 },
    current: { min: 0, max: 5, ideal: 2.5 }
  };

  useEffect(() => {
    // Only update if we have sensor data
    if (!sensorData || !sensorData.length) return;
    
    // Get the last data point
    const latestData = sensorData[sensorData.length - 1];
    
    // Calculate health index and update chart
    const healthIndex = calculateHealthIndex(latestData);
    
    // Add new data point
    const timestamp = new Date().toLocaleTimeString();
    
    setHealthData(prevData => {
      // Create copies of previous data
      const newLabels = [...prevData.labels, timestamp];
      const newData = [...prevData.datasets[0].data, healthIndex];
      
      // Keep only the last 30 data points for better visualization
      if (newLabels.length > 30) {
        newLabels.shift();
        newData.shift();
      }
      
      return {
        labels: newLabels,
        datasets: [
          {
            ...prevData.datasets[0],
            data: newData
          }
        ]
      };
    });
  }, [sensorData, anomalyStatus]);

  // Health index calculation function
  const calculateHealthIndex = (data) => {
    if (!data) return 100; // Default to 100% if no data

    if (anomalyStatus === 'Anomaly') {
      return 40; // Fixed 40% for anomaly
    }
    
    // Calculate individual health scores for each parameter
    const scores = {
      temperature: calculateParameterHealth(
        data.temperature, 
        thresholds.temperature.min,
        thresholds.temperature.max,
        thresholds.temperature.ideal
      ),
      vibration: calculateParameterHealth(
        data.vibration,
        thresholds.vibration.min,
        thresholds.vibration.max,
        thresholds.vibration.ideal
      ),
      magneticField: calculateParameterHealth(
        data.magneticField,
        thresholds.magneticField.min,
        thresholds.magneticField.max,
        thresholds.magneticField.ideal
      ),
      voltage: calculateParameterHealth(
        data.voltage,
        thresholds.voltage.min,
        thresholds.voltage.max,
        thresholds.voltage.ideal
      ),
      current: calculateParameterHealth(
        data.current,
        thresholds.current.min,
        thresholds.current.max,
        thresholds.current.ideal
      )
    };
    
    // Apply weights to each parameter's health score
    const weightedScore = 
      scores.temperature * weights.temperature +
      scores.vibration * weights.vibration +
      scores.magneticField * weights.magneticField +
      scores.voltage * weights.voltage +
      scores.current * weights.current;
    
    // Clamp between 75 and 80 for normal
    return Math.round(Math.min(80, Math.max(75, weightedScore)));
  };

  // Calculate health score for a single parameter
  const calculateParameterHealth = (value, min, max, ideal) => {
    // Missing or null values
    if (value === null || value === undefined) return 100;
    
    // If value is outside acceptable range, health drops rapidly
    if (value < min || value > max) {
      // How far outside the range (as a percentage)
      const rangeSize = max - min;
      const distanceOutside = value < min ? min - value : value - max;
      const percentOutside = (distanceOutside / rangeSize) * 100;
      
      // Health drops faster the further outside range
      // Limit to minimum 0% health
      return Math.max(0, 100 - (percentOutside * 2));
    }
    
    // Within range - calculate deviation from ideal
    const deviation = Math.abs(value - ideal);
    const maxDeviation = Math.max(ideal - min, max - ideal);
    const deviationPercent = (deviation / maxDeviation) * 100;
    
    // Health score based on how close to ideal value
    // Small deviations cause smaller health reductions
    return 100 - (deviationPercent * 0.5);
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Health Index (%)'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return 'Health: ' + context.parsed.y + '%';
          }
        }
      },
      annotation: {
        annotations: {
          warningLine: {
            type: 'line',
            yMin: 70,
            yMax: 70,
            borderColor: 'orange',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: 'Warning',
              enabled: true,
              position: 'start'
            }
          },
          criticalLine: {
            type: 'line',
            yMin: 50,
            yMax: 50,
            borderColor: 'red',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: 'Critical',
              enabled: true,
              position: 'start'
            }
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={healthData} options={options} />
    </div>
  );
}

export default MachineHealthIndexChart;
