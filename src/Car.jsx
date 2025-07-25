import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Quaternion, Vector3 } from "three";
import { useControls } from "./useControls";
import { useWheels } from "./useWheels";
import { WheelDebug } from "./WheelDebug";
import { useCarModels } from "./useCarModels";

export function Car({ thirdPerson, topDown }) {
    const result = useCarModels();

    const position = [-1.5, 0.5, 3];
    const width = 0.15;
    const height = 0.07;
    const front = 0.15;
    const wheelRadius = 0.05;

    const chassisBodyArgs = [width, height, front * 2];
    const [chassisBody, chassisApi] = useBox(
        () => ({
            allowSleep: false,
            args: chassisBodyArgs,
            mass: 150,
            position,
        }),
        useRef(null)
    );

    const [wheels, wheelInfos] = useWheels(width, height, front, wheelRadius);

    const [vehicle, vehicleApi] = useRaycastVehicle(
        () => ({
            chassisBody,
            wheelInfos,
            wheels,
        }),
        useRef(null)
    );

    useControls(vehicleApi, chassisApi);

    useFrame((state) => {
        if (!thirdPerson && !topDown) return;

        let position = new Vector3(0, 0, 0);
        position.setFromMatrixPosition(chassisBody.current.matrixWorld);

        let quaternion = new Quaternion(0, 0, 0, 0);
        quaternion.setFromRotationMatrix(chassisBody.current.matrixWorld);

        let wDir = new Vector3(0, 0, 1);
        wDir.applyQuaternion(quaternion);
        wDir.normalize();

        if (thirdPerson) {
            let cameraPosition = position
                .clone()
                .add(
                    wDir.clone().multiplyScalar(1).add(new Vector3(0, 0.3, 0))
                );

            wDir.add(new Vector3(0, 0.2, 0));
            state.camera.position.copy(cameraPosition);
            state.camera.lookAt(position);
        } else if (topDown) {
            // Camera position above and behind the car with an oblique angle
            let cameraPosition = position.clone().add(new Vector3(0, 4, 3));
            state.camera.position.copy(cameraPosition);
            // Look at the car with an oblique angle
            state.camera.lookAt(position);
        }
    });

    useEffect(() => {
        if (!result) return;

        let mesh = result;
        mesh.scale.set(0.08, 0.08, 0.08);
    }, [result]);

    return (
        <group ref={vehicle} name="vehicle">
            <group ref={chassisBody} name="chassisBody">
                <primitive
                    object={result}
                    rotation-y={Math.PI}
                    position={[0, -0.09, 0]}
                />
            </group>

            {/* <mesh ref={chassisBody}>
        <meshBasicMaterial transparent={true} opacity={0.3} />
        <boxGeometry args={chassisBodyArgs} />
      </mesh> */}

            <WheelDebug wheelRef={wheels[0]} radius={wheelRadius} />
            <WheelDebug wheelRef={wheels[1]} radius={wheelRadius} />
            <WheelDebug wheelRef={wheels[2]} radius={wheelRadius} />
            <WheelDebug wheelRef={wheels[3]} radius={wheelRadius} />
        </group>
    );
}
