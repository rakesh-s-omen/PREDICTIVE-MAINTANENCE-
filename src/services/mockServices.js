// This service will be useful during development when you don't have a backend

// Generate random value within a range
const randomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  // Generate timestamp for mock data
  const generateTimestamp = (index, count) => {
    const now = new Date();
    const pastTime = new Date(now.getTime() - ((count - index) * 5 * 60000));
    return pastTime.toLocaleTimeString();
  };
  
  // Generate mock machine data
  export const generateMockMachineData = () => {
    const status = ['idle', 'running', 'warning', 'error'][randomValue(0, 3)];
    
    return {
      status,
      sensors: {
        temperature: randomValue(60, 95),
        vibration: randomValue(10, 100),
        pressure: randomValue(30, 80),
        speed: randomValue(0, 100)
      },
      productivity: {
        efficiency: randomValue(70, 98),
        completedParts: randomValue(500, 1000),
        rejects: randomValue(0, 20),
        uptime: randomValue(80, 99)
      },
      maintenance: {
        lastMaintenance: '2023-04-10T08:30:00',
        nextScheduled: '2023-05-10T09:00:00',
        healthScore: randomValue(60, 95),
        alerts: status === 'warning' || status === 'error' 
          ? [
              { id: 1, message: 'Temperature threshold exceeded', severity: 'warning', timestamp: new Date().toISOString() },
              { id: 2, message: 'Vibration above normal levels', severity: 'warning', timestamp: new Date().toISOString() }
            ]
          : []
      }
    };
  };
  
  // Generate mock history data
  export const generateMockHistoryData = () => {
    const count = 20;
    
    // Generate data points for each sensor
    const temperatureData = Array.from({ length: count }, (_, i) => ({
      timestamp: generateTimestamp(i, count),
      value: randomValue(60, 95)
    }));
    
    const vibrationData = Array.from({ length: count }, (_, i) => ({
      timestamp: generateTimestamp(i, count),
      value: randomValue(10, 100)
    }));
    
    const pressureData = Array.from({ length: count }, (_, i) => ({
      timestamp: generateTimestamp(i, count),
      value: randomValue(30, 80)
    }));
    
    const speedData = Array.from({ length: count }, (_, i) => ({
      timestamp: generateTimestamp(i, count),
      value: randomValue(0, 100)
    }));
    
    const healthScoreData = Array.from({ length: count }, (_, i) => ({
      timestamp: generateTimestamp(i, count),
      value: randomValue(60, 95)
    }));
    
    return {
      temperature: temperatureData,
      vibration: vibrationData,
      pressure: pressureData,
      speed: speedData,
      healthScore: healthScoreData
    };
  };