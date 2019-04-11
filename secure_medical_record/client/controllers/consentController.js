var patientLogin = require('../models/patientLogin');
var practitionerLogin = require('../models/practitionerLogin');

exports.patient_consent=function(req,res,next){
    var patient=new patientLogin({
        consent:req.params.pid
    })
    patientLogin.findByIdAndUpdate(req.params.id,patient,{},function(err,res){
        if(err) return next(err);
        console.log(req.params.id)
        res.redirect('/patient/'+req.params.id+'/viewPractitioner') 
    });
}