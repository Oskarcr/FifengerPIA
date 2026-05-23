import Path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

/**
 * Es la ruta de la carpeta en donde se encuentra 
 * este proyecto.
 */
const PROJECT_DIR = Path.dirname(__filename);

/**
 * Es la ruta de la carpeta en donde se encuentran
 * los archivos adjuntos creados por el usuario.
 */
const ATTACHMENTS_DIR = Path.join(PROJECT_DIR, "attachments");

/**
 * Es una consulta que se pone en `YourModel.find()` que
 * filtra los elementos activos unicamente.
 */
const QUERY_ACTIVE_ONLY = {
    active: {
        $ne: false
    }
};


/**
 * Un json que indica error de servidor.
 */
const JSON_SERVER_ERROR = { 
    errors: ["Server error, please, try again later..."]
};

/**
 * Un json donde se indica que no hay registros con el `id` especificado.
 */
const JSON_NOT_FOUND = {
    errors: ["No record matches the id."]
};

/**
 * Un json que indica que el campo `id` no se proporcionó.
 */
const JSON_MISSING_ID = {
    errors: ["The 'id' field was not provided."]
};

/**
 * Un json que le indica al usuario que todo salio bien.
 */
const JSON_OK = {
    message: "The action was successfully completed."
};

export {
    PROJECT_DIR,
    ATTACHMENTS_DIR,
    JSON_SERVER_ERROR,
    JSON_NOT_FOUND,
    JSON_MISSING_ID,
    JSON_OK,
    QUERY_ACTIVE_ONLY
};