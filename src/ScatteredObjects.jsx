import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox, useSphere } from "@react-three/cannon";
import { useLevaControls } from "./useLevaControls";
import { useTexture } from "@react-three/drei";

// Danh sách màu sắc đa dạng
const COLORS = [
    "#e74c3c", // đỏ
    "#f1c40f", // vàng
    "#2ecc71", // xanh lá
    "#3498db", // xanh dương
    "#9b59b6", // tím
    "#e67e22", // cam
    "#1abc9c", // xanh ngọc
];

// Định nghĩa các hành tinh và thuộc tính của chúng
const PLANETS = {
    mercury: {
        texture: "/solar_textures/2k_mercury.jpg",
        mass: 0.38, // Khối lượng so với Trái Đất
        restitution: 0.3, // Độ nảy thấp
        friction: 0.8, // Ma sát cao
    },
    venus: {
        texture: "/solar_textures/2k_venus_surface.jpg",
        mass: 0.91,
        restitution: 0.2,
        friction: 0.9,
    },
    mars: {
        texture: "/solar_textures/2k_mars.jpg",
        mass: 0.38,
        restitution: 0.4,
        friction: 0.7,
    },
    jupiter: {
        texture: "/solar_textures/2k_jupiter.jpg",
        mass: 2.5,
        restitution: 0.6,
        friction: 0.3,
    },
    saturn: {
        texture: "/solar_textures/2k_saturn.jpg",
        mass: 1.1,
        restitution: 0.5,
        friction: 0.4,
    },
    uranus: {
        texture: "/solar_textures/2k_uranus.jpg",
        mass: 0.9,
        restitution: 0.7,
        friction: 0.2,
    },
    neptune: {
        texture: "/solar_textures/2k_neptune.jpg",
        mass: 1.1,
        restitution: 0.6,
        friction: 0.3,
    },
};

function Box({ position, size = [0.3, 0.3, 0.3] }) {
    const [ref] = useBox(() => ({
        mass: 1,
        position,
        args: size,
    }));

    // Chọn ngẫu nhiên 1 màu
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}

function Sphere({ position, radius = 0.2 }) {
    // Chọn ngẫu nhiên một hành tinh
    const planetKeys = Object.keys(PLANETS);
    const randomPlanet =
        PLANETS[planetKeys[Math.floor(Math.random() * planetKeys.length)]];

    const [ref] = useSphere(() => ({
        mass: randomPlanet.mass,
        position,
        args: [radius],
        restitution: randomPlanet.restitution,
        friction: randomPlanet.friction,
    }));

    const texture = useTexture(randomPlanet.texture);

    return (
        <mesh ref={ref} castShadow>
            <sphereGeometry args={[radius, 32, 32]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}

export function ScatteredObjects() {
    const [objects, setObjects] = useState([]);
    const { obstacles } = useLevaControls();
    const lastBoxCount = useRef(obstacles.boxCount);
    const lastSphereCount = useRef(obstacles.sphereCount);
    const lastClearAll = useRef(obstacles.clearAll);

    useEffect(() => {
        // Handle box count change
        if (obstacles.boxCount !== lastBoxCount.current) {
            const currentBoxes = objects.filter(
                (obj) => obj.type === "box"
            ).length;
            const diff = obstacles.boxCount - currentBoxes;

            if (diff > 0) {
                // Add boxes
                const newBoxes = Array(diff)
                    .fill()
                    .map(() => ({
                        type: "box",
                        position: [
                            Math.random() * 10 - 5,
                            0.3,
                            Math.random() * 10 - 5,
                        ],
                    }));
                setObjects((prev) => [...prev, ...newBoxes]);
            } else if (diff < 0) {
                // Remove boxes
                setObjects((prev) => {
                    const boxes = prev.filter((obj) => obj.type === "box");
                    const others = prev.filter((obj) => obj.type !== "box");
                    return [...others, ...boxes.slice(0, obstacles.boxCount)];
                });
            }
            lastBoxCount.current = obstacles.boxCount;
        }

        // Handle sphere count change
        if (obstacles.sphereCount !== lastSphereCount.current) {
            const currentSpheres = objects.filter(
                (obj) => obj.type === "sphere"
            ).length;
            const diff = obstacles.sphereCount - currentSpheres;

            if (diff > 0) {
                // Add spheres
                const newSpheres = Array(diff)
                    .fill()
                    .map(() => ({
                        type: "sphere",
                        position: [
                            Math.random() * 10 - 5,
                            0.2,
                            Math.random() * 10 - 5,
                        ],
                    }));
                setObjects((prev) => [...prev, ...newSpheres]);
            } else if (diff < 0) {
                // Remove spheres
                setObjects((prev) => {
                    const spheres = prev.filter((obj) => obj.type === "sphere");
                    const others = prev.filter((obj) => obj.type !== "sphere");
                    return [
                        ...others,
                        ...spheres.slice(0, obstacles.sphereCount),
                    ];
                });
            }
            lastSphereCount.current = obstacles.sphereCount;
        }

        // Handle clear all
        if (obstacles.clearAll !== lastClearAll.current) {
            setObjects([]);
            lastClearAll.current = obstacles.clearAll;
        }
    }, [obstacles, objects]);

    return (
        <>
            {objects.map((obj, index) => {
                if (obj.type === "box") {
                    return <Box key={index} position={obj.position} />;
                } else if (obj.type === "sphere") {
                    return <Sphere key={index} position={obj.position} />;
                }
                return null;
            })}
        </>
    );
}
