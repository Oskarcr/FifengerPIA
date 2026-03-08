import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ChatList from './pages/ChatList.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChatList/>
  </StrictMode>,
)
