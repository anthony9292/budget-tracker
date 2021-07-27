require('dotenv').config()
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT =  process.env.PORT || 3001;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget tracker", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

const db = mongoose.connect

db.on('error', (error) => console.error(error));
db.once('open', () => {
  console.log('Connected To Database');
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
})
});
// routes
app.use(require("./routes/api.js"));


