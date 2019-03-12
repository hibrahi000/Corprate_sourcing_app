const mongoose = require('mongoose');


const Material = mongoose.model
(   'Materials',

    new mongoose.Schema({
        MaterialName :{
            type : String,
            required : true
        },
        Vendors : {
            type: Array,
            default : null
        },
        DateCreated: {
            type: String,
            default : Date
        }
    
    }),
    
    'Materials');

module.exports = {Material};