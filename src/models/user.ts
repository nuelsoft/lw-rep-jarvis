import mongoose from "mongoose";
import * as bcrypt from "src/utils/hasher";

interface IUser extends mongoose.Document {
	email: string;
	password: string;
	authenticate(password: string): boolean
}

interface IUserModel extends mongoose.Model<IUser, IUserModel> {
	findByEmail(email: string): Promise<IUser>;
}

const schema = new mongoose.Schema<IUser>(
	{
		email: {
			type: String,
			minlength: 1,
			unique: true,
		},
		password: {
			type: String,
			required: "You must provide password",
			set(value: string) {
				return bcrypt.hash(value);
			}
		}
	},
	{ timestamps: true }
);

schema.statics.findByEmail = function (email: string): Promise<number> {
	return this.findOne({ email });
};

schema.methods.authenticate = function (password: string): boolean {
	return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser, IUserModel>("User", schema);
