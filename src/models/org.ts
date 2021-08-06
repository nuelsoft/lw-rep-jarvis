import {Document, Schema} from "mongoose";
import mongoose from "mongoose";
import {IUser} from "./user";
import {Service} from "../@decorators/utils.decorator";

export interface IOrg extends Document {
    name: string,
    admin: string | IUser,
    officials?: string[] | IUser[],
    org_directory?: string[] | IOrg[],
    office?: string
}

@Service
export default class OrgService {

    static _model: mongoose.Model<IOrg>;

    private static get model() {
        this._model = this._model ?? mongoose.model<IOrg>("Org", this.schema)
        return this._model;
    }

    static get schema() {
        return new Schema({
            name: String,
            admin: String,
            officials: [{type: Schema.Types.ObjectId, ref: 'User'}],
            org_directory: [{type: Schema.Types.ObjectId, ref: 'Org'}],
            office: String
        })
    }

    static async save(data: Partial<IOrg>): Promise<IOrg> {
        return new this.model(data).save();
    }

    static async findById(id: string): Promise<IOrg> {
        return this.model.findById(id);
    }

    static async find({
                          keyword = "",
                          office = "church",
                          limit = 50,
                          skip = 0
                      }: { office: string, limit: number, skip: number, keyword: string }): Promise<Array<IOrg>> {
        return this.model.find({
            name: {$regex: new RegExp(keyword, "i")},
            office
        }).limit(limit).skip(skip).populate(["org_directory"]);
    }

    static async getOrgDirectory(id: string): Promise<Array<IOrg>> {
        let dir: IOrg[] = [];
        const leaf = await this.findById(id);
        if (!leaf && !leaf.org_directory) return dir;

        for (let e of leaf.org_directory) {
            if (typeof e != 'string') {
                dir.push(e);
                continue;
            }
            const parent = await this.findById(e);
            if (parent) dir.push(parent);
        }

        return dir;
    }


}