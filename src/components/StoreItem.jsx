export default function StoreItem({
    name="", 
    price="", 
    src="./Mundial2026.jpg",
    type="",
    onBuy=undefined
}) {
    return (<div className="item-card">
        <img src={src}/>
        <h3 className="item-name">{name}</h3>
        <span className="item-price">{price + " points (" + type + ")"}</span>
        <button type="button" onClick={onBuy} className="buy-button">
            Adquirir
        </button>
    </div>);
}