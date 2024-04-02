const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.Mongo_URL);
    console.log(`Connected to Server ${mongoose.connection.host}`.bgCyan.white);
  } catch (error) {
    console.log(`Database Connection Error ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
