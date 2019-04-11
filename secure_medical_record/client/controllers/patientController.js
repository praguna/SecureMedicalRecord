var patientLogin = require('../models/patientLogin');
exports.patientLogin_post = function(req,res,next){
    // patientLogin.find().exec(function(err,list){
    //     if(err) return next(err);
    //     res.send("hello");
    // });

    
    
    
    patientLogin.findOne({patientID:req.body.patientID},function(err,patient){
        if(err)
        {
            return next(err);
        }
        console.log(patient.password,req.body.patientPassword)

        if(patient.password.localeCompare(req.body.patientPassword)==0)
        {
            res.redirect('/patient/'+ patient._id);
            return
        }
        
  //console.log(patient)
        res.send('<h1>fail</h1>');
    }) 
};
exports.patient_data=function(req,res,next){
    patientLogin.find({},'patientID',function(err,patients){
        if(err) return next(err);
        console.log(patients);
        res.render('practitionerHomePage',{patients:patients,id:req.params.id});
        
    })   
};





