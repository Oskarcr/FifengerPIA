import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; 
import "./index.css";
import "./css/styles.css";
import { GlobalStyle } from "@/FifengerClient"; 
import App from "./App"; 

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router> 
            <div style={GlobalStyle}>
                <App /> 
            </div>
        </Router>
    </StrictMode>,
)