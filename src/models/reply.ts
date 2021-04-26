import mongoose from "mongoose";

export interface IReply extends mongoose.Document {
    body: string;
    author:string;
    post: string;
}

interface IReplyModel extends mongoose.Model<IReply, IReplyModel> {
    findByPost(id: string): Promise<IReply>;
}

const schema = new mongoose.Schema<IReply>(
    {
        body: {
            type: String,
            required: "You must provide body",
            minlength: 1,
        },
        post: {
            type: mongoose.Types.ObjectId,
            required: "You must provide post",
            index: true,
            ref: "Post"
        },
        author: {
            type: mongoose.Types.ObjectId,
            required: "you must provide author",
            index: true,
            ref: "User"
        },
    },
    { timestamps: true }
);

schema.statics.findByPost = function (id: string): Promise<IReply> {
    return this.findOne({post: id});
};

export default mongoose.model<IReply, IReplyModel>("Reply", schema);
