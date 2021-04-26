import mongoose from "mongoose";

interface IMedia extends mongoose.Document {
    location: string;
    mimetype: string;
}

const schema = new mongoose.Schema<IMedia>(
    {
        location: {
            type: String,
            required: "You must provide location",
        },
        mimetype: {
            type: String,
            required: "you must provide mimetype",
        },
    },
    { timestamps: true }
);

export default mongoose.model<IMedia>("Media", schema);
