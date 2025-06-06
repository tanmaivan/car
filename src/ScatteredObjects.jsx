import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useCylinder, useSphere, useBox } from "@react-three/cannon";
import { useLevaControls } from "./useLevaControls";
import { useTexture, useGLTF } from "@react-three/drei";
import { MovingObstacle } from "./MovingObstacle";

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
        texture: "/textures/planets/2k_mercury.jpg",
        mass: 0.38, // Khối lượng so với Trái Đất
        restitution: 0.3, // Độ nảy thấp
        friction: 0.8, // Ma sát cao
    },
    venus: {
        texture: "/textures/planets/2k_venus_surface.jpg",
        mass: 0.91,
        restitution: 0.2,
        friction: 0.9,
    },
    mars: {
        texture: "/textures/planets/2k_mars.jpg",
        mass: 0.38,
        restitution: 0.4,
        friction: 0.7,
    },
    jupiter: {
        texture: "/textures/planets/2k_jupiter.jpg",
        mass: 2.5,
        restitution: 0.6,
        friction: 0.3,
    },
    saturn: {
        texture: "/textures/planets/2k_saturn.jpg",
        mass: 1.1,
        restitution: 0.5,
        friction: 0.4,
    },
    uranus: {
        texture: "/textures/planets/2k_uranus.jpg",
        mass: 0.9,
        restitution: 0.7,
        friction: 0.2,
    },
    neptune: {
        texture: "/textures/planets/2k_neptune.jpg",
        mass: 1.1,
        restitution: 0.6,
        friction: 0.3,
    },
};

// Các loại thùng phi khác nhau
const BARRELS = {
    red: {
        texture: "/textures/barrels/red_barrel.jpg",
        mass: 1.2,
        restitution: 0.3,
        friction: 0.8,
    },
    brown: {
        texture: "/textures/barrels/brown_barrel.jpg",
        mass: 1.0,
        restitution: 0.4,
        friction: 0.7,
    },
    gray: {
        texture: "/textures/barrels/gray_barrel.jpg",
        mass: 1.1,
        restitution: 0.35,
        friction: 0.75,
    },
};

function Barrel({ position }) {
    // Chọn ngẫu nhiên một loại thùng phi
    const barrelKeys = Object.keys(BARRELS);
    const randomBarrel =
        BARRELS[barrelKeys[Math.floor(Math.random() * barrelKeys.length)]];

    const [ref] = useCylinder(() => ({
        mass: randomBarrel.mass,
        position,
        args: [0.2, 0.2, 0.6, 16], // [radiusTop, radiusBottom, height, segments]
        restitution: randomBarrel.restitution,
        friction: randomBarrel.friction,
    }));

    const texture = useTexture(randomBarrel.texture);

    return (
        <mesh ref={ref} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
            <meshStandardMaterial
                map={texture}
                roughness={0.7}
                metalness={0.2}
            />
        </mesh>
    );
}

function Sphere({ position, radius = 0.2 }) {
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
    const lastBarrelCount = useRef(obstacles.boxCount);
    const lastSphereCount = useRef(obstacles.sphereCount);
    const lastClearAll = useRef(obstacles.clearAll);

    useEffect(() => {
        // Handle barrel count change
        if (obstacles.boxCount !== lastBarrelCount.current) {
            const currentBarrels = objects.filter(
                (obj) => obj.type === "barrel"
            ).length;
            const diff = obstacles.boxCount - currentBarrels;

            if (diff > 0) {
                // Add barrels
                const newBarrels = Array(diff)
                    .fill()
                    .map(() => ({
                        type: "barrel",
                        position: [
                            Math.random() * 10 - 5,
                            0.3,
                            Math.random() * 10 - 5,
                        ],
                    }));
                setObjects((prev) => [...prev, ...newBarrels]);
            } else if (diff < 0) {
                // Remove barrels
                setObjects((prev) => {
                    const barrels = prev.filter((obj) => obj.type === "barrel");
                    const others = prev.filter((obj) => obj.type !== "barrel");
                    return [...others, ...barrels.slice(0, obstacles.boxCount)];
                });
            }
            lastBarrelCount.current = obstacles.boxCount;
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
            {/* Chỉ hiển thị chướng ngại vật di chuyển khi được bật */}
            {obstacles.showMovingObstacle && (
                <MovingObstacle position={[0, 0, 0]} />
            )}

            {objects.map((obj, index) => {
                if (obj.type === "barrel") {
                    return <Barrel key={index} position={obj.position} />;
                } else if (obj.type === "sphere") {
                    return <Sphere key={index} position={obj.position} />;
                }
                return null;
            })}
        </>
    );
}
