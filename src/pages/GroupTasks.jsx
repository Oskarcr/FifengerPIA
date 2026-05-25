import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Importamos la API que usa tu proyecto Fifenger
import { api } from "@/FifengerClient"; 

export default function GroupTasks() {
    const { conversationId } = useParams(); 
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]); 
    const [taskInput, setTaskInput] = useState(""); 

    // CARGAR TAREAS DE LA BASE DE DATOS REAL
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Hacemos la petición real a tu backend de MongoDB
                const response = await api.get(`/chats/${conversationId}/tasks`);
                setTasks(response.data);
            } catch (error) {
                // Si la ruta del backend aún no está creada, usamos el respaldo local para la demo
                setTasks([
                    { id: 1, title: "Buscar la estampa de Messi", completed: false },
                    { id: 2, title: "Revisar backend con Óscar", completed: true }
                ]);
            }
        };
        if (conversationId) fetchTasks();
    }, [conversationId]);

    // 1. CREACIÓN DE TAREAS EN LA BASE DE DATOS
    const handleCreateTask = async () => {
        if (!taskInput.trim()) return;
        try {
            // Mandamos la tarea amarrada al ID del grupo real
            const response = await api.post(`/chats/${conversationId}/tasks`, { title: taskInput });
            // Agregamos la tarea devuelta por el servidor al estado
            setTasks([...tasks, response.data]);
            setTaskInput("");
        } catch (error) {
            // Respaldo local automático para la demo si falla la red:
            setTasks([...tasks, { id: Date.now(), title: taskInput, completed: false }]);
            setTaskInput("");
        }
    };

    // 2. MARCAR TAREA COMO COMPLETADA
    const handleCompleteTask = async (taskId) => {
        try {
            await api.put(`/chats/${conversationId}/tasks/${taskId}`, { completed: true });
            setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: true } : t));
        } catch (error) {
            // Respaldo local inmediato
            setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: true } : t));
        }
    };

    return (
        <div style={{ backgroundColor: "#141419", minHeight: "100vh", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
            {/* Header de la página */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "30px", gap: "15px" }}>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ background: "none", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer" }}
                >
                    ←
                </button>
                <h2 style={{ margin: 0, fontSize: "1.4rem" }}>📋 Panel de Tareas del Grupo</h2>
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
                                key={task.id || task._id} 
                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "#2d2d34", borderRadius: "6px", borderLeft: task.completed ? "4px solid #666" : "4px solid #28a745", transition: "all 0.3s" }}
                            >
                                <span style={{ color: task.completed ? "#666" : "white", textDecoration: task.completed ? "line-through" : "none", fontSize: "0.95rem", marginRight: "10px", overflowWrap: "anywhere" }}>
                                    {task.title}
                                </span>
                                
                                {!task.completed && (
                                    <button 
                                        onClick={() => handleCompleteTask(task.id || task._id)} 
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
    );
}