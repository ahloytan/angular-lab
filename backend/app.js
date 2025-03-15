import apiRouter from './api/index.js';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();
const PORT = 3000;

const { FE_ENDPOINT_PROD } = process.env;

app.use(express.json()); 
app.use(
  cors({
    origin: ['http://localhost:4200', FE_ENDPOINT_PROD],
    credentials: true
  })
);

app.use('/', apiRouter);

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
      message: "BOOM"
  });
});

app.get('/', (req, res) => {
  res.status(200).send('ok');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;