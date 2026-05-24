import profile_decorations from "../json/profile_decorations.json";

/**
 * @typedef Item 
 * @property {string} label
 * @property {string} url
 * @property {number} points
 * @property {"banner" | "picture"} type
 */

class ItemManager {
    /**
     * Devuelve el item mediante la `id`.
     * @param {string | number} key 
     */
    get(key) {
        /**@type {Item} */
        const item = profile_decorations[key];
        return item;
    }
}

const Items = new ItemManager();

Object.freeze(Items);

export default Items;