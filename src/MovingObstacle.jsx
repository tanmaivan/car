import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";

export function MovingObstacle({ position }) {
    const obstacleRef = useRef();
    const { scene } = useGLTF("/models/obstacle.glb");
    const [model, setModel] = useState(null);
    const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
    const moveSpeed = 0.02; // Giảm tốc độ di chuyển

    // Clone scene once and store
    useEffect(() => {
        const cloned = scene.clone(true);
        cloned.scale.set(0.5, 0.5, 0.5);
        setModel(cloned);
        obstacleRef.current.add(cloned);
        // Tạo vị trí ngẫu nhiên ban đầu
        generateNewTarget();
    }, [scene]);

    // Hàm tạo vị trí ngẫu nhiên mới
    const generateNewTarget = () => {
        const x = Math.random() * 10 - 5; // -5 đến 5
        const z = Math.random() * 10 - 5;
        setTargetPosition([x, 0, z]);
    };

    useFrame(() => {
        if (obstacleRef.current) {
            const currentPosition = obstacleRef.current.position;

            // Tính hướng di chuyển
            const direction = {
                x: targetPosition[0] - currentPosition.x,
                z: targetPosition[2] - currentPosition.z,
            };

            // Tính khoảng cách
            const distance = Math.sqrt(
                direction.x * direction.x + direction.z * direction.z
            );

            // Nếu đã đến gần đích
            if (distance < 0.5) {
                generateNewTarget();
                return;
            }

            // Chuẩn hóa vector hướng
            if (distance > 0) {
                direction.x /= distance;
                direction.z /= distance;
            }

            // Di chuyển
            const newX = currentPosition.x + direction.x * moveSpeed;
            const newZ = currentPosition.z + direction.z * moveSpeed;

            // Cập nhật vị trí
            obstacleRef.current.position.set(newX, 0, newZ);

            // Tính góc xoay dựa trên hướng di chuyển
            const angle = Math.atan2(direction.x, direction.z);
            obstacleRef.current.rotation.y = angle;
        }
    });

    return <group ref={obstacleRef} />;
}
