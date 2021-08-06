import * as mongoose from "mongoose";
import {Service} from "../@decorators/utils.decorator";
import {IUser} from "./user";

export interface IEventData extends mongoose.Document {
    entry: { [key: string]: string | null },
    form: string,
    logged_by: string | IUser
}

@Service
export default class EventService {
    static _model: mongoose.Model<IEventData>;

    private static get model() {
        this._model = this._model ?? mongoose.model<IEventData>("Event.Data", this.schema)
        return this._model;
    }

    private static schema = new mongoose.Schema<IEventData>({
        entry: {String: String},
        form: String,
        logged_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"

        }
    })

    static async findById(id: string): Promise<IEventData | null> {
        return this.model.findById(id).populate("logged_by");
    }

    static async find(form: string): Promise<IEventData[]> {
        return this.model.find({form}).populate("logged_by");
    }

    static async save(data: Partial<IEventData>): Promise<IEventData> {
        return new this.model(data).save();
    }
}