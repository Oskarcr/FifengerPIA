import ChatList from "./pages/ChatList";
import Login from "./pages/Login";
import MenuList from "./pages/MenuList";
import Signup from "./pages/Signup";

const ROUTES_PAGES = {
    "chat_list": <ChatList/>,
    "menu_list": <MenuList/>,
    "login": <Login/>,
    "signup": <Signup/>
}

/**
 * Devuelve el `JSX.Element` que representa una pagina entera del programa.
 * @param {keyof ROUTES_PAGES} pageName 
 */
export default function getPage(pageName) {
    return ROUTES_PAGES[pageName] || (<></>);
}