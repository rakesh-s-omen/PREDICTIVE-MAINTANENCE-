import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get current machine data
export const fetchMachineData = async () => {
  try {
    const response = await axios.get(`${API_URL}/machine/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching machine data:', error);
    throw error;
  }
};

// Get historical machine data
export const fetchMachineHistory = async (days = 1) => {
  try {
    const response = await axios.get(`${API_URL}/machine/history?days=${days}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching machine history:', error);
    throw error;
  }
};

// Send machine control commands
export const sendMachineCommand = async (command, params = {}) => {
  try {
    const response = await axios.post(`${API_URL}/machine/command`, {
      command,
      params
    });
    return response.data;
  } catch (error) {
    console.error(`Error sending ${command} command:`, error);
    throw error;
  }
};

// Start the machine
export const startMachine = async () => {
  return sendMachineCommand('start');
};

// Stop the machine
export const stopMachine = async () => {
  return sendMachineCommand('stop');
};

// Reset machine alerts
export const resetAlerts = async () => {
  return sendMachineCommand('resetAlerts');
};

// Update machine settings
export const updateSettings = async (settings) => {
  try {
    const response = await axios.post(`${API_URL}/machine/settings`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating machine settings:', error);
    throw error;
  }
};

// Request maintenance
export const scheduleMaintenance = async (details) => {
  try {
    const response = await axios.post(`${API_URL}/maintenance/schedule`, details);
    return response.data;
  } catch (error) {
    console.error('Error scheduling maintenance:', error);
    throw error;
  }
};

// For testing purposes - generate mock data
export const generateMockData = async () => {
  try {
    const response = await axios.post(`${API_URL}/mock/generate`);
    return response.data;
  } catch (error) {
    console.error('Error generating mock data:', error);
    throw error;
  }
};