import * as mongoose from "mongoose";
import {Service} from "../@decorators/utils.decorator";
import {IOrg} from "./org";
import {IEvent} from "./event";

export interface IProject extends mongoose.Document {
    date: number;
    title: string;
    organization: string | IOrg;
    details: string;
    event: string | IEvent;
    banner: string;
}

@Service
export default class ProjectService {
    static _model: mongoose.Model<IProject>;

    private static get model() {
        this._model = this._model ?? mongoose.model<IProject>("Project", this.schema)
        return this._model;
    }

    private static schema = new mongoose.Schema<IProject>({
        date: Number,
        title: String,
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Org"
        },
        details: String,
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        },
        banner: String,
    }, {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"

        }
    })

    static async findById(id: string): Promise<IProject | null> {
        return this.model.findById(id).populate(["event", "organization"]);
    }

    static async save(data: Partial<IProject>): Promise<IProject> {
        return new this.model(data).save();
    }

    static async findForOrganizations(orgs: string[]): Promise<IProject[]> {
        const someTimeAgo = new Date();
        someTimeAgo.setDate(someTimeAgo.getDate() - 2)

        return this.model.find({
            date: {$gt: someTimeAgo.getDate()},
            organization: {$in: orgs},
        }).sort("date").populate(["form", "project", "organization"])
    }

}