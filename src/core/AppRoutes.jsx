import Pages from "./Pages.jsx";
import { Routes, Route, BrowserRouter, Navigate, Outlet } from "react-router-dom";
import GroupTasks from "../pages/GroupTasks.jsx";

function ProtectedRoute() {
    const email = sessionStorage.getItem("email");

    if (!email || !email.trim()) {
        return <Navigate to={"/login"} replace />
    }

    return <Outlet />
}

export default function AppRoutes() {
    return (<BrowserRouter>
        <Routes>
            <Route path="/signup" element={<Pages.Signup />} />
            <Route path="/login" element={<Pages.Login />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Pages.ChatList />} />
                <Route path="/chats/temp/:destinatorId" element={<Pages.Chat />} />
                <Route path="/chats" element={<Pages.ChatList />} />
                <Route path="/chats/:conversationId/tasks" element={<GroupTasks />} />
                <Route path="/chats/:conversationId" element={<Pages.Chat />} />
                <Route path="/menu" element={<Pages.Menu />} />
                <Route path="/profile" element={<Pages.Profile />} />
                <Route path="/store" element={<Pages.Store />} />
                <Route path="/call/:conversationId" element={<Pages.VideoCall/>} />
                <Route path="/profiles/:id" element={<Pages.Profile />} />
            </Route>
            {/* Cualquier pagina que no sea las de arriba */}
            <Route path="/test" element={<Pages.Test />} />
            <Route path="*" element={<Pages.NotFound />} />
        </Routes>
    </BrowserRouter>);
}