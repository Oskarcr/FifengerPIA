import Pages from "./Pages.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";

export default function AppRoutes() {
    return (<BrowserRouter>
        <Routes>
            <Route path="/" element= {<Pages.Login/>}/>
            <Route path="/chats/temp/:destinatorId" element={<Pages.Chat/>}/>
            <Route path="/chats" element= {<Pages.ChatList/>}/>
            <Route path="/chats/:conversationId" element={<Pages.Chat/>}/>
            <Route path="/login" element= {<Pages.Login/>}/>
            <Route path="/menu" element= {<Pages.Menu/>}/>
            <Route path="/profile" element= {<Pages.Profile/>}/>
            <Route path="/signup" element= {<Pages.Signup/>}/>
            <Route path="/store" element= {<Pages.Store/>}/>
            {/* Cualquier pagina que no sea las de arriba */}
            <Route path="*" element= {<Pages.NotFound/>}/>
        </Routes>
    </BrowserRouter>);
}