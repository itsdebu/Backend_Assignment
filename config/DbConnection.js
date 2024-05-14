const mongoose = require("mongoose");
const connection = mongoose.connection;

// Connectiong to mongoDB Database
const connectdb = async (req, res) => {
  // trying connecting to mongodb database
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "Connected to Database Successfully",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    // if some error occurs catch it and log
    console.log(err);
    process.exit(1);
  }
};

// exporting connection fucntion
module.exports = connectdb;
