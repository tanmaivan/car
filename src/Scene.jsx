// Import necessary components and hooks from Drei and Fiber
import {
    Environment,
    OrbitControls,
    PerspectiveCamera,
    PointerLockControls,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Import custom components
import { Car } from "./Car";
import { Ground } from "./Ground";
import { Track } from "./Track";
import { ScatteredObjects } from "./ScatteredObjects";
import { Rain } from "./Rain";
import { Snow } from "./Snow";
import WeatherSound from "./WeatherSound";
import { useLevaControls } from "./useLevaControls";
import { Helicopter } from "./Helicopter";
import { LightPole } from "./LightPole";

// React Spring for smooth light transition
import { useSpring, animated } from '@react-spring/three';

export function Scene({ onCameraModeChange }) {
    // Camera mode state: orbit | thirdPerson | free | topDown
    const [mode, setMode] = useState("orbit");

    // Toggle for day/night environment
    const [isDay, setIsDay] = useState(true);

    // Refs for controlling the camera and OrbitControls
    const cameraRef = useRef();
    const orbitRef = useRef();

    // Track currently pressed keys (for free camera movement)
    const pressedKeys = useRef({});

    // Weather state from Leva GUI
    const { weather } = useLevaControls();

    // Light pole configuration
    const lightPoleData = [
        { position: [-0.3, 0, 0.4], rotation: [0, -Math.PI / 2, 0] },
        { position: [-4.7, 0, 0.8], rotation: [0, 0, 0] },
        { position: [-1.2, 0, -3.5], rotation: [0, Math.PI / 2, 0] },
        { position: [-3.4, 0, -3.5], rotation: [0, Math.PI / 2, 0] },
    ];

    // Default camera position and target for Orbit mode
    const orbitPosition = new THREE.Vector3(-6, 3.9, 6.21);
    const orbitTarget = new THREE.Vector3(-2.64, -0.71, 0.03);

    // Smooth transitions for lighting when switching between day/night
    const { sunIntensity, ambientIntensity } = useSpring({
        sunIntensity: isDay ? 0.3 : 0,
        ambientIntensity: isDay ? 0.5 : 0.2,
        config: { duration: 2000 } // 2 seconds
    });

    const speed = 0.1; // Free camera movement speed

    // React to mode changes (e.g., switch to orbit and reset camera)
    useEffect(() => {
        onCameraModeChange(mode);

        if (mode === "orbit" && cameraRef.current) {
            cameraRef.current.position.copy(orbitPosition);
            cameraRef.current.lookAt(orbitTarget);
            orbitRef.current?.target.copy(orbitTarget);
            orbitRef.current?.update();
        }
    }, [mode, onCameraModeChange]);

    // Handle keyboard input for camera switching, day/night, and free movement
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "1") setMode("orbit");
            if (e.key === "2") setMode("thirdPerson");
            if (e.key === "3") setMode("free");
            if (e.key === "4") setMode("topDown");
            if (e.key === "n") setIsDay(prev => !prev);

            if (["i", "k", "j", "l", "u", "o"].includes(e.key)) {
                pressedKeys.current[e.key] = true;
            }
        };

        const handleKeyUp = (e) => {
            if (["i", "k", "j", "l", "u", "o"].includes(e.key)) {
                pressedKeys.current[e.key] = false;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    // Custom camera movement for free mode
    useFrame(() => {
        if (mode !== "free" || !cameraRef.current) return;

        const dir = new THREE.Vector3();
        const camera = cameraRef.current;

        // Get current forward direction
        camera.getWorldDirection(dir);
        dir.y = 0;

        // Compute left vector
        const left = new THREE.Vector3().crossVectors(camera.up, dir).normalize();

        // Move camera based on keys
        if (pressedKeys.current["i"]) camera.position.addScaledVector(dir, speed);
        if (pressedKeys.current["k"]) camera.position.addScaledVector(dir, -speed);
        if (pressedKeys.current["j"]) camera.position.addScaledVector(left, speed);
        if (pressedKeys.current["l"]) camera.position.addScaledVector(left, -speed);
        if (pressedKeys.current["u"]) camera.position.y += speed;
        if (pressedKeys.current["o"]) camera.position.y -= speed;
    });

    return (
        <Suspense fallback={null}>
            {/* Environment changes depending on day/night */}
            <Environment
                files={
                    process.env.PUBLIC_URL +
                    (isDay ? "/textures/envmap.hdr" : "/textures/night_free_Ref.hdr")
                }
                background={"both"}
            />

            {/* Main camera shared across all modes */}
            <PerspectiveCamera
                ref={cameraRef}
                makeDefault
                position={orbitPosition.toArray()}
                fov={40}
            />

            {/* Orbit camera UI controls */}
            {mode === "orbit" && (
                <OrbitControls ref={orbitRef} target={orbitTarget.toArray()} />
            )}

            {/* Free camera uses pointer lock for FPS-like control */}
            {mode === "free" && <PointerLockControls />}

            {/* Static scene objects */}
            <Ground />
            <Track />
            <ScatteredObjects />

            {/* Car camera supports third-person and top-down views */}
            <Car
                thirdPerson={mode === "thirdPerson"}
                topDown={mode === "topDown"}
            />

            {/* Helicopter orbiting the center */}
            <Helicopter
                center={[-2.64, 0, 0.03]}
                radius={3}
                height={1.7}
                speed={0.3}
            />

            {/* Ambient weather sounds */}
            <WeatherSound
                playRain={weather.showRain}
                playSnow={weather.showSnow}
                rainIntensity={weather.rainIntensity}
            />

            {/* Rain and snow effects */}
            <Rain enabled={weather.showRain} intensity={weather.rainIntensity} />
            <Snow enabled={weather.showSnow} intensity={weather.snowIntensity} />

            {/* Day/night ambient and directional lighting with animation */}
            <animated.ambientLight intensity={ambientIntensity} />

            <animated.directionalLight
                position={[-10, 50, 10]}
                intensity={sunIntensity}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
            />

            {/* Light poles turn on only at night */}
            {lightPoleData.map((props, index) => (
                <LightPole
                    key={index}
                    {...props}
                    lightIntensity={isDay ? 0 : 1}
                />
            ))}
        </Suspense>
    );
}
