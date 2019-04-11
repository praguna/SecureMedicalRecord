var patientLogin = require('../models/patientLogin');
var cmd=require('node-cmd');
exports.patientLogin_post = function(req,res,next){
    // patientLogin.find().exec(function(err,list){
    //     if(err) return next(err);
    //     res.send("hello");
    // });
    var data = new patientLogin({
             patientID: req.body.patientID,
             password: req.body.patientPassword
         });
         data.save(function(err){
             if(err)
               throw err;
             
             cmd.run('sawtooth keygen '+data._id);
             res.redirect('/patient/'+data._id)
         })
    

};