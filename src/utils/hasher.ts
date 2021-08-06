import crypt from "bcryptjs"

export default class Hash {
    static create(password: string): string {
        return crypt.hashSync(password);
    }

    static compare(password: string, hash: string): boolean {
        return crypt.compareSync(password, hash);
    }
}

