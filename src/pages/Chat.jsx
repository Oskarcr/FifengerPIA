import React, { useState } from 'react';
import "./Chat.css";

const Chat = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="chat-layout">
      {/* Barra Lateral: Grupos del Mundial */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Mundial 2026 ⚽</h3>
          <button className="new-group-btn" title="Crear grupo de porra">+</button>
        </div>
        <div className="chat-list">
          <div className="chat-item active">
            <div className="avatar">🇲🇽</div>
            <div className="chat-info">
              <h4>Fans México</h4>
              <p>Luis: ¡Mañana es el debut!</p>
            </div>
          </div>
          <div className="chat-item">
            <div className="avatar">🏆</div>
            <div className="chat-info">
              <h4>Predicciones Final</h4>
              <p>Admin: ¿Quién gana el trofeo?</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Ventana de Chat Principal */}
      <main className="chat-main">
        <header className="chat-main-header">
          <div className="header-user">
            <h4>🇲🇽 Fans México (Grupo)</h4>
            <span>128 miembros listos para el partido</span>
          </div>
          <div className="header-actions">
            <button title="Videollamada para el partido">📞</button>
            <button title="Ubicación del Estadio" className="special-btn">📍</button>
            <button title="Crear Grupo con Amigo" className="special-btn">👥 +</button>
          </div>
        </header>

        <section className="messages-area world-cup-bg">
          <div className="message received">
            <span className="sender">Luis</span>
            <p>¿Alguien tiene el mapa para llegar al Estadio Azteca? 🏟️</p>
            <span className="time">10:05 AM</span>
          </div>
          <div className="message sent">
            <p>¡Yo lo tengo! Ahorita comparto la ubicación por aquí.</p>
            <span className="time">10:07 AM</span>
          </div>
        </section>

        <footer className="chat-input-area">
          <button className="attach-btn" title="Subir Tarea o Multimedia">➕</button>
          <input 
            type="text" 
            placeholder="Escribe un mensaje futbolero..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="send-btn">Enviar ⚽</button>
        </footer>
      </main>
    </div>
  );
};

export default Chat;