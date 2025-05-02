const mongoose = require("mongoose");

const vendorSchema = mongoose.Schema({

    businessName: { type: String, required: true },
    businessEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    phone: { type: Number, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    businessLogo: { type: String, required: true }, // image URL
    category:{type: String, required: true},
    approvedStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    products :[{type: mongoose.Schema.Types.ObjectId, ref:'Product'}],
});

module.exports = mongoose.model('Vendor', vendorSchema);