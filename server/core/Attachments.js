import Path from "path";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

class AttachmentsManager {
    #storage = multer.memoryStorage();
    #uploader = multer({ 
        storage: this.#storage
    });
    #supabase = createClient(
        process.env["SUPABASE_URL"],
        process.env["SUPABASE_PUBLISHABLE_KEY"]
    );
    
    /**
     * Devuelve un middleware que procesa un unico archivo 
     * asociado al campo de formulario especificado.
     * @param {string} fieldName 
     */
    single(fieldName) {
        if(typeof fieldName !== "string") {
            throw new Error("El argumento 'fieldName' debe ser 'string'");
        }
        return this.#uploader.single(fieldName);
    }

    /**
     * Borra un archivo de la carpeta `attachments/` mediante su url.
     * @param {string} attachmentUrl 
     */
    async remove(attachmentUrl) {
        try {
            const { error } = await this.#supabase.storage
            .from("attachments")
            .remove([attachmentUrl]);

            if(error) throw error;
            return true;
        }
        catch(_) {
            return false;
        }
    }

    /**
     * Guarda un archivo `Express.Multer.File` previamente 
     * guardado en memoria `RAM`.
     * 
     * Devuelve `true` si se completo y `false` en caso contrario.
     * @param {Express.Multer.File} file 
     */
    async save(file) {
        const extension = Path.extname(file.originalname);
        const basename = Path.basename(file.originalname, extension);
        const fileOriginalName = (Date.now() + "_" + basename);
        const buffer = Buffer.from(fileOriginalName, "utf-8");
        const fileName = buffer.toString("base64url") + extension;
        const { error, data } = await this.#supabase.storage
        .from("attachments")
        .upload(fileName, file.buffer, {
            contentType: file.mimetype
        });

        if(error) throw error;
        return data.path;
    }
}

const Attachments = new AttachmentsManager();

export default Attachments;