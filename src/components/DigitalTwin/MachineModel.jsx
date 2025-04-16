import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const getStatusColor = (status) => {
  switch (status) {
    case 'good': return new THREE.Color(0x2ecc71); // Green
    case 'warning': return new THREE.Color(0xf39c12); // Yellow/Orange
    case 'bad': return new THREE.Color(0xe74c3c); // Red
    default: return new THREE.Color(0xcccccc); // Gray
  }
};

const MachineModel = ({ components = {}, selectedComponent }) => {
  const machineRef = useRef();
  const spindleRef = useRef();
  const bedRef = useRef();
  const coolantRef = useRef();
  const motorRef = useRef();

  useFrame(() => {
    if (machineRef.current) {
      machineRef.current.rotation.y += 0.003;
    }
  });

  const getComponentStatus = (componentName) => {
    return components[componentName]?.status || 'good';
  };

  const getComponentColor = (componentName) => {
    return selectedComponent === componentName || getComponentStatus(componentName) !== 'good'
      ? getStatusColor(getComponentStatus(componentName))
      : componentName === 'spindle' ? '#aaaaaa' : componentName === 'bed' ? '#444444' : componentName === 'coolant' ? '#3498db' : '#666666';
  };

  const getComponentEmissive = (componentName) => {
    return selectedComponent === componentName ? getStatusColor(getComponentStatus(componentName)) : '#000000';
  };

  const getComponentEmissiveIntensity = (componentName) => {
    return selectedComponent === componentName ? 0.5 : 0;
  };

  return (
    <group ref={machineRef}>
      {/* Base */}
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[4, 0.5, 3]} />
        <meshPhongMaterial color="#777777" />
      </mesh>

      {/* Column */}
      <mesh position={[-1.2, 1.5, 0]}>
        <boxGeometry args={[0.8, 3, 0.8]} />
        <meshPhongMaterial color="#555555" />
      </mesh>

      {/* Spindle housing */}
      <mesh position={[-0.4, 2.8, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <meshPhongMaterial color="#333333" />
      </mesh>

      {/* Spindle */}
      <mesh
        ref={spindleRef}
        position={[-0.4, 2.4, 0.5]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
        <meshPhongMaterial
          color={getComponentColor('spindle')}
          emissive={getComponentEmissive('spindle')}
          emissiveIntensity={getComponentEmissiveIntensity('spindle')}
        />
      </mesh>

      {/* Bed */}
      <mesh
        ref={bedRef}
        position={[0, 0.4, 0]}
      >
        <boxGeometry args={[3, 0.3, 2]} />
        <meshPhongMaterial
          color={getComponentColor('bed')}
          emissive={getComponentEmissive('bed')}
          emissiveIntensity={getComponentEmissiveIntensity('bed')}
        />
      </mesh>

      {/* Coolant system */}
      <mesh
        ref={coolantRef}
        position={[1.5, 0.8, 1]}
      >
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshPhongMaterial
          color={getComponentColor('coolant')}
          emissive={getComponentEmissive('coolant')}
          emissiveIntensity={getComponentEmissiveIntensity('coolant')}
        />
      </mesh>

      {/* Motor */}
      <mesh
        ref={motorRef}
        position={[-1.8, 2.2, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.4, 0.4, 0.7, 16]} />
        <meshPhongMaterial
          color={getComponentColor('motor')}
          emissive={getComponentEmissive('motor')}
          emissiveIntensity={getComponentEmissiveIntensity('motor')}
        />
      </mesh>
    </group>
  );
};

export default MachineModel;