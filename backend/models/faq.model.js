import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  operator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Operator",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    default: null, // null = global FAQ
  },
  faqs: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }
  ]
}, { timestamps: true });

// Enforce uniqueness: one operator can only have ONE global FAQ and one FAQ per service
faqSchema.index({ operator: 1, service: 1 }, { unique: true });

const FaqModel = mongoose.model("Faq", faqSchema);

export default FaqModel;
