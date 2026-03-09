import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import getPage from './Routes.jsx';

/** IA VENGO */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {getPage("store")}
  </StrictMode>,
)
