import React, { useState } from 'react';
import "../css/Store.css";

const Store = () => {

  const [userPoints, setUserPoints] = useState(1500);


  const storeItems = [
    { id: 1, name: "Banner del Mundial", price: 300 },
    { id: 2, name: "Avatar de Mascota de México", price: 500 },
    { id: 3, name: "Marco de Neón", price: 250 },
    { id: 4, name: "Fondo Animado", price: 800 },
  ];


  const handleBuy = (item) => {
    if (userPoints >= item.price) {
      setUserPoints(userPoints - item.price);
      alert(`¡Felicidades! Has adquirido: ${item.name}`);
    } else {
      alert("No tienes suficientes puntos para este artículo ");
    }
  };

  return (
    <div className="store-container">
      <header className="store-header">
        <h1>Tienda de Puntos</h1>
        <div className="points-display">
          Mis Puntos: <span>{userPoints}</span>
        </div>
      </header>

      <div className="items-grid">
        {storeItems.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-icon">💎</div> {/* ICONO */}
            <h3 className="item-name">{item.name}</h3>
            <span className="item-price">{item.price} pts</span>
            <button className="buy-button" onClick={() => handleBuy(item)}>
              Adquirir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Store;

