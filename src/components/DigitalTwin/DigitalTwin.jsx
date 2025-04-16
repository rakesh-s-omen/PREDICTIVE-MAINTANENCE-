import React, { useContext, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MachineModel from './MachineModel';
import ControlPanel from './ControlPanel';
import { MachineContext } from '../../context/MachineContext';
import styled from 'styled-components';

const DigitalTwinContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  grid-area: digital-twin;
  
  h2 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
  }
`;

const CanvasContainer = styled.div`
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9;
`;

const DigitalTwin = () => {
  const { machineState, selectedComponent, setSelectedComponent } = useContext(MachineContext);
  const components = machineState.components || {};
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const resizeObserver = new ResizeObserver(() => {
        canvas.style.height = `${canvas.parentElement.offsetHeight}px`;
      });
      resizeObserver.observe(canvas.parentElement);
      return () => resizeObserver.unobserve(canvas.parentElement);
    }
  }, []);

  return (
    <DigitalTwinContainer>
      <h2>Digital Twin Visualization</h2>
      <CanvasContainer>
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 3, 5], fov: 75 }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 1, 1]} intensity={0.8} />
          <MachineModel
            components={components}
            selectedComponent={selectedComponent}
          />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </CanvasContainer>
      <ControlPanel
        components={Object.keys(components)}
        selectedComponent={selectedComponent}
        setSelectedComponent={setSelectedComponent}
      />
    </DigitalTwinContainer>
  );
};

export default DigitalTwin;