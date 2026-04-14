import Pages from "./Pages.jsx";
import { Routes, Route, BrowserRouter } from "react-router-dom";

export default function AppRoutes() {
    return (<BrowserRouter>
        <Routes>
            <Route path="/" element= {<Pages.Login/>}/>
            <Route path="/chat" element= {<Pages.Chat/>}/>
            <Route path="/chat_list" element= {<Pages.ChatList/>}/>
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