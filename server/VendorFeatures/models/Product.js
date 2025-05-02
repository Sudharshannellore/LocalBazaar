const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    vendor :{type: mongoose.Schema.Types.ObjectId, ref:'Vendor', required: true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    units: {type:String, required: true},
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Product', productSchema);