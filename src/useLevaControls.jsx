import { useControls } from "leva";
import { useState, useEffect } from "react";

export function useLevaControls() {
    // Weather controls
    const weatherControls = useControls("Weather", {
        showRain: { value: false, label: "Rain" },
        rainIntensity: { value: 300, min: 50, max: 1000, step: 50 },
        showSnow: { value: false, label: "Snow" },
        snowIntensity: { value: 200, min: 50, max: 1000, step: 50 },
    });

    // Car physics controls
    const carPhysicsControls = useControls("Car Physics", {
        engineForce: {
            value: 150,
            min: 50,
            max: 300,
            step: 10,
            label: "Engine Force",
        },
        steeringValue: {
            value: 0.35,
            min: 0.1,
            max: 0.5,
            step: 0.05,
            label: "Steering Value",
        },
        suspensionStiffness: {
            value: 60,
            min: 30,
            max: 100,
            step: 5,
            label: "Suspension Stiffness",
        },
        frictionSlip: {
            value: 5,
            min: 1,
            max: 10,
            step: 0.5,
            label: "Friction Slip",
        },
    });

    // Car model controls
    const [selectedModel, setSelectedModel] = useState("Car 1");
    const carModelControls = useControls("Car Models", {
        model: {
            value: selectedModel,
            options: ["Car 1", "Car 2", "Car 3"],
        },
    });

    useEffect(() => {
        setSelectedModel(carModelControls.model);
    }, [carModelControls.model]);

    // Audio controls
    const audioControls = useControls("Audio Controls", {
        backgroundVolume: { value: 0.5, min: 0, max: 1, step: 0.1 },
        engineVolume: { value: 0.5, min: 0, max: 1, step: 0.1 },
        collisionVolume: { value: 0.5, min: 0, max: 1, step: 0.1 },
        playBackground: { value: false },
    });

    // Obstacle controls
    const obstacleControls = useControls("Obstacles", {
        boxCount: {
            value: 0,
            min: 0,
            max: 20,
            step: 1,
            label: "Number of Barrels",
        },
        sphereCount: {
            value: 0,
            min: 0,
            max: 20,
            step: 1,
            label: "Number of Spheres",
        },
        clearAll: { value: false, label: "Clear All" },
    });

    return {
        weather: weatherControls,
        carPhysics: carPhysicsControls,
        carModel: {
            selectedModel,
            setSelectedModel,
        },
        audio: audioControls,
        obstacles: obstacleControls,
    };
}
