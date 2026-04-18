import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; 
import "./index.css";
import "./css/styles.css";
import { AppRoutes, GlobalStyle } from "@/FifengerClient"; 

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <div style={GlobalStyle}>
            <AppRoutes/> 
        </div>
    </StrictMode>,
)