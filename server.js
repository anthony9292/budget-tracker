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

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  
});

const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => { 
  console.log('Database is connected');
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
})
});

// routes
app.use(require("./routes/api.js"));
