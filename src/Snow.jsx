import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

export function Snow({ enabled, intensity = 200 }) {
    const snowRef = useRef();
    const flakes = useRef([]);

    useEffect(() => {
        if (!snowRef.current) return;

        // Clear old flakes
        snowRef.current.clear();
        flakes.current = [];

        if (enabled) {
            for (let i = 0; i < intensity; i++) {
                const flake = new THREE.Mesh(
                    new THREE.SphereGeometry(0.02, 8, 8),
                    new THREE.MeshBasicMaterial({ color: "#ffffff" })
                );

                flake.position.set(
                    Math.random() * 100 - 50,
                    Math.random() * 20 + 5,
                    Math.random() * 100 - 50
                );

                snowRef.current.add(flake);
                flakes.current.push(flake);
            }
        }
    }, [enabled, intensity]);

    useFrame(() => {
        if (!enabled || !snowRef.current) return;

        flakes.current.forEach((flake) => {
            flake.position.y -= 0.2;
            flake.position.x += Math.sin(flake.position.y * 0.1) * 0.1;
            if (flake.position.y < 0) {
                flake.position.y = Math.random() * 20 + 10;
                flake.position.x = Math.random() * 100 - 50;
            }
        });
    });

    return <group ref={snowRef} />;
}
