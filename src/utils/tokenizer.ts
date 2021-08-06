import jwt from "jsonwebtoken"
import properties from "./properties";


export default class Tokenizer {
    /**
     *
     * @param {Object} data
     * @returns String
     */
    static create(data: object) {
        if (!properties.jwt.secret)
            throw Error("JWT_SECRET_KEY couldn't be retrieved")
        return jwt.sign(data, properties.jwt.secret);
    }

    /**
     *
     * @param {String} token
     * @returns Object
     */
    static decode(token: string): { [key: string]: any } | null {
        if (!properties.jwt.secret)
            throw Error("JWT_SECRET_KEY couldn't be retrieved")
        try {
            return jwt.verify(token, properties.jwt.secret) as { [key: string]: any };
        } catch (e) {
            return null;
        }
    }
}

