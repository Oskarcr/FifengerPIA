import { api, Components } from "@/FifengerClient";
import { useNavigate } from "react-router-dom";
import profile_decorations from "../json/profile_decorations.json";

// @ts-ignore
import "../css/Store.css";
import { useEffect, useRef, useState } from "react";

export default function Store() {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [points, setPoints] = useState(0);
    const didFetch = useRef(false);

    useEffect(() => {
        if(didFetch.current) return;
        didFetch.current = true;
        const userId = sessionStorage.getItem("id");
        (async () => {
            try {
                const { data } = await api.get("/users/" + userId);
                const decorations = structuredClone(profile_decorations);
                for(const item of data.inventory) {
                    delete decorations[item];
                }
                setPoints(data.points);
                setItems(Object.values(decorations));
            }
            catch(_) {}
        })();
        
    }, []);

    const children = items.map((item) => (
        <Components.StoreItem 
            name={item.label} 
            price={item.points}
            type={item.type}
            src={"/rewards/" + item.url}
        />
    ));

    return (<>
        <div id="header">
            <Components.ButtonIcon icon="arrow_left_alt" onClick={() => navigate("/menu")} />
            <Components.Flexed className="header-title">
                Store 
            </Components.Flexed>
            <div className="points-display">
                Available: <span>{points + " points"}</span>
            </div>
        </div>
        <div id="root-content" style={{
            display: "flex",
            alignItems: "center",
            overflow: "auto"
        }} onWheel={(evt) => {
            evt.currentTarget.scrollLeft += evt.deltaY;
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