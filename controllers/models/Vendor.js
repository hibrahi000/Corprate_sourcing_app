const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    VendorName: {
        type: String,
        required: true
    },
    Material:{  
        type : Array,
        default : null
    },
    RepName: {
        type : String,
        default: null
    },
    Email: {
        type:String,
        default : null
    },
    Number: {
        type : Number,
        default : null
    },
    WareHouse: {
        type : String,
        default : null
    },
    Website: {
        type : String,
        default: null
    },
    Notes: {
        type : String,
        default : null
    },
    DateCreated :{
        type: String,
        default : Date
    }







},{collection : 'VendorInfo'});

const Vendor = mongoose.model('Vendor', VendorSchema);
module.exports = {Vendor};