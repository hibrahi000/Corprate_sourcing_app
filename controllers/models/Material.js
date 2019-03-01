const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    MaterialName :{
        type : String,
        required : true
    },
    Vendor : {
        type : String,
        required : true,
    }
},{collection : 'Materials'});

const Material = mongoose.model('Material', MaterialSchema);
module.exports = Material;