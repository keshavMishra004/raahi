import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    phone: {
        type: Number
    },
    operatorCode: {
        type: String,
        unique: true
    },
    
}, { timestamps: true });

const OperatorModel = mongoose.model("Operator", operatorSchema);

export default OperatorModel;