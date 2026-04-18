// Exportaciones de paginas.

import Chat from "../pages/Chat";
import ChatList from "../pages/ChatList";
import Login from "../pages/Login";
import Menu from "../pages/Menu";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import Signup from "../pages/Signup";
import Store from "../pages/Store";
import Test from "../pages/Test.jsx";

/**
 * Es un objeto que tiene todas los componentes
 * que representan paginas.
 */
const Pages = {
    Chat,
    ChatList,
    Login,
    Menu,
    Profile,
    Signup,
    Store,
    Test,
    NotFound
};

Object.freeze(Pages);

export default Pages;