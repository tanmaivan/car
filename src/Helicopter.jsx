import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";

export function Helicopter({ center = [0, 0, 0], radius = 3, height = 1, speed = 0.5 }) {
  const helicopterRef = useRef();
  const { scene, animations } = useGLTF("/models/helicopter.glb");

  const [model, setModel] = useState(null);
  const animRef = useRef(); // Ref to bind animation target

  // Clone scene once and store
  useEffect(() => {
    const cloned = scene.clone(true);
    cloned.scale.set(0.035, 0.035, 0.035);
    setModel(cloned);
    animRef.current = cloned;
    helicopterRef.current.add(cloned);
  }, [scene]);

  const { actions, names } = useAnimations(animations, animRef);

  useEffect(() => {
    if (actions && Object.values(actions).length > 0) {
      Object.values(actions).forEach(action => {
        if (action) {
          action.reset().play();
          action.setLoop(true, Infinity);
          console.log("Playing animation:", action.getClip().name);
        }
      });
    }
  }, [actions]);

  useFrame((state) => {
    if (helicopterRef.current) {
      const time = state.clock.getElapsedTime();
      const x = center[0] + Math.cos(time * speed) * radius;
      const z = center[2] + Math.sin(time * speed) * radius;
      const y = center[1] + height;

      helicopterRef.current.position.set(x, y, z);
      helicopterRef.current.rotation.y = Math.atan2(x - center[0], z - center[2]);
    }
  });

  return <group ref={helicopterRef} />;
}

useGLTF.preload("/models/helicopter.glb");
