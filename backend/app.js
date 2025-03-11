require('dotenv').config();
const express = require("express");
const app = express();
const PORT = 3000;
const cors = require('cors');
const { FE_ENDPOINT_PROD } = process.env;

app.use(express.json()); 
app.use(
  cors({
    origin: ['http://localhost:4200', FE_ENDPOINT_PROD],
    credentials: true
  })
);

let apiRouter = require('./api/index');
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

module.exports = app;