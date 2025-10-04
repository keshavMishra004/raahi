import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String, // could be userId, operatorId, or a custom chat room ID
      required: true,
    },
    sender: {
      type: String, // "user" | "operator" | or userId/operatorId
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

 