import * as crypto from "crypto";

const MASTER_ENCRYPTION_KEY = process.env["MASTER_ENCRYPTION_KEY"];
const ALG = "aes-256-cbc";

class FifengerCryptable {
    /**
     * Encripta el contenido mediante `felk`.
     * @param {string} content
     * @param {string} conversationId 
     * @param {string} felk
     */
    encrypt (content, conversationId, felk) {
        try {
            const buffer = Buffer.from("fifenger-" + conversationId + "-" + MASTER_ENCRYPTION_KEY + "-" + felk, "utf-8");
            const encodedKey = buffer.toString("base64url");
            
            const key = crypto.createHash("sha256").update(encodedKey).digest();
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(ALG, key, iv);
            
            let encrypted = cipher.update(content, "utf8", "hex");
            encrypted += cipher.final("hex");
            return iv.toString("hex") + ":" + encrypted;
        } 
        catch (error) {
            return content;
        }
    };

    /**
     * Desencripta el contenido mediante `felk`.
     * @param {string} encrypted
     * @param {string} conversationId 
     * @param {string} felk 
     * @returns 
     */
    decrypt(encrypted, conversationId, felk) {
        try {
            if (!encrypted.includes(":")) return encrypted;
            const [ivHex, encryptedText] = encrypted.split(":");
            const iv = Buffer.from(ivHex, "hex");

            const buffer = Buffer.from("fifenger-" + conversationId + "-" + MASTER_ENCRYPTION_KEY + "-" + felk, "utf-8");
            const encodedKey = buffer.toString("base64url");

            const key = crypto.createHash("sha256").update(encodedKey).digest();
            const decipher = crypto.createDecipheriv(ALG, key, iv);

            let decrypted = decipher.update(encryptedText, "hex", "utf8");
            decrypted += decipher.final("utf8");
            return decrypted;
        } 
        catch (error) {
            return encrypted;
        }
    }

    /**
     * Retorna una llave aleatoria.
     */
    felk() {
        return crypto.randomBytes(16).toString("hex");
    }
}

const FifengerCrypto = new FifengerCryptable();

Object.freeze(FifengerCrypto);

export default FifengerCrypto;