import express from "express";
import Message from "../models/message.model.js";

const router = express.Router();

// Fetch all messages for a specific room
router.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Send a new message
router.post("/", async (req, res) => {
  try {
    const { roomId, sender, message } = req.body;
    if (!roomId || !sender || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new Message({ roomId, sender, message });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ✅ Edit a message
// ✅ Edit a message (safe version)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const updated = await Message.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ error: "Failed to update message" });
  }
});


// ✅ Delete a message
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});


export default (app) => {
  app.use("/api/messages", router);
};
