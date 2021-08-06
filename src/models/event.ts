import * as mongoose from "mongoose";
import {Service} from "../@decorators/utils.decorator";
import {IOrg} from "./org";
import {IProject} from "./project";

export interface IEvent extends mongoose.Document {
    date: number;
    title: string;
    organization: string | IOrg;
    details: string;
    project: string | IProject;
    form: string;
    banner: string;
}

@Service
export default class EventService {
    static _model: mongoose.Model<IEvent>;

    private static get model() {
        this._model = this._model ?? mongoose.model<IEvent>("Event", this.schema)
        return this._model;
    }

    private static schema = new mongoose.Schema<IEvent>({
        date: Number,
        title: String,
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Org"
        },
        details: String,
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        },
        form: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event.Form"
        },
        banner: String,
    }, {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"

        }
    })

    static async findById(id: string): Promise<IEvent | null> {
        return this.model.findById(id).populate(["form", "project", "organization"]);
    }

    static async save(data: Partial<IEvent>): Promise<IEvent> {
        return new this.model(data).save();
    }

    static async findForOrganizations(orgs: string[]): Promise<IEvent[]> {
        const someTimeAgo = new Date();
        someTimeAgo.setDate(someTimeAgo.getDate() - 2)

        return this.model.find({
            date: {$gt: someTimeAgo.getDate()},
            organization: {$in: orgs},
        }).sort("date").populate(["form", "project", "organization"])
    }

}