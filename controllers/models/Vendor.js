const mongoose = require('mongoose');

const Vendor = mongoose.model(
   
    'Vendors',  
    
    new mongoose.Schema({
        VendorName: {
        type: String,
        default : null
    },
    Material: {
        type: Array,
        default : null
    },
    RepName: {
        type : String,
        default: null
    },
    Email: {
        type: String,
        default : null
    },
    Number: {
        type : Number,
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
    PayType :{
        type: String,
        default : null
    },
    PayTerms:{
        type: String,
        default : null
    },
    shipCompName :{
        type: String,
        default : null
    },
    shipAddress1 :{
        type: String,
        default : null
    },
    shipAddress2 :{
        type: String,
        default : null
    },
    shipCity :{
        type: String,
        default : null
    },
    shipState :{
        type: String,
        default : null
    },
    shipZip :{
        type: Number,
        default : null
    },
     shipCountry:{
        type: String,
        default : null
    },
    key: {
        type :String,
    },
    clicked : {
        type : Boolean,
        default : false
    },
    DateCreated :{
        type: String,
        default : Date
    }







}), 'Vendors');

module.exports = {Vendor};