import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { MachineContext } from '../../context/MachineContext';
import { Canvas } from '@react-three/fiber';
import MachineModel from '../DigitalTwin/MachineModel';
import { OrbitControls } from '@react-three/drei';

// Configuration
const BACKEND_URL = 'http://localhost:5000';
const MAX_DATA_POINTS = 30;
const THRESHOLD = 389.594406;

// Styled Components
const DashboardContainer = styled.div`padding: 20px;`;
const StatusBar = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: #f5f5f5; padding: 10px 20px; border-radius: 10px;`;
const MachineStatus = styled.span`color: ${(props) => (props.status === 'Anomaly' ? 'red' : 'green')}; font-weight: bold; margin-left: 10px;`;
const ConnectionStatus = styled.div`display: flex; align-items: center;`;
const ConnectionIndicator = styled.div`width: 10px; height: 10px; background-color: ${(props) => (props.connected ? 'green' : 'red')}; border-radius: 50%; margin-right: 5px;`;
const DashboardGrid = styled.div`display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px;`;
const Card = styled.div`background: white; border-radius: 12px; box-shadow: 0px 2px 8px rgba(0,0,0,0.1); grid-column: span ${(props) => props.width || 6}; padding: 20px;`;
const CardHeader = styled.div`margin-bottom: 10px;`;
const CardTitle = styled.h3`margin: 0;`;
const SensorGrid = styled.div`display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;`;
const SensorCard = styled.div`background: #f0f0f0; padding: 15px; border-radius: 10px;`;
const SensorLabel = styled.div`font-weight: bold; margin-bottom: 5px;`;
const SensorValue = styled.div`font-size: 1.2rem;`;
const ChartContainer = styled.div`height: 300px;`;
const ErrorMeter = styled.div`margin-top: 20px;`;
const ErrorLabel = styled.div`display: flex; justify-content: space-between;`;
const ErrorBar = styled.div`background: #e0e0e0; border-radius: 10px; height: 10px; margin: 8px 0; position: relative;`;
const ErrorFill = styled.div`background: ${(props) => (props.critical ? 'red' : '#4caf50')}; height: 100%; width: ${(props) => props.percentage}%; border-radius: 10px;`;
const ErrorScale = styled.div`display: flex; justify-content: space-between; font-size: 0.85rem;`;
const AnomalyDetails = styled.div`margin-top: 20px;`;
const AnomalyTitle = styled.h4`color: red; margin-bottom: 10px;`;
const SensorErrors = styled.div`display: flex; flex-direction: column; gap: 10px;`;
const SensorErrorItem = styled.div``;
const SensorErrorHeader = styled.div`display: flex; justify-content: space-between;`;

// Component
function Dashboard() {
  const machineContext = useContext(MachineContext);

  const [connectionStatus, setConnectionStatus] = useState(false);
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    vibration: 0,
    magneticRaw: 0,
    magneticVoltage: 0,
    machineVoltage: 0,
    machineCurrent: 0
  });

  const [anomalyData, setAnomalyData] = useState({
    status: 'Normal',
    reconstructionError: 0,
    topSensor: '',
    sensorErrors: {}
  });

  const [lastUpdated, setLastUpdated] = useState('--');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Vibration',
        data: [],
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Magnetic Field',
        data: [],
        borderColor: 'rgb(255, 206, 86)',
        tension: 0.1,
        borderWidth: 2,
        fill: false
      }
    ]
  });

  const liveDataSourceRef = useRef(null);
  const modelOutputSourceRef = useRef(null);

  useEffect(() => {
    connectToLiveData();
    connectToModelOutput();
    return () => {
      if (liveDataSourceRef.current) liveDataSourceRef.current.close();
      if (modelOutputSourceRef.current) modelOutputSourceRef.current.close();
    };
  }, []);

  const connectToLiveData = () => {
    if (liveDataSourceRef.current) liveDataSourceRef.current.close();
    liveDataSourceRef.current = new EventSource(`${BACKEND_URL}/live_data`);
    liveDataSourceRef.current.onopen = () => {
      setConnectionStatus(true);
    };
    liveDataSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.live_data) {
        const sensorValues = data.live_data.split(',').map(Number);
        if (sensorValues.length === 6) {
          updateSensorValues(sensorValues);
          updateChartData(sensorValues);
          updateLastUpdated(data.timestamp);
        }
      }
    };
    liveDataSourceRef.current.onerror = () => {
      setConnectionStatus(false);
      setTimeout(connectToLiveData, 5000);
    };
  };

  const connectToModelOutput = () => {
    if (modelOutputSourceRef.current) modelOutputSourceRef.current.close();
    modelOutputSourceRef.current = new EventSource(`${BACKEND_URL}/model_output`);
    modelOutputSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.anomaly_result) {
        updateAnomalyDetection(data.anomaly_result);
      }
    };
    modelOutputSourceRef.current.onerror = () => {
      setTimeout(connectToModelOutput, 5000);
    };
  };

  const updateSensorValues = (values) => {
    setSensorData({
      temperature: values[0].toFixed(2),
      vibration: values[1].toFixed(2),
      magneticRaw: values[2].toFixed(2),
      magneticVoltage: values[3].toFixed(4),
      machineVoltage: values[4].toFixed(2),
      machineCurrent: values[5].toFixed(2)
    });
    if (machineContext?.updateMachineData) {
      machineContext.updateMachineData({
        temperature: values[0],
        vibration: values[1],
        magneticField: values[2],
        magneticVoltage: values[3],
        voltage: values[4],
        current: values[5]
      });
    }
  };

  const updateChartData = (values) => {
    setChartData(prevData => {
      const newLabels = [...prevData.labels, new Date().toLocaleTimeString()];
      const newTemperature = [...prevData.datasets[0].data, values[0]];
      const newVibration = [...prevData.datasets[1].data, values[1]];
      const newMagnetic = [...prevData.datasets[2].data, values[2]];

      if (newLabels.length > MAX_DATA_POINTS) {
        newLabels.shift();
        newTemperature.shift();
        newVibration.shift();
        newMagnetic.shift();
      }

      return {
        labels: newLabels,
        datasets: [
          { ...prevData.datasets[0], data: newTemperature },
          { ...prevData.datasets[1], data: newVibration },
          { ...prevData.datasets[2], data: newMagnetic }
        ]
      };
    });
  };

  const updateAnomalyDetection = (result) => {
    setAnomalyData({
      status: result.status,
      reconstructionError: result.reconstruction_error,
      topSensor: result.top_sensor || '',
      sensorErrors: result.sensor_errors || {}
    });
    if (machineContext?.updateMachineStatus) {
      machineContext.updateMachineStatus(result.status);
    }
  };

  const updateLastUpdated = (timestamp) => {
    const date = new Date(timestamp);
    setLastUpdated(date.toLocaleTimeString());
  };

  const errorPercentage = Math.min((anomalyData.reconstructionError / 800) * 100, 100);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: true, title: { display: true, text: 'Time' } },
      y: { display: true, title: { display: true, text: 'Value' } }
    },
    animation: { duration: 0 }
  };

  return (
    <DashboardContainer>
      <StatusBar>
        <div>
          Machine Status:
          <MachineStatus status={anomalyData.status}>
            {anomalyData.status === 'Anomaly' ? 'Anomaly Detected' : 'Normal'}
          </MachineStatus>
        </div>
        <ConnectionStatus>
          <ConnectionIndicator connected={connectionStatus} />
          <span>{connectionStatus ? 'Connected' : 'Disconnected'}</span>
        </ConnectionStatus>
        <div>
          Last Updated: <span>{lastUpdated}</span>
        </div>
      </StatusBar>

      <DashboardGrid>
        <Card width={12}>
          <CardHeader><CardTitle>Live Sensor Data</CardTitle></CardHeader>
          <SensorGrid>
            <SensorCard><SensorLabel>Temperature (°C)</SensorLabel><SensorValue>{sensorData.temperature}</SensorValue></SensorCard>
            <SensorCard><SensorLabel>Vibration (Analog)</SensorLabel><SensorValue>{sensorData.vibration}</SensorValue></SensorCard>
            <SensorCard><SensorLabel>Magnetic Field (Raw)</SensorLabel><SensorValue>{sensorData.magneticRaw}</SensorValue></SensorCard>
            <SensorCard><SensorLabel>Magnetic Voltage (V)</SensorLabel><SensorValue>{sensorData.magneticVoltage}</SensorValue></SensorCard>
            <SensorCard><SensorLabel>Machine Voltage (V)</SensorLabel><SensorValue>{sensorData.machineVoltage}</SensorValue></SensorCard>
            <SensorCard><SensorLabel>Machine Current (A)</SensorLabel><SensorValue>{sensorData.machineCurrent}</SensorValue></SensorCard>
          </SensorGrid>
        </Card>

        <Card width={6}>
          <CardHeader><CardTitle>Sensor Data Over Time</CardTitle></CardHeader>
          <ChartContainer><Line data={chartData} options={chartOptions} /></ChartContainer>
        </Card>

        <Card width={6}>
          <CardHeader><CardTitle>3D CNC Machine Model</CardTitle></CardHeader>
          <div style={{ height: '500px' }}>
            <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[0, 5, 5]} intensity={1} />
              <MachineModel scale={[0.5, 0.5, 0.5]} />
              <OrbitControls />
            </Canvas>
          </div>
        </Card>

        <Card width={6}>
          <CardHeader><CardTitle>Anomaly Detection</CardTitle></CardHeader>
          <div>
            <ErrorMeter>
              <ErrorLabel>
                <span>Reconstruction Error:</span>
                <span>{anomalyData.reconstructionError.toFixed(2)}</span>
              </ErrorLabel>
              <ErrorBar>
                <ErrorFill 
                  percentage={errorPercentage} 
                  critical={anomalyData.reconstructionError > THRESHOLD} 
                />
              </ErrorBar>
              <ErrorScale>
                <span>0</span>
                <span>Threshold: 389.59</span>
                <span>800</span>
              </ErrorScale>
            </ErrorMeter>

            {anomalyData.status === 'Anomaly' && (
              <AnomalyDetails>
                <AnomalyTitle>Anomaly Detected!</AnomalyTitle>
                <p>Top contributing sensor: <strong>{anomalyData.topSensor}</strong></p>
                <h4>Sensor-wise Errors</h4>
                <SensorErrors>
                  {Object.entries(anomalyData.sensorErrors).map(([sensor, error]) => (
                    <SensorErrorItem key={sensor}>
                      <SensorErrorHeader>
                        <span>{sensor}</span>
                        <span>{error.toFixed(2)}</span>
                      </SensorErrorHeader>
                      <ErrorBar>
                        <ErrorFill
                          percentage={Math.min((error / 800) * 100, 100)}
                          critical={error > THRESHOLD}
                        />
                      </ErrorBar>
                    </SensorErrorItem>
                  ))}
                </SensorErrors>
              </AnomalyDetails>
            )}
          </div>
        </Card>
      </DashboardGrid>
    </DashboardContainer>
  );
}

export default Dashboard;
