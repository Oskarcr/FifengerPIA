import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import getPage from './Routes.jsx'
import Login from './pages/Login.jsx'
import MenuList from './pages/MenuList.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {getPage("login")}
  </StrictMode>,
)
