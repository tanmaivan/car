import {
    Environment,
    OrbitControls,
    PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Car } from "./Car";
import { Ground } from "./Ground";
import { Track } from "./Track";
import { ScatteredObjects } from "./ScatteredObjects";
import { Rain } from "./Rain";
import { Snow } from "./Snow";
import WeatherSound from "./WeatherSound";
import { useLevaControls } from "./useLevaControls";
import { Helicopter } from "./Helicopter";

export function Scene() {
    const [thirdPerson, setThirdPerson] = useState(false);
    const [cameraPosition, setCameraPosition] = useState([-6, 3.9, 6.21]);
    const { weather } = useLevaControls();

    useEffect(() => {
        function keydownHandler(e) {
            if (e.key === "k") {
                if (thirdPerson)
                    setCameraPosition([-6, 3.9, 6.21 + Math.random() * 0.01]);
                setThirdPerson(!thirdPerson);
            }
            if (e.key === "c") {
                setCameraPosition([
                    -cameraPosition[0],
                    cameraPosition[1],
                    -cameraPosition[2],
                ]);
            }
        }

        window.addEventListener("keydown", keydownHandler);
        return () => window.removeEventListener("keydown", keydownHandler);
    }, [thirdPerson, cameraPosition]);

    return (
        <Suspense fallback={null}>
            <Environment
                files={process.env.PUBLIC_URL + "/textures/envmap.hdr"}
                background={"both"}
            />

            <PerspectiveCamera makeDefault position={cameraPosition} fov={40} />
            {!thirdPerson && <OrbitControls target={[-2.64, -0.71, 0.03]} />}

            {/* Thành phần nền */}
            <Ground />
            <Track />

            {/* Thành phần chính */}
            <Car thirdPerson={thirdPerson} />
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
