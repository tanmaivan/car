import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function Rain({ enabled, intensity = 200 }) {
    const rainRef = useRef();
    const drops = useRef([]);

    useEffect(() => {
        if (!rainRef.current) return;

        // Clear old drops
        rainRef.current.clear();
        drops.current = [];

        for (let i = 0; i < intensity; i++) {
            const drop = new THREE.Mesh(
                new THREE.CylinderGeometry(0.01, 0.01, 0.4),
                new THREE.MeshBasicMaterial({ color: "#66ccff" })
            );

            drop.position.set(
                Math.random() * 100 - 50,
                Math.random() * 20 + 5,
                Math.random() * 100 - 50
            );

            rainRef.current.add(drop);
            drops.current.push(drop);
        }
    }, [enabled, intensity]);

    useFrame(() => {
        if (!enabled || !rainRef.current) return;

        drops.current.forEach((drop) => {
            drop.position.y -= 0.4;
            if (drop.position.y < 0) {
                drop.position.y = Math.random() * 20 + 10;
            }
        });
    });

    return <group ref={rainRef} />;
}
