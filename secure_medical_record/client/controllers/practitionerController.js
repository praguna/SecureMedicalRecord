var practitionerLogin = require('../models/practitionerLogin');
exports.practitionerLogin_post = function(req,res,next){

    practitionerLogin.findOne({practitionerID:req.body.practitionerID},function(err,practitioner){
        if(err)
        {
            return next(err);
        }
        console.log(practitioner.password,req.body.practitionerPassword)

        if(practitioner.password.localeCompare(req.body.practitionerPassword)==0)
        {
            res.redirect('/practitioner/'+practitioner._id);
            return
        }
        
  //console.log(patient)
        res.send('<h1>fail</h1>');
    });  
};
exports.practitioner_data=function(req,res,next){
    practitionerLogin.find({},'practitionerID',function(err,practitioners){
        if(err) return next(err);
        console.log(practitioners);
        res.render('viewPractitionerPage',{practitioners:practitioners,id:req.params.id});
        
    })   
};



