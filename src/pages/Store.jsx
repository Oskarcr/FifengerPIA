import { Components } from "@/FifengerClient";
import "../css/Store.css";
import { useNavigate } from "react-router-dom";

export default function Store() {
    const navigate = useNavigate();

    const userPoints = 90;

    const storeItems = [
        { name: "Item", price: 300 },
        { name: "Item", price: 500 },
        { name: "Item", price: 250 },
        { name: "Item", price: 800 },
    ];

    const children = storeItems.map((item) => (
        <Components.StoreItem name={item.name} price={item.price}/>
    ));

    return (<>
        <div id="header">
            <Components.ButtonIcon icon="arrow_left_alt" onClick={() => navigate("/menu")} />
            <Components.Flexed className="header-title">
                Store 
            </Components.Flexed>
            <div className="points-display">
                Available: <span>{userPoints + " points"}</span>
            </div>
        </div>
        <div id="root-content" style={{
            display: "flex",
            alignItems: "center",
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "var(--spacing-medium)",
                padding: "var(--spacing-short)",
                marginLeft: "auto",
                marginRight: "auto"
            }}>
                {children}
            </div>
        </div>
    </>);
};