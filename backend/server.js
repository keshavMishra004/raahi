// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import 'dotenv/config';
// import operatorRoutes from './routes/operator.route.js';
// import userRoutes from './routes/user.route.js';

// const app = new express();
// const PORT = 5100;
// app.listen(PORT, () => {
//     console.log(`server is running at port: ${PORT}`);
// });

// app.use(cors());
// app.use(express.json());

// operatorRoutes(app);
// userRoutes(app);

// app.get('/', (req, res) => {
//   res.send('Raahi API is running...');
// });

// const db = mongoose.connect(process.env.MONGO_URI);
// db.then(()=>console.log('database connected successfully!'))
//   .catch(err=>console.log('database could not be connected: ', err));

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import operatorRoutes from './routes/operator.route.js';
import userRoutes from './routes/user.route.js';
import Message from './models/message.model.js'; // Message model
import policyRoute from './routes/policy.route.js';
import faqRoutes from './routes/faq.route.js';
import aircraftRoutes from './routes/aircraft.route.js';
import bookingRoutes from './routes/booking.route.js';

// Create app + HTTP server
const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  credentials: true
}));

app.use(express.json());

// Routes
operatorRoutes(app);
userRoutes(app);
policyRoute(app);
faqRoutes(app);
aircraftRoutes(app);
bookingRoutes(app); // <-- register booking routes so /cms/bookings exists

app.use("/api/aircrafts", aircraftRoutes);

app.get('/', (req, res) => {
  res.send('Raahi API is running...');
});

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('database connected successfully!'))
  .catch(err => console.log('database could not be connected: ', err));

// ---- SOCKET.IO SETUP ----
const io = new Server(httpServer, {
  cors: {
    origin: '*', // In production: set your frontend domain here
    methods: ['GET', 'POST']
  }
});

// When a client connects
io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  // Join a room (e.g., userId, operatorId, or bookingId)
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Handle sending messages (💬 this is your code)
  socket.on('sendMessage', async (data) => {
    const { roomId, message, sender } = data;

    // Save to DB
    const newMessage = new Message({ roomId, sender, message });
    await newMessage.save();

    // Emit to all users in the room
    io.to(roomId).emit('receiveMessage', newMessage);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(' User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5100;
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

