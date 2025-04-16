import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMachineData, fetchMachineHistory } from '../services/api';
import io from 'socket.io-client';

export const MachineContext = createContext();
export const useMachine = () => useContext(MachineContext);

export const MachineProvider = ({ children }) => {
  const [machineState, setMachineState] = useState({
    status: 'offline', // offline, idle, running, warning, error
    sensors: {
      temperature: 0,
      vibration: 0,
      pressure: 0,
      speed: 0
    },
    productivity: {
      efficiency: 0,
      completedParts: 0,
      rejects: 0,
      uptime: 0
    },
    maintenance: {
      lastMaintenance: null,
      nextScheduled: null,
      healthScore: 0,
      alerts: []
    }
  });
  
  const [history, setHistory] = useState({
    temperature: [],
    vibration: [],
    pressure: [],
    speed: [],
    healthScore: []
  });
  
  // Socket connection for real-time updates
  useEffect(() => {
    // Initial data fetch
    const loadInitialData = async () => {
      try {
        const machineData = await fetchMachineData();
        setMachineState(machineData);
        
        const historyData = await fetchMachineHistory();
        setHistory(historyData);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    
    loadInitialData();
    
    // Set up socket connection for real-time updates
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    
    socket.on('machineUpdate', (data) => {
      setMachineState(prevState => ({
        ...prevState,
        ...data
      }));
      
      // Update history with new data points
      if (data.sensors) {
        setHistory(prevHistory => ({
          ...prevHistory,
          temperature: [...prevHistory.temperature, { timestamp: new Date().toLocaleTimeString(), value: data.sensors.temperature }].slice(-20),
          vibration: [...prevHistory.vibration, { timestamp: new Date().toLocaleTimeString(), value: data.sensors.vibration }].slice(-20),
          pressure: [...prevHistory.pressure, { timestamp: new Date().toLocaleTimeString(), value: data.sensors.pressure }].slice(-20),
          speed: [...prevHistory.speed, { timestamp: new Date().toLocaleTimeString(), value: data.sensors.speed }].slice(-20)
        }));
      }
      
      if (data.maintenance && data.maintenance.healthScore !== undefined) {
        setHistory(prevHistory => ({
          ...prevHistory,
          healthScore: [...prevHistory.healthScore, { timestamp: new Date().toLocaleTimeString(), value: data.maintenance.healthScore }].slice(-20)
        }));
      }
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      // Update machine status to offline when disconnected
      setMachineState(prevState => ({
        ...prevState,
        status: 'offline'
      }));
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);
  
  // Actions to control the machine
  const startMachine = async () => {
    try {
      // Send start command to API
      // Update local state optimistically
      setMachineState(prevState => ({
        ...prevState,
        status: 'running'
      }));
    } catch (error) {
      console.error('Failed to start machine:', error);
    }
  };
  
  const stopMachine = async () => {
    try {
      // Send stop command to API
      // Update local state optimistically
      setMachineState(prevState => ({
        ...prevState,
        status: 'idle'
      }));
    } catch (error) {
      console.error('Failed to stop machine:', error);
    }
  };
  
  const resetAlerts = async () => {
    try {
      // Send reset alerts command to API
      // Update local state optimistically
      setMachineState(prevState => ({
        ...prevState,
        maintenance: {
          ...prevState.maintenance,
          alerts: []
        }
      }));
    } catch (error) {
      console.error('Failed to reset alerts:', error);
    }
  };
  
  return (
    <MachineContext.Provider value={{
      machineState,
      history,
      actions: {
        startMachine,
        stopMachine,
        resetAlerts
      }
    }}>
      {children}
    </MachineContext.Provider>
  );
};