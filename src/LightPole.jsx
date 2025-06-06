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
    const spotlightRef = useRef(null); // Add ref for the spotlight
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

    // Create the spotlight on component mount
    useEffect(() => {
        if (!lightPoleRef.current) return;

        // Create spotlight if it doesn't exist
        if (!spotlightRef.current) {
            const light = new SpotLight(
                0xffffff,
                lightIntensity,
                lightDistance,
                angle,
                penumbra,
                1
            );
            
            // Configure shadows
            light.castShadow = castShadow;
            light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;
            light.shadow.camera.near = 1;
            light.shadow.camera.far = 400;
            light.shadow.camera.fov = 30;
            light.shadow.bias = -0.005;
            
            // Calculate positions
            const lightX = position[0] - 35;
            const lightY = position[1] + 350;
            const lightZ = position[2];
            const targetX = lightX - 165;
            const targetY = position[1];
            const targetZ = lightZ;
            
            // Set positions
            light.position.set(lightX, lightY, lightZ);
            light.target.position.set(targetX, targetY, targetZ);
            
            // Store reference
            spotlightRef.current = light;
            
            // Add to scene
            lightPoleRef.current.add(light);
            lightPoleRef.current.add(light.target);
        }

        // Clean up function
        return () => {
            if (spotlightRef.current) {
                lightPoleRef.current?.remove(spotlightRef.current);
                lightPoleRef.current?.remove(spotlightRef.current.target);
                spotlightRef.current = null;
            }
        };
    }, [lightPoleRef.current]); // Only run once when component mounts

    // Update light properties when they change
    useEffect(() => {
        if (!spotlightRef.current) return;

        spotlightRef.current.intensity = lightIntensity;
        spotlightRef.current.distance = lightDistance;
        spotlightRef.current.angle = angle;
        spotlightRef.current.penumbra = penumbra;
        spotlightRef.current.castShadow = castShadow;
    }, [lightIntensity, lightDistance, angle, penumbra, castShadow]);

    // Add SpotLightHelper
    useEffect(() => {
        if (showHelper && spotlightRef.current) {
            const helper = new SpotLightHelper(spotlightRef.current);
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
    }, [showHelper, threeScene]);

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