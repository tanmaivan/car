// WeatherSound.jsx
import { useEffect } from "react";
import useSound from "use-sound";

export default function WeatherSound({
    playRain,
    playSnow,
    rainIntensity = 200,
}) {
    const [playRainSound, { stop: stopRainSound, sound: rainSound }] = useSound(
        "/audio/rain.mp3",
        {
            loop: true,
            volume: Math.min(rainIntensity / 1000, 1), // Scale volume based on intensity (max 1)
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

    // Update volume when rain intensity changes
    useEffect(() => {
        if (rainSound) {
            rainSound.volume(Math.min(rainIntensity / 1000, 1));
        }
    }, [rainIntensity, rainSound]);

    return null; // Component không render gì ra màn hình
}
