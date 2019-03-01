const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
const EmployeeSchema = new Schema({

     FirstName : {
       type: String,
       required : true
    },
     LastName : {
        type: String,
        required : false
        },
    Email : {
        type: String,
        required : true,
        unique : true
        },
    Cell : {
        type: Number,
        required : true
        },
    Department : {
        type: String,
        required : true
        },
    Admin : {
        type: Boolean,
        required : true
        },
    Scheduel : {
        type : Array,
        default : null
    },
    Username : {
        type : String,
        default : null
        },
    Password : {
        type : String,
        default : null
        },
    DateCreated: {
        type: Date,
        default: Date.now
        }
        
});

EmployeeSchema.plugin(mongooseUniqueValidator);

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports ={Employee};






