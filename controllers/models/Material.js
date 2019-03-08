const mongoose = require('mongoose');


const Material = mongoose.model
(   'Material',

    new mongoose.Schema({
        MaterialName :{
            type : String,
            required : true
        },
        Vendors : [{
      
            type : String,
            required : false,
        }],
        DateCreated: {
            type: String,
            default : Date
        }
    
    }),
    
    'Material');

module.exports = {Material};