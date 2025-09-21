import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import operatorRoutes from './routes/operator.route.js';

const app = new express();
const PORT = 5100;
app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`);
});

app.use(cors());
app.use(express.json());

operatorRoutes(app);

app.get('/', (req, res) => {
  res.send('Raahi API is running...');
});

const db = mongoose.connect(process.env.MONGO_URI);
db.then(()=>console.log('database connected successfully!'))
  .catch(err=>console.log('database could not be connected: ', err));
