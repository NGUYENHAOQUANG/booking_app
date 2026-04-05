// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI chưa được cấu hình trong file .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout sau 5 giây nếu không kết nối được
    });

    const { host, port, name } = conn.connection;
    console.log('═══════════════════════════════════════════');
    console.log('✅ MongoDB Connected!');
    console.log(`   Host    : ${host}`);
    console.log(`   Port    : ${port || '(Atlas cloud)'}`);
    console.log(`   Database: ${name}`);
    console.log('═══════════════════════════════════════════');

    // Lắng nghe sự kiện mất kết nối
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB bị ngắt kết nối!');
    });
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB đã kết nối lại!');
    });

  } catch (error) {
    console.error('═══════════════════════════════════════════');
    console.error('❌ MongoDB connection FAILED!');
    console.error(`   Lỗi: ${error.message}`);
    console.error('   Kiểm tra lại MONGO_URI trong file .env');
    console.error('═══════════════════════════════════════════');
    process.exit(1);
  }
};

module.exports = connectDB;
