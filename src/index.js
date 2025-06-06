import "./index.css";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Physics } from "@react-three/cannon";
import { useState } from "react";

function App() {
    const [cameraMode, setCameraMode] = useState("Orbit");
    const [showInstructions, setShowInstructions] = useState(true);

    return (
        <>
            <Canvas>
                <Physics broadphase="SAP" gravity={[0, -2.6, 0]}>
                    <Scene onCameraModeChange={(mode) => setCameraMode(mode)} />
                </Physics>
            </Canvas>

            <div className="controls">
                <div
                    className="instructions-section"
                    style={{
                        display: showInstructions ? "block" : "none",
                        marginBottom: "10px",
                    }}
                >
                    <p>press w a s d to move</p>
                    <p>press e to brake, q to honk horn</p>
                    <p>
                        press j: orbit camera, k: perspective camera, l: free
                        camera, i: top-down camera
                    </p>
                    <p>in free camera mode: press 2, 4, 6, 8 to move camera</p>
                    <p>press r to reset</p>
                    <p>press arrows for flips</p>
                    <p>press n to toggle day/night</p>
                </div>

                <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    style={{
                        background: "none",
                        border: "1px solid white",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        color: "white",
                        cursor: "pointer",
                        marginBottom: "10px",
                        fontFamily: "monospace",
                        fontSize: "12px",
                    }}
                >
                    {showInstructions
                        ? "Hide Instructions"
                        : "Show Instructions"}
                </button>

                <div
                    className="camera-mode"
                    style={{
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "#00ff00",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        fontSize: "12px",
                        border: "1px solid #00ff00",
                        fontFamily: "monospace",
                    }}
                >
                    Current Camera Mode:{" "}
                    {cameraMode === "orbit"
                        ? "Orbit"
                        : cameraMode === "thirdPerson"
                        ? "Perspective"
                        : cameraMode === "free"
                        ? "Free"
                        : "Top-Down"}
                </div>
            </div>
        </>
    );
}

createRoot(document.getElementById("root")).render(<App />);
