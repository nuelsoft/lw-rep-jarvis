import * as mongoose from "mongoose";
import {Service} from "../@decorators/utils.decorator";

export interface IEventForm extends mongoose.Document {
    points: { [key: string]: { type: string, required: boolean, options: string[], default: string } }
}

@Service
export default class EventFormService {
    static _model: mongoose.Model<IEventForm>;

    private static get model() {
        this._model = this._model ?? mongoose.model<IEventForm>("Event.Form", this.schema)
        return this._model;
    }

    private static schema = new mongoose.Schema<IEventForm>({
        points: {
            type: {
                String: {
                    type: String,
                    required: Boolean,
                    options: [String],
                    default: String
                }
            },
            required: true
        }
    }, {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"

        }
    })

    static async findById(id: string): Promise<IEventForm | null> {
        return this.model.findById(id);
    }

    static async save(data: Partial<IEventForm>): Promise<IEventForm> {
        return new this.model(data).save();
    }
}