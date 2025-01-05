const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
    firstName: String,
    surname: String,
    companyName: String,
    email: String,
    password: String,
    country: String,
    currency: String,
    district: String,
    subCounty: String,
    location: {
        longitude: Number,
        latitude: Number
    },
    meta: {
        primaryPhoneNumber: String,
        alternatePhoneNumber: String
    },
    isSupplier: Boolean,
    isSupplierAgent: Boolean,
    rating: Number,
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('Supplier', SupplierSchema);
