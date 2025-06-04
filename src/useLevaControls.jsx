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
            label: "Number of Boxes",
        },
        sphereCount: {
            value: 0,
            min: 0,
            max: 20,
            step: 1,
            label: "Number of Spheres",
        },
        clearAll: { value: false, label: "Clear All", button: true, order: 3 },
    });

    return {
        weather: weatherControls,
        carModel: {
            selectedModel,
            setSelectedModel,
        },
        audio: audioControls,
        obstacles: obstacleControls,
    };
}
