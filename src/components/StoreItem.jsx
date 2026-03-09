export default function StoreItem({name="", price="", src="https://aleteo.com.mx/wp-content/uploads/2025/04/show-de-medio-tiempo-para-el-mundial-2026.jpg"}) {
    return (<div className="item-card">
        <img src={src}/>
        <h3 className="item-name">{name}</h3>
        <span className="item-price">{price} points</span>
        <button className="buy-button">
            Adquirir
        </button>
    </div>);
}