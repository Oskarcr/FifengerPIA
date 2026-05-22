import Path from "path";
import { writeFileSync, existsSync, unlinkSync } from "fs";
import { ATTACHMENTS_DIR } from "#FifengerServer";
import multer from "multer";

class AttachmentsManager {
    #storage = multer.memoryStorage();
    #uploader = multer({ 
        storage: this.#storage
    });
    
    /**
     * Devuelve un middleware que procesa un unico archivo 
     * asociado al campo de formulario especificado.
     * @param {string} fieldName 
     */
    single(fieldName) {
        if(typeof fieldName !== "string") {
            throw new Error("El argumento 'fieldName' debe ser 'string'");
        }
        return this.#uploader.single(fieldName)
    }

    /**
     * Borra un archivo de la carpeta `attachments/` mediante su url.
     * @param {string} attachmentUrl 
     */
    delete(attachmentUrl) {
        const path = Path.join(ATTACHMENTS_DIR, attachmentUrl);
        try {
            if(!existsSync(path)) return false;
            unlinkSync(path);
            return true;
        }
        catch(_) {
            return false;
        }
    }

    /**
     * Guarda un archivo `Express.Multer.File` previamente 
     * guardado en memoria `RAM` en la carpeta `attachments/`.
     * 
     * Devuelve `true` si se completo y `false` en caso contrario.
     * @param {Express.Multer.File} file 
     */
    save(file) {
        const extension = Path.extname(file.originalname);
        const basename = Path.basename(file.originalname, extension);
        const fileOriginalName = (Date.now() + "_" + basename);
        const buffer = Buffer.from(fileOriginalName, "utf-8");
        const fileName = buffer.toString("base64url") + extension;
        const filePath = Path.join(ATTACHMENTS_DIR, fileName);
        writeFileSync(filePath, file.buffer);
        return fileName;
    }
}

const Attachments = new AttachmentsManager();

export default Attachments;