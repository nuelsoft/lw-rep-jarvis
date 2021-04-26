import mongoose from "mongoose";

interface ILike extends mongoose.Document {
    post: string;
    author: string;
}

interface ILikeModel extends mongoose.Model<ILike, ILikeModel> {
    findByPost(id: string): Promise<ILike>;
    findByAuthor(id: string): Promise<ILike>;
}

const schema = new mongoose.Schema<ILike>(
    {
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
            ref: "User",
        },
    },
    { timestamps: true }
);

schema.statics.findByPost = function (id: string): Promise<ILike> {
    return this.findOne({ post: id });
};

schema.statics.findByAuthor = function (id: string): Promise<ILike> {
    return this.findOne({ author: id });
};

schema.index({post: 1, author: 1}, {unique: true});

export default mongoose.model<ILike, ILikeModel>("Like", schema);
