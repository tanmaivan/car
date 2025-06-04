import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

export function Snow({ enabled = true, intensity = 200 }) {
    const snowRef = useRef();
    const flakes = useRef([]);

    useEffect(() => {
        if (!snowRef.current) return;

        // Xóa các flake cũ
        snowRef.current.clear();
        flakes.current = [];

        for (let i = 0; i < intensity; i++) {
            const flake = new THREE.Mesh(
                new THREE.SphereGeometry(0.05, 6, 6),
                new THREE.MeshBasicMaterial({ color: "white" })
            );

            flake.position.set(
                Math.random() * 100 - 50,
                Math.random() * 20 + 10,
                Math.random() * 100 - 50
            );

            snowRef.current.add(flake);
            flakes.current.push(flake);
        }
    }, [enabled, intensity]);

    useFrame(() => {
        if (!enabled || !snowRef.current) return;

        flakes.current.forEach((flake) => {
            flake.position.y -= 0.03;
            flake.position.x += Math.sin(flake.position.y * 0.5) * 0.005;

            if (flake.position.y < 0) {
                flake.position.y = Math.random() * 20 + 10;
                flake.position.x = Math.random() * 100 - 50;
                flake.position.z = Math.random() * 100 - 50;
            }
        });
    });

    return <group ref={snowRef} />;
}
