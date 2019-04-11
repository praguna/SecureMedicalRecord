var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var patientLoginSchema = new Schema(
    {
        patientID: {type:String,required:true,unique:true},
        password: {type:String,required:true}
    }
);

module.exports = mongoose.model('patientLogin',patientLoginSchema);