var practitionerLogin = require('../models/practitionerLogin');
var cmd=require('node-cmd');

exports.practitionerLogin_post = function(req,res,next){

    var data = new practitionerLogin({
        practitionerID: req.body.practitionerID,
        password: req.body.practitionerPassword
    });
    data.save(function(err){
        if(err)
       throw err;
          cmd.run('sawtooth keygen '+data._id);
        res.redirect('/practitioner/'+data._id)
    })

   
};