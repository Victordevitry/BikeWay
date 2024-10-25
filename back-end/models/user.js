const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  homeAddress: { type: String, required: false },
  workAddress: { type: String, required: false },

});

module.exports = mongoose.model('User', userSchema);
