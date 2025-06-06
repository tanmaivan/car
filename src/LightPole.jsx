import React, { useRef, useEffect } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SpotLight, SpotLightHelper } from 'three';
import { useCylinder } from '@react-three/cannon'; // Add this import

export function LightPole({ 
    scale = 0.0022, // Default scale value
    position = [-0.3, 0, 0.4], // Default position (x, z, y)
    rotation = [0, -1.57, 0], // Default rotation (x, y, z) in radians
    lightIntensity = 1, // Default light intensity
    lightDistance = 10, // Default light distance
    angle = Math.PI / 4, // Spotlight cone angle (default 45 degrees)
    penumbra = 1, // Softness of the light edge (0-1)
    showHelper = false, // Add new prop for toggling helper visibility
    castShadow = true, // Add shadow casting prop
}) {
    const lightPoleRef = useRef();
    const lightRef = useRef();
    const { scene: threeScene } = useThree();
    const { scene } = useLoader(GLTFLoader, '/models/wooden_light_pole.glb');

    // Add collision cylinder
    const [colliderRef] = useCylinder(() => ({
        args: [0.1, 0.1, 2], // radius top, radius bottom, height
        position: position,
        rotation: rotation,
        type: 'Static',
        mass: 0,
    }));

    useEffect(() => {
        const light = new SpotLight(
            0xffffff, // color
            lightIntensity, // intensity
            lightDistance, // distance
            angle, // angle
            penumbra, // penumbra
            1 // decay
        );
        
        // Add shadow configuration
        light.castShadow = castShadow;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 400;
        light.shadow.camera.fov = 30;
        light.shadow.bias = -0.005;
        
        // Calculate light position relative to pole position
        const lightX = position[0] - 35;  // pole x - 35
        const lightY = position[1] + 350;  // pole y + 350
        const lightZ = position[2];        // same as pole z
        
        // Calculate target position relative to light position
        const targetX = lightX - 165;  // light x - 165
        const targetY = position[1];    // back to pole height
        const targetZ = lightZ;         // same z
        
        light.position.set(lightX, lightY, lightZ);
        light.target.position.set(targetX, targetY, targetZ);
        
        lightPoleRef.current.add(light);
        lightPoleRef.current.add(light.target);

        // Add SpotLightHelper
        if (showHelper) {
            const helper = new SpotLightHelper(light);
            threeScene.add(helper);
            lightRef.current = helper;

            // Update helper on each frame
            const updateHelper = () => {
                helper.update();
                requestAnimationFrame(updateHelper);
            };
            updateHelper();
        }

        return () => {
            if (lightRef.current) {
                threeScene.remove(lightRef.current);
            }
        };
    }, [lightIntensity, lightDistance, angle, penumbra, showHelper, threeScene, castShadow, position]);

    return (
        <>
            <primitive 
                object={scene.clone(true)} 
                ref={lightPoleRef}
                scale={[scale, scale, scale]}
                position={position}
                rotation={rotation}
                castShadow
                receiveShadow
            />
            {/* Add invisible collision cylinder */}
            <mesh ref={colliderRef} visible={false}>
                <cylinderGeometry args={[0.1, 0.1, 2]} />
                <meshBasicMaterial transparent={true} opacity={0} />
            </mesh>
        </>
    );
}