import { Routes, Route } from 'react-router-dom';

// Importamos todas las páginas de tu carpeta /pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import ChatList from './pages/ChatList';
import VideoCall from './pages/VideoCall';
import Profile from './pages/Profile';
import Store from './pages/Store';
import Menu from './pages/Menu';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Rutas Principales */}
      <Route path="/" element={<Chat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Chat y Videollamada */}
      <Route path="/chat_list" element={<ChatList />} />
      <Route path="/video_call" element={<VideoCall />} />
      
      {/* Otras secciones */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/store" element={<Store />} />
      <Route path="/menu" element={<Menu />} />

      {/* Esta ruta atrapa cualquier error de escritura y muestra tu NotFound */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;