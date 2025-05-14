// MachineModel.jsx
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const MachineModel = () => {
  const machineRef = useRef();
  const obj = useLoader(OBJLoader, '/CNC_Lathe_Clean_VRay_StemCell.obj');

  useFrame(() => {
    if (machineRef.current) {
      machineRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={machineRef} scale={0.5} dispose={null}>
      <primitive object={obj} />
    </group>
  );
};

export default MachineModel;
