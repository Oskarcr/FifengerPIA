import { JSON_MISSING_ID, JSON_NOT_FOUND } from "#FifengerServer";
import { isValidObjectId } from "mongoose";

/**
 * Revisa si `const { id } = req.params;` existe y
 * es un `id` valido de mongodb.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export default function requireId(req, res, next) {
    const { id } = req.params;
    
    if(!id) {
        res.status(400).json(JSON_MISSING_ID);
        return;
    }

    if(!isValidObjectId(id)) {
        res.status(404).json(JSON_NOT_FOUND);
        return;
    }

    next();
}