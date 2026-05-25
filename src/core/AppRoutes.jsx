import Pages from "./Pages.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import GroupTasks from "../pages/GroupTasks.jsx";

export default function AppRoutes() {
    return (<BrowserRouter>
        <Routes>
            <Route path="/" element= {<Pages.ChatList/>}/>
            
            <Route path="/chats/temp/:destinatorId" element={<Pages.Chat/>}/>
            <Route path="/chats" element= {<Pages.ChatList/>}/>
            <Route path="/chats/:conversationId" element={<Pages.Chat/>}/>
            <Route path="/login" element= {<Pages.Login/>}/>
            <Route path="/menu" element= {<Pages.Menu/>}/>
            <Route path="/chats/:conversationId/tasks" element={<GroupTasks />} />
            <Route path="/profile" element= {<Pages.Profile/>}/>
            <Route path="/signup" element= {<Pages.Signup/>}/>
            <Route path="/store" element= {<Pages.Store/>}/>
            <Route path="/call/:conversationId" element={<Pages.VideoCall/>} />
            
            {/* Cualquier pagina que no sea las de arriba */}
            <Route path="/test" element= {<Pages.Test/>} />
            <Route path="/profiles/:id" element={<Pages.Profile/>}/>
            <Route path="*" element= {<Pages.NotFound/>} />
        </Routes>
    </BrowserRouter>);
}