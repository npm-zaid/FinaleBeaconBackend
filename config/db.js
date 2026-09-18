const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    const conn = await mongoose.connect('mongodb+srv://finalebeacon_db_user:vrGJqiuGkFAuWNAd@cluster0.koxdmwj.mongodb.net/finalebeacon');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;