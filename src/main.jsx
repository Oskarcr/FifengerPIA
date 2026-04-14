import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "./index.css";
import "./css/styles.css"
import { GlobalStyle, AppRoutes } from "@/Fifenger";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <div style={GlobalStyle}>
            <AppRoutes />
        </div>
    </StrictMode>,
)
