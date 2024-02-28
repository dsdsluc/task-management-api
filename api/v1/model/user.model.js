const mongoose = require('mongoose');
const generateHelper = require("../../../helper/generate")

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generateHelper.generateRandomString(30)
    },
    phone: String,
    avatar: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
  },{ timestamps: true });
const User = mongoose.model('User', UserSchema,"users");
module.exports = User;