import mongoose, {Schema} from "mongoose";
import {IOrg} from "./org";
import {Service} from "../@decorators/utils.decorator";

enum UserViews {passwordLess}

export interface IUser extends mongoose.Document {
    full_name: string;
    email: string;
    password: string;
    organization?: string | IOrg;
}


@Service
export default class UserService {
    static _model: mongoose.Model<IUser>;

    private static get model() {
        this._model = this._model ?? mongoose.model<IUser>("User", this.schema)
        return this._model;
    }

    private static schema = new mongoose.Schema<IUser>({
        full_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        organization: {type: Schema.Types.ObjectId, ref: "Org"}
    }, {
        timestamps: {
            updatedAt: "updated_at",
            createdAt: "created_at",
        }
    })

    static async save(data: Partial<IUser>): Promise<IUser> {
        const user: IUser = await new this.model(data).save();
        return this.views(user, UserViews.passwordLess)
    }

    static async updateOrg(id: string, organization: string): Promise<void> {
        await this.model.updateOne({id}, {organization})
    }

    static async findByEmail(email: string): Promise<IUser | null> {
        return this.model.findOne({email});
    }

    static async findByID(id: string): Promise<IUser | null> {
        return this.model.findById(id).populate(["organization"]);
    }

    private static views(user: IUser, view: UserViews): IUser {
        switch (view) {
            case UserViews.passwordLess:
                return new this.model({...user.toJSON(), password: undefined});
            default:
                return user;
        }
    }

}
