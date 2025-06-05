import {
    Environment,
    OrbitControls,
    PerspectiveCamera,
    PointerLockControls,
    Html,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Car } from "./Car";
import { Ground } from "./Ground";
import { Track } from "./Track";
import { ScatteredObjects } from "./ScatteredObjects";
import { Rain } from "./Rain";
import { Snow } from "./Snow";
import WeatherSound from "./WeatherSound";
import { useLevaControls } from "./useLevaControls";
import { Helicopter } from "./Helicopter";

export function Scene({ onCameraModeChange }) {
    const [mode, setMode] = useState("orbit"); // 'orbit' | 'thirdPerson' | 'free' | 'topDown'
    const [cameraPosition, setCameraPosition] = useState([-6, 3.9, 6.21]);
    const cameraRef = useRef();
    const { weather } = useLevaControls();
    const pressedKeys = useRef({});

    const speed = 0.1;

    useEffect(() => {
        onCameraModeChange(mode);
    }, [mode, onCameraModeChange]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "j") {
                setMode("orbit");
            }
            if (e.key === "k") {
                setMode("thirdPerson");
            }
            if (e.key === "l") {
                setMode("free");
            }
            if (e.key === "i") {
                setMode("topDown");
            }

            // Lưu key đang được nhấn
            if (["2", "4", "6", "8"].includes(e.key)) {
                pressedKeys.current[e.key] = true;
            }
        };

        const handleKeyUp = (e) => {
            if (["2", "4", "6", "8"].includes(e.key)) {
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

    // Di chuyển camera khi ở chế độ free
    useFrame(() => {
        if (mode !== "free" || !cameraRef.current) return;

        const dir = new THREE.Vector3();
        const camera = cameraRef.current;
        camera.getWorldDirection(dir);
        dir.y = 0; // giữ camera không nhảy lên/xuống

        const left = new THREE.Vector3()
            .crossVectors(camera.up, dir)
            .normalize();

        if (pressedKeys.current["8"]) {
            camera.position.addScaledVector(dir, speed);
        }
        if (pressedKeys.current["2"]) {
            camera.position.addScaledVector(dir, -speed);
        }
        if (pressedKeys.current["4"]) {
            camera.position.addScaledVector(left, speed);
        }
        if (pressedKeys.current["6"]) {
            camera.position.addScaledVector(left, -speed);
        }
    });

    return (
        <Suspense fallback={null}>
            <Environment
                files={process.env.PUBLIC_URL + "/textures/envmap.hdr"}
                background={"both"}
            />

            <PerspectiveCamera
                ref={cameraRef}
                makeDefault
                position={cameraPosition}
                fov={40}
            />

            {mode === "orbit" && (
                <OrbitControls target={[-2.64, -0.71, 0.03]} />
            )}
            {mode === "free" && <PointerLockControls />}

            {/* Thành phần nền */}
            <Ground />
            <Track />

            {/* Thành phần chính */}
            <Car
                thirdPerson={mode === "thirdPerson"}
                topDown={mode === "topDown"}
            />
            <ScatteredObjects />
            <Helicopter
                center={[-2.64, 0, 0.03]}
                radius={3}
                height={1.7}
                speed={0.3}
            />

            <WeatherSound
                playRain={weather.showRain}
                playSnow={weather.showSnow}
                rainIntensity={weather.rainIntensity}
            />

            {/* Hiệu ứng thời tiết */}
            <Rain
                enabled={weather.showRain}
                intensity={weather.rainIntensity}
            />
            <Snow
                enabled={weather.showSnow}
                intensity={weather.snowIntensity}
            />
        </Suspense>
    );
}
