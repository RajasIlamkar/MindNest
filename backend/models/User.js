const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  gender: { type: String, enum: ['male', 'female', 'cant disclose'] },
  phone: String
});

module.exports = mongoose.model('User', userSchema);
