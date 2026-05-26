import React, { useState, useEffect, Component, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Importamos la API que usa tu proyecto Fifenger
import { api, Components } from "@/FifengerClient"; 

export default function GroupTasks() {
    const { conversationId } = useParams(); 
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]); 
    const [taskInput, setTaskInput] = useState(""); 
    const didFetch = useRef(false);
    const [message, setMessage] = useState(null);

    // CARGAR TAREAS DE LA BASE DE DATOS REAL
    useEffect(() => {
        if(didFetch.current) return;
        didFetch.current = true;
        if (!conversationId) return;
        (async () => {
            try {
                // Hacemos la petición real a tu backend de MongoDB
                console.log("/conversations/" + conversationId + "/tasks")
                const response = await api.get(`/conversations/${conversationId}/tasks`);
                setTasks(response.data);
                console.log(response.data);
            } 
            catch (error) {
                showErrors(error);
            }
        })();
    }, [conversationId]);

    const showErrors = (error) => {
        console.log(error);
        setMessage({
            title: "Error",
            content: error?.response?.data?.errors || "Ha ocurrido un error"
        });
    }

    // 1. CREACIÓN DE TAREAS EN LA BASE DE DATOS
    const handleCreateTask = async () => {
        if (!taskInput.trim()) return;
        try {
            // Mandamos la tarea amarrada al ID del grupo real
            await api.post(`/conversations/${conversationId}/tasks`, { 
                title: taskInput 
            });

            window.location.reload();
        } 
        catch (error) {
            showErrors(error);
        }
    };

    // 2. MARCAR TAREA COMO COMPLETADA
    const handleCompleteTask = async (taskId) => {
        try {
            console.log(taskId);
            await api.patch(`/conversations/${conversationId}/tasks/complete`, {
                taskId
            });
            window.location.reload();
        } 
        catch (error) {
            showErrors(error);
        }
    };

    return (<>
        {message && <Components.MessageBox
            content={message.content}
            title={message.title}
            onConfirm={() => setMessage(null)}
        />}
        <div style={{ backgroundColor: "#141419", minHeight: "100vh", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
            {/* Header de la página */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "30px", gap: "15px" }}>
                <Components.ButtonIcon
                    icon="arrow_left"
                    onClick={() => navigate(-1)}
                />
                <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Group tasks</h2>
            </div>

            {/* Contenedor Principal */}
            <div style={{ maxWidth: "500px", margin: "0 auto", background: "#1e1e24", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                
                <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "20px" }}>
                    ID del Grupo: <span style={{ color: "#28a745" }}>{conversationId}</span>
                </p>

                {/* FORMULARIO DE CREACIÓN */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
                    <input 
                        type="text" 
                        placeholder="Escribe un pendiente para el equipo..." 
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
                        style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #444", background: "#2d2d34", color: "white", fontSize: "0.95rem" }}
                    />
                    <button 
                        onClick={handleCreateTask} 
                        style={{ background: "#28a745", color: "white", border: "none", padding: "0 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                        +
                    </button>
                </div>

                {/* LISTA DE RENDERS (TAREAS) */}
                <h3 style={{ fontSize: "1rem", color: "#888", marginBottom: "10px", borderBottom: "1px solid #333", paddingBottom: "5px" }}>Lista de Pendientes</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {tasks.length === 0 ? (
                        <p style={{ color: "#555", textAlign: "center", padding: "20px" }}>No hay tareas en este grupo.</p>
                    ) : (
                        tasks.map((task) => (
                            <div 
                                key={task.id} 
                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "#2d2d34", borderRadius: "6px", borderLeft: task.completed ? "4px solid #666" : "4px solid #28a745", transition: "all 0.3s" }}
                            >
                                <span style={{ color: task.completed ? "#666" : "white", textDecoration: task.completed ? "line-through" : "none", fontSize: "0.95rem", marginRight: "10px", overflowWrap: "anywhere" }}>
                                    {task.title}
                                </span>
                                
                                {!task.completed && (
                                    <button 
                                        onClick={() => handleCompleteTask(task.id)} 
                                        style={{ background: "#007bff", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold" }}
                                    >
                                        ✓ Terminar
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    </>);
}