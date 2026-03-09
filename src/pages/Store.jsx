import React, { useState } from 'react';
import "../css/Store.css";
import Flexed from '../components/Flexed';
import ButtonIcon from '../components/ButtonIcon';
import getPage from '../Routes';
import StoreItem from '../components/StoreItem';

export default function Store() {
    const PAGE_NAME = "store";
    
    const [userPoints, setUserPoints] = useState(1500);
    const [pageName, setPage] = useState(PAGE_NAME);
    if (pageName != PAGE_NAME) {
        return getPage(pageName);
    }

    const storeItems = [
        { name: "Item", price: 300 },
        { name: "Item", price: 500 },
        { name: "Item", price: 250 },
        { name: "Item", price: 800 },
    ];

    const children = storeItems.map((item) => (
        <StoreItem name={item.name} price={item.price}/>
    ));

    return (<>
        <div id="header">
            <ButtonIcon icon="arrow_left_alt" onClick={() => setPage("menu_list")} />
            <Flexed className="header-title">
                Store 
            </Flexed>
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
                gap: "var(--padding-medium)",
                padding: "var(--padding-short)",
                marginLeft: "auto",
                marginRight: "auto"
            }}>
                {children}
            </div>
        </div>
    </>);
};