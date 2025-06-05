import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLevaControls } from "./useLevaControls";

const carModels = {
    "Car 1": "models/car/car_v1.glb",
    "Car 2": "models/car/car_v2.glb",
    "Car 3": "models/car/car_v3.glb",
};

export function useCarModels() {
    const { carModel } = useLevaControls();
    const { selectedModel } = carModel;

    const result = useLoader(
        GLTFLoader,
        process.env.PUBLIC_URL + carModels[selectedModel]
    );

    return result.scene;
}
