import { useEffect, useRef } from "react";
import { useLevaControls } from "./useLevaControls";

export function useAudio() {
    const audioRef = useRef({
        backgroundMusic: new Audio(
            process.env.PUBLIC_URL + "/audio/background.mp3"
        ),
        engineSound: new Audio(process.env.PUBLIC_URL + "/audio/engine.mp3"),
        collisionSound: new Audio(
            process.env.PUBLIC_URL + "/audio/collision.mp3"
        ),
        hornSound: new Audio(process.env.PUBLIC_URL + "/audio/horn.mp3"),
    });

    const { audio } = useLevaControls();

    useEffect(() => {
        // Set initial volumes
        audioRef.current.backgroundMusic.volume = audio.backgroundVolume;
        audioRef.current.engineSound.volume = audio.engineVolume;
        audioRef.current.collisionSound.volume = audio.collisionVolume;
        audioRef.current.hornSound.volume = audio.engineVolume;

        // Handle background music play/pause
        if (audio.playBackground) {
            audioRef.current.backgroundMusic.play().catch((error) => {
                console.log("Error playing background music:", error);
            });
        } else {
            audioRef.current.backgroundMusic.pause();
        }

        // Set up background music
        audioRef.current.backgroundMusic.loop = true;

        return () => {
            // Cleanup
            Object.values(audioRef.current).forEach((audio) => {
                audio.pause();
                audio.currentTime = 0;
            });
        };
    }, [
        audio.backgroundVolume,
        audio.engineVolume,
        audio.collisionVolume,
        audio.playBackground,
    ]);

    const playSound = (sound) => {
        try {
            sound.currentTime = 0;
            sound.play().catch((error) => {
                console.log("Error playing sound:", error);
            });
        } catch (error) {
            console.log("Error with sound:", error);
        }
    };

    return {
        playEngineSound: () => playSound(audioRef.current.engineSound),
        playCollisionSound: () => playSound(audioRef.current.collisionSound),
        playHornSound: () => playSound(audioRef.current.hornSound),
    };
}
