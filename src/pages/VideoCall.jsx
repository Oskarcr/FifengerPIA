import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Components, socket } from "@/FifengerClient";

export default function VideoCall() {
    const navigate = useNavigate();

    const [ muted, setMuted ] = useState(false);
    const [ cameraEnabled, setCameraEnabled ] = useState(true);

    /**@type {React.RefObject<HTMLVideoElement>} */
    const videoRef = useRef(null);
    /**@type {React.RefObject<HTMLVideoElement>} */
    const remoteVideoRef = useRef(null);

    /**@type {React.RefObject<RTCPeerConnection>} */
    const peerRef = useRef(null);

    const { conversationId } = useParams();

    useEffect(() => {
        let isMounted = true; 

        peerRef.current = new RTCPeerConnection({
            iceServers: [{ 
                urls: "stun:stun.l.google.com:19302" 
            }]
        });

        const iceCandidatesQueue = [];

        peerRef.current.onconnectionstatechange = () => {
            console.log("Estado de conexión:", peerRef.current.connectionState);
        };

        const updateQueue = async () => {
            while (iceCandidatesQueue.length > 0) {
                const cand = iceCandidatesQueue.shift();
                await peerRef.current.addIceCandidate(cand).catch(e => console.error(e));
            }
        }

        const onOffer = async ({ offer }) => {
            if (!peerRef.current) return;
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);
            socket.emit("rtc_answer", { answer });
            await updateQueue();
        };

        const onAnswer = async ({ answer }) => {
            if (!peerRef.current) return;
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            await updateQueue();
        }

        const onIceCandidate = async ({ candidate }) => {
            if (!peerRef.current) return;
            try {
                const rtcCandidate = new RTCIceCandidate(candidate);
                if (peerRef.current.remoteDescription) {
                    await peerRef.current.addIceCandidate(rtcCandidate);
                } else {
                    iceCandidatesQueue.push(rtcCandidate);
                }
            } catch (e) {
                console.error(e);
            }
        };

        const onCallCreated = async () => {
            if (!peerRef.current) return;
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            socket.emit("rtc_offer", { offer });
        }

        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true
                    },
                });

                if (!isMounted || !peerRef.current || peerRef.current.signalingState === "closed") {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                if (videoRef.current) videoRef.current.srcObject = stream;

                stream.getTracks().forEach(track => peerRef.current.addTrack(track, stream));

                peerRef.current.ontrack = async (evt) => {
                    console.log("TRACK RECIBIDA", evt.track.kind);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = evt.streams[0];

                        try {
                            await remoteVideoRef.current.play();
                        } catch (e) {
                            console.error("No se pudo reproducir:", e);
                        }
                    }
                };

                peerRef.current.onicecandidate = (evt) => {
                    if (evt.candidate) {
                        socket.emit("ice_candidate", {
                            candidate: evt.candidate 
                        });
                    }
                };

                socket.on("call_created", onCallCreated);
                socket.on("rtc_offer", onOffer);
                socket.on("rtc_answer", onAnswer);
                socket.on("ice_candidate", onIceCandidate);

                socket.emit("join_call", { 
                    conversationId 
                });
            } 
            catch (err) {
                console.error(err);
            }
        })();

        return () => {
            isMounted = false;

            const srcObject = videoRef.current?.srcObject;
            if (srcObject instanceof MediaStream) {
                srcObject.getTracks().forEach(track => track.stop());
            }

            socket.emit("leave_call");
            socket.off("call_created", onCallCreated);
            socket.off("rtc_offer", onOffer);
            socket.off("rtc_answer", onAnswer);
            socket.off("ice_candidate", onIceCandidate);

            if (peerRef.current && peerRef.current.signalingState !== "closed") {
                peerRef.current.close();
                peerRef.current = null;
            }
        };
    }, [conversationId]);

    const onEndCall = () => {

    }

    const onSwitchMicro = () => {
        setMuted((prevMuted) => {
            const isMuted = !prevMuted;
            const srcObject = videoRef.current?.srcObject;
            if (srcObject instanceof MediaStream) {
                srcObject.getAudioTracks().forEach(track => {
                    track.enabled = !isMuted; 
                });
            }
            return isMuted;
        });
    };

    const onSwitchCam = () => {
        setCameraEnabled((prev) => {
            const enabled = !prev;
            const srcObject = videoRef.current?.srcObject;
            if (srcObject instanceof MediaStream) {
                srcObject.getVideoTracks().forEach(track => {
                    track.enabled = enabled; 
                });
            }
            return enabled;
        });
    };

    return (
        <div style={{ height: "100vh", backgroundColor: "#1a1a1a", display: "flex", flexDirection: "column", color: "white" }}>      
            <div id="header">
                <Components.ButtonIcon icon="arrow_back" onClick={onEndCall}/>
                <Components.Flexed  className="header-title">
                    {"Call"}
                </Components.Flexed>
            </div>
            <div style={{
                flex: 1,
                display: "flex",
                position: "relative",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div id="call-video-container">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted={true}
                        playsInline
                        className="call-video"
                    />
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="call-video"
                    />
                </div>
            </div>
            <footer className="chat-input-area" style={{
                justifyContent: "center"
            }}>
                <Components.ButtonIcon 
                    darkgray 
                    icon={cameraEnabled ? "videocam" : "videocam_off"} 
                    onClick={onSwitchCam}
                />
                <Components.ButtonIcon 
                    darkgray 
                    icon={muted ? "mic_off" : "mic"} 
                    onClick={onSwitchMicro}
                />
                <Components.ButtonIcon darkgray icon="call_end" onClick={onEndCall}/>
            </footer>
        </div>
    );
}