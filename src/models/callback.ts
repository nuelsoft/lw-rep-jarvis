import mongoose from "mongoose";

interface ICallback extends mongoose.Document {
    callback: string;
    invoiceId: string;
}

interface ICallbackModel extends mongoose.Model<ICallback, ICallbackModel> {
    findByInvoiceId(id: string): Promise<ICallback>
}

const schema = new mongoose.Schema<ICallback>(
    {
        callback: {
            type: String,
            required: "You must provide callback",
        },
        invoiceId: {
            type: String,
            required: "you must provide invoiceId",
        },
    },
    { timestamps: true }
);

schema.statics.findByInvoiceId = function (id: string): Promise<ICallback> {
    return this.findOne({ invoiceId: id });
};

export default mongoose.model<ICallback, ICallbackModel>("Callback", schema);
