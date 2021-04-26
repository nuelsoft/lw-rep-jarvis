import mongoose from "mongoose";
import { IReply } from "src/models/reply";

interface IPost extends mongoose.Document {
    body: string;
    author: string;
    edited: boolean;
    replies: Array<IReply>;
}

interface IPostModel extends mongoose.Model<IPost, IPostModel> { }

const schema = new mongoose.Schema<IPost>(
    {
        body: {
            type: String,
            required: "You must provide body",
            minlength: 1,
        },
        author: {
            type: mongoose.Types.ObjectId,
            required: "you must provide author",
            index: true,
        },
        edited: {
            type: Boolean,
            default: false
        },
        media: {
            type: String,
        }
    },
    { timestamps: true }
);

schema.virtual("replies", {
    ref: "Reply",
    localField: "_id",
    foreignField: "post"
});

export default mongoose.model<IPost, IPostModel>("Post", schema);
