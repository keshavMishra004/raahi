import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    operatorCode: {
        type: String
    }
}, { timestamps: true });

const OperatorModel = mongoose.model("Operator", operatorSchema);

export default OperatorModel;