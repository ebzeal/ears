import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import mongoose from 'mongoose';
import route from './routes';

env.config();
const app = express();
app.use(express.json());
app.use(cors());


const port = process.env.PORT || 5500;

const mongoUri = process.env.MONGOURI;

    app.use('/api/v1', route);

mongoose
  .connect(mongoUri)
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      app.listen(port, () => {
        console.log(`Server started on port ${port}`);
      });
    }
  })
  .catch((err) => {
    console.log(`db connection error ${err}`);
  });

export default app;

