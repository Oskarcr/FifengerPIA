// Exportacion empaquetada de toda la aplicacion.

export { default as Items } from "./core/Items.js";
export { default as getLocationURL } from "./core/getLocationURL.js";
export { default as GlobalStyle } from "./core/GlobalStyle.js";
export { default as Components} from "./core/Components.jsx";
export { default as Pages } from "./core/Pages.jsx";
export { default as FontSize } from "./core/FontSize.js";
export { default as Spacing } from "./core/Spacing.js";
export { default as AppRoutes } from "./core/AppRoutes.jsx";
export { default as api } from "./core/api.js";
export { socket } from "./core/socket.js";

/** Equivalente a `(evt) => evt.preventDefault()`.*/
export const preventDefault = (evt) => evt.preventDefault();