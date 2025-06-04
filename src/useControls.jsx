import { useEffect, useState } from "react";
import { useAudio } from "./useAudio";

export const useControls = (vehicleApi, chassisApi) => {
    let [controls, setControls] = useState({});
    const { playEngineSound, playCollisionSound } = useAudio();

    useEffect(() => {
        const keyDownPressHandler = (e) => {
            setControls((controls) => ({
                ...controls,
                [e.key.toLowerCase()]: true,
            }));
        };

        const keyUpPressHandler = (e) => {
            setControls((controls) => ({
                ...controls,
                [e.key.toLowerCase()]: false,
            }));
        };

        window.addEventListener("keydown", keyDownPressHandler);
        window.addEventListener("keyup", keyUpPressHandler);
        return () => {
            window.removeEventListener("keydown", keyDownPressHandler);
            window.removeEventListener("keyup", keyUpPressHandler);
        };
    }, []);

    useEffect(() => {
        if (!vehicleApi || !chassisApi) return;

        if (controls.w) {
            vehicleApi.applyEngineForce(150, 2);
            vehicleApi.applyEngineForce(150, 3);
            playEngineSound();
        } else if (controls.s) {
            vehicleApi.applyEngineForce(-150, 2);
            vehicleApi.applyEngineForce(-150, 3);
            playEngineSound();
        } else {
            vehicleApi.applyEngineForce(0, 2);
            vehicleApi.applyEngineForce(0, 3);
        }

        if (controls.a) {
            vehicleApi.setSteeringValue(0.35, 2);
            vehicleApi.setSteeringValue(0.35, 3);
            vehicleApi.setSteeringValue(-0.1, 0);
            vehicleApi.setSteeringValue(-0.1, 1);
        } else if (controls.d) {
            vehicleApi.setSteeringValue(-0.35, 2);
            vehicleApi.setSteeringValue(-0.35, 3);
            vehicleApi.setSteeringValue(0.1, 0);
            vehicleApi.setSteeringValue(0.1, 1);
        } else {
            for (let i = 0; i < 4; i++) {
                vehicleApi.setSteeringValue(0, i);
            }
        }

        if (controls.arrowdown) {
            chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, +1]);
            playCollisionSound();
        }
        if (controls.arrowup) {
            chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, -1]);
            playCollisionSound();
        }
        if (controls.arrowleft) {
            chassisApi.applyLocalImpulse([0, -5, 0], [-0.5, 0, 0]);
            playCollisionSound();
        }
        if (controls.arrowright) {
            chassisApi.applyLocalImpulse([0, -5, 0], [+0.5, 0, 0]);
            playCollisionSound();
        }

        if (controls.r) {
            chassisApi.position.set(-1.5, 0.5, 3);
            chassisApi.velocity.set(0, 0, 0);
            chassisApi.angularVelocity.set(0, 0, 0);
            chassisApi.rotation.set(0, 0, 0);
        }
    }, [controls, vehicleApi, chassisApi, playEngineSound, playCollisionSound]);

    return controls;
};
