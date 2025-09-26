import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true }, // could be userId+operatorId
  sender: { type: String, required: true }, // 'user' or 'operator'
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('message', messageSchema);

 