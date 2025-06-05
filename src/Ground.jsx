import { usePlane } from "@react-three/cannon";
import { MeshReflectorMaterial } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { BufferAttribute, TextureLoader, RepeatWrapping, Vector3 } from "three";
import { useLevaControls } from "./useLevaControls";
import { useFrame } from "@react-three/fiber";

export function Ground() {
    const [ref] = usePlane(
        () => ({
            type: "Static",
            rotation: [-Math.PI / 2, 0, 0],
        }),
        useRef(null)
    );

    const gridMap = useLoader(
        TextureLoader,
        process.env.PUBLIC_URL + "/textures/grid.png"
    );

    const aoMap = useLoader(
        TextureLoader,
        process.env.PUBLIC_URL + "/textures/ground-ao.png"
    );

    const alphaMap = useLoader(
        TextureLoader,
        process.env.PUBLIC_URL + "/textures/alpha-map.png"
    );

    const snowDisplacementMap = useLoader(
        TextureLoader,
        process.env.PUBLIC_URL + "/textures/snow_displacement.jpg"
    );

    const meshRef = useRef(null);
    const meshRef2 = useRef(null);
    const snowMeshRef = useRef(null);
    const { weather } = useLevaControls();
    const [snowOpacity, setSnowOpacity] = useState(0);
    const [displacementScale, setDisplacementScale] = useState(0);

    useEffect(() => {
        if (!gridMap || !snowDisplacementMap) return;
        gridMap.anisotropy = 16;
        snowDisplacementMap.anisotropy = 16;
        snowDisplacementMap.wrapS = snowDisplacementMap.wrapT = RepeatWrapping;
        snowDisplacementMap.repeat.set(8, 8);
    }, [gridMap, snowDisplacementMap]);

    useEffect(() => {
        if (!meshRef.current) return;

        var uvs = meshRef.current.geometry.attributes.uv.array;
        meshRef.current.geometry.setAttribute(
            "uv2",
            new BufferAttribute(uvs, 2)
        );

        var uvs2 = meshRef2.current.geometry.attributes.uv.array;
        meshRef2.current.geometry.setAttribute(
            "uv2",
            new BufferAttribute(uvs2, 2)
        );
    }, [meshRef.current]);

    // Animate snow accumulation
    useEffect(() => {
        if (weather.showSnow) {
            const targetOpacity = 0.95;
            const targetDisplacement = 0.15;
            const duration = 3000; // 3 seconds
            const startTime = Date.now();
            const startOpacity = snowOpacity;
            const startDisplacement = displacementScale;

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const newOpacity =
                    startOpacity + (targetOpacity - startOpacity) * progress;
                const newDisplacement =
                    startDisplacement +
                    (targetDisplacement - startDisplacement) * progress;
                setSnowOpacity(newOpacity);
                setDisplacementScale(newDisplacement);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            animate();
        } else {
            const duration = 2000; // 2 seconds
            const startTime = Date.now();
            const startOpacity = snowOpacity;
            const startDisplacement = displacementScale;

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const newOpacity = startOpacity * (1 - progress);
                const newDisplacement = startDisplacement * (1 - progress);
                setSnowOpacity(newOpacity);
                setDisplacementScale(newDisplacement);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            animate();
        }
    }, [weather.showSnow]);

    // Update snow surface based on vehicle movement
    useFrame((state) => {
        if (!snowMeshRef.current || !weather.showSnow) return;

        // Get vehicle position
        const vehicle = state.scene.getObjectByName("vehicle");
        if (!vehicle) return;

        const vehiclePos = new Vector3();
        vehicle.getWorldPosition(vehiclePos);

        // Calculate distance from vehicle to snow center
        const snowCenter = new Vector3(-2.285, 0, -1.325);
        const distance = vehiclePos.distanceTo(snowCenter);

        // If vehicle is on snow, create depression
        if (distance < 3) {
            const snowGeometry = snowMeshRef.current.geometry;
            const positions = snowGeometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const z = positions[i + 2];
                const pointPos = new Vector3(x, 0, z).add(snowCenter);
                const distToVehicle = pointPos.distanceTo(vehiclePos);

                if (distToVehicle < 0.5) {
                    positions[i + 1] = -0.05 * (1 - distToVehicle / 0.5);
                }
            }

            snowGeometry.attributes.position.needsUpdate = true;
            snowGeometry.computeVertexNormals();
        }
    });

    return (
        <>
            <mesh
                ref={meshRef2}
                position={[-2.285, -0.01, -1.325]}
                rotation-x={-Math.PI * 0.5}
            >
                <planeGeometry args={[12, 12]} />
                <meshBasicMaterial
                    opacity={0.325}
                    alphaMap={gridMap}
                    transparent={true}
                    color={"white"}
                />
            </mesh>

            <mesh
                ref={meshRef}
                position={[-2.285, -0.015, -1.325]}
                rotation-x={-Math.PI * 0.5}
                rotation-z={-0.079}
            >
                <circleGeometry args={[6.12, 50]} />
                <MeshReflectorMaterial
                    aoMap={aoMap}
                    alphaMap={alphaMap}
                    transparent={true}
                    color={[0.5, 0.5, 0.5]}
                    envMapIntensity={0.35}
                    metalness={0.05}
                    roughness={0.4}
                    dithering={true}
                    blur={[1024, 512]}
                    mixBlur={3}
                    mixStrength={30}
                    mixContrast={1}
                    resolution={1024}
                    mirror={0}
                    depthScale={0}
                    minDepthThreshold={0.9}
                    maxDepthThreshold={1}
                    depthToBlurRatioBias={0.25}
                    debug={0}
                    reflectorOffset={0.02}
                />
            </mesh>

            {/* Snow layer */}
            <mesh
                ref={snowMeshRef}
                position={[-2.285, -0.015, -1.325]}
                rotation-x={-Math.PI * 0.5}
            >
                <circleGeometry args={[6.12, 100, 100]} />
                <meshStandardMaterial
                    displacementMap={snowDisplacementMap}
                    displacementScale={displacementScale}
                    color="#ffffff"
                    transparent={true}
                    opacity={snowOpacity}
                    roughness={0.7}
                    metalness={0.1}
                />
            </mesh>
        </>
    );
}
