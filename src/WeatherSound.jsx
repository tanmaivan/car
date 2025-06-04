// WeatherSound.jsx
import { useEffect } from "react";
import useSound from "use-sound";

export default function WeatherSound({ playRain, playSnow }) {
    const [playRainSound, { stop: stopRainSound }] = useSound(
        "/audio/rain.mp3",
        {
            loop: true,
            volume: 0.4,
        }
    );

    const [playSnowSound, { stop: stopSnowSound }] = useSound(
        "/audio/snow.mp3",
        {
            loop: true,
            volume: 0.2,
        }
    );

    useEffect(() => {
        if (playRain) {
            playRainSound();
        } else {
            stopRainSound();
        }

        if (playSnow) {
            playSnowSound();
        } else {
            stopSnowSound();
        }

        return () => {
            stopRainSound();
            stopSnowSound();
        };
    }, [playRain, playSnow]);

    return null; // Component không render gì ra màn hình
}
