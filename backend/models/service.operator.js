import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true
    }
});

const ServiceModel = mongoose.model("Service", serviceSchema);

export default ServiceModel;