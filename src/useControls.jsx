import { useEffect, useState } from "react";
import { useAudio } from "./useAudio";
import { useLevaControls } from "./useLevaControls";

export const useControls = (vehicleApi, chassisApi) => {
    let [controls, setControls] = useState({});
    const { playEngineSound, playCollisionSound, playHornSound } = useAudio();
    const { carPhysics } = useLevaControls();

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

        if (controls.e) {
            for (let i = 0; i < 4; i++) {
                vehicleApi.setBrake(10, i);
            }
        } else {
            for (let i = 0; i < 4; i++) {
                vehicleApi.setBrake(0, i);
            }
        }

        if (controls.q) {
            playHornSound();
        }

        if (controls.w) {
            vehicleApi.applyEngineForce(carPhysics.engineForce, 2);
            vehicleApi.applyEngineForce(carPhysics.engineForce, 3);
            playEngineSound();
        } else if (controls.s) {
            vehicleApi.applyEngineForce(-carPhysics.engineForce, 2);
            vehicleApi.applyEngineForce(-carPhysics.engineForce, 3);
            playEngineSound();
        } else {
            vehicleApi.applyEngineForce(0, 2);
            vehicleApi.applyEngineForce(0, 3);
        }

        if (controls.a) {
            vehicleApi.setSteeringValue(carPhysics.steeringValue, 2);
            vehicleApi.setSteeringValue(carPhysics.steeringValue, 3);
            vehicleApi.setSteeringValue(-carPhysics.steeringValue * 0.3, 0);
            vehicleApi.setSteeringValue(-carPhysics.steeringValue * 0.3, 1);
        } else if (controls.d) {
            vehicleApi.setSteeringValue(-carPhysics.steeringValue, 2);
            vehicleApi.setSteeringValue(-carPhysics.steeringValue, 3);
            vehicleApi.setSteeringValue(carPhysics.steeringValue * 0.3, 0);
            vehicleApi.setSteeringValue(carPhysics.steeringValue * 0.3, 1);
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
    }, [
        controls,
        vehicleApi,
        chassisApi,
        playEngineSound,
        playCollisionSound,
        playHornSound,
        carPhysics,
    ]);

    return controls;
};
