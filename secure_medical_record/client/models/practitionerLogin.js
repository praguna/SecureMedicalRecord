var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var practitionerLoginSchema = new Schema(
    {
        practitionerID: {type:String,required:true,unique:true},
        password: {type:String,required:true}
    }
);

module.exports = mongoose.model('practitionerLogin',practitionerLoginSchema);