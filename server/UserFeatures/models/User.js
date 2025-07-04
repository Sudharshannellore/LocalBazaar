const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {type:String, required: true},
    email: {type:String, required: true},
    password: {type:String, required: true},
    phone: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('User', userSchema);