import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Components } from "@/FifengerClient";

export default function VideoCall() {
    const navigate = useNavigate();
    const videoRef = useRef(null);

    useEffect(() => {
        async function getMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: true 
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error al acceder a la cámara o micro:", err);
            }
        }

        getMedia();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div style={{ height: "100vh", backgroundColor: "#1a1a1a", display: "flex", flexDirection: "column", color: "white" }}>
            <header style={{ padding: "15px", display: "flex", alignItems: "center" }}>
                {/* Botón de volver arriba */}
                <Components.ButtonIcon 
                    icon="arrow_back" 
                    onClick={() => navigate("/")} 
                />
                <span style={{ marginLeft: "10px" }}>Videollamada con Low</span>
            </header>

            <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{ 
                        width: "80%", 
                        height: "70%", 
                        backgroundColor: "#000", 
                        borderRadius: "20px",
                        objectFit: "cover",
                        transform: "scaleX(-1)" 
                    }} 
                />
            </main>

            <footer style={{ padding: "30px", display: "flex", justifyContent: "center", gap: "30px" }}>
                <Components.ButtonIcon icon="mic" />
                
                {/* Botón de colgar abajo */}
                <Components.ButtonIcon 
                    icon="call_end" 
                    style={{ backgroundColor: "red" }} 
                    onClick={() => navigate("/")} 
                />
                
                <Components.ButtonIcon icon="videocam" />
            </footer>
        </div>
    );
}