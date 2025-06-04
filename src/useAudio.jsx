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
    });

    const { audio } = useLevaControls();

    useEffect(() => {
        // Set initial volumes
        audioRef.current.backgroundMusic.volume = audio.backgroundVolume;
        audioRef.current.engineSound.volume = audio.engineVolume;
        audioRef.current.collisionSound.volume = audio.collisionVolume;

        // Handle background music play/pause
        if (audio.playBackground) {
            audioRef.current.backgroundMusic.play();
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

    return {
        playEngineSound: () => {
            audioRef.current.engineSound.currentTime = 0;
            audioRef.current.engineSound.play();
        },
        playCollisionSound: () => {
            audioRef.current.collisionSound.currentTime = 0;
            audioRef.current.collisionSound.play();
        },
    };
}
