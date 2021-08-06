import * as mongoose from "mongoose";
import {Service} from "../@decorators/utils.decorator";

export interface IOffice extends mongoose.Document {
    slug: string;
    title: string;
    invokable_by: string[];
}

@Service
export default class OfficeService {
    private static get model() {
        return mongoose.model<IOffice>("Office", this.schema)
    }

    private static schema = new mongoose.Schema<IOffice>({
        slug: {
            required: true,
            type: String,
            unique: true
        },
        title: {
            required: true,
            type: String
        },
        invokable_by: [{
            required: true,
            type: String
        }]
    }, {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"

        }
    })

    static async findBySlug(slug: string): Promise<IOffice | null> {
        return this.model.findOne({slug});
    }

    static async save(data: Partial<IOffice>): Promise<IOffice> {
        return new this.model(data).save();
    }

    static async officesInvokableBy(invoker: string): Promise<Array<IOffice>> {
        return this.model.find({invokable_by: {$in: [invoker]}});
    }

    static async offices(): Promise<Array<IOffice>> {
        return this.model.find();
    }
}