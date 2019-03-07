const mongoose = require('mongoose');

const Vendor = mongoose.model(
   
    'Vendors',  
    
    new mongoose.Schema({
        VendorName: {
        type: String,
        required: true
    },
    Material:{  
        Material : 
        [{
                type : String,
                default : null
        }]
        
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







}), 'Vendors');

module.exports = {Vendor};