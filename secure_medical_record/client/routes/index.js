var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var {SmrClient1} = require('./SmrClient1');
var {SmrClient} = require('./SmrClient');
var patientController = require('../controllers/patientController');
var patientSignupController = require('../controllers/patientSignupController');
var practitionerController = require('../controllers/practitionerController');
var practitionerSignupController = require('../controllers/practitionerSignupController');
var consentController=require('../controllers/consentController')
const notifier = require('node-notifier');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res){
    res.redirect("/loginSelect");
})

//Get home view
router.get('/loginSelect', function(req, res){
    res.render('firstPage');
});

router.get('/loginPatient', function(req, res){
    res.render('loginPagePatient');
});
router.get('/signupPatient', function(req, res){
    res.render('signupPatientPage');
});
router.get('/signupPractitioner', function(req, res){
    res.render('signupPractitionerPage');
});

router.get('/loginPractitioner', function(req, res){
    res.render('loginPagePractitioner');
});
//Get main view
router.get('/home', function(req, res){
    res.render('homePage');
});

// Get Deposit view
router.get('/deposit',function(req, res){
    res.render('depositPage');
})
router.get('/practitioner/enterDetails/:id',function(req,res){
    res.render('enterDetailsPage')
});

router.post('/practitioner/enterDetails/:id',function(req,res){
    var client=new SmrClient1(req.params.id,'patient')
    var data={height:req.body.height,weight:req.body.weight,age:req.body.age,odata:req.body.odata,symptoms:req.body.symptoms}
    client.insert_health_record(data);
    console.log('Successful Submission')
    res.redirect('back');
    notifier.notify('Successfully Submitted!');
});

router.get('/patient/:id',function(req,res){
    res.render('patientHomePage',{id:req.params.id})
});

router.get('/practitioner/:id',patientController.patient_data);

//Get Withdraw view
router.get('/withdraw',function(req, res){
    res.render('withdrawPage');
})

router.get('/patient/:id/viewDetails',function(req, res){
    var client=new SmrClient1(req.params.id,'patient')
    let data=client.get_health_record(req.id)
    data.then(function(result){
        //console.log(result);
        res.render('viewDetailsPage',{result:result});
    });
})

router.get('/patient/:id/viewPractitioner', practitionerController.practitioner_data);

router.get('/patient/:id/viewLog',function(req, res){
    res.render('viewLogPage');
})
router.get('/patientHome',function(req, res){
    res.render('patientHomePage');
})
router.get('/enterDetails',function(req, res){
    res.render('enterDetailsPage');
})

router.get('/consent/:id/:pid',consentController.patient_consent);
//Get Transfer View
router.get('/transfer',function(req, res){
    res.render('transferPage');
})

//Get Balance View
router.get('/balance', function(req, res){
    res.render('balancePage');
})

//recieve data from login page and save it.
router.post('/loginPatient',patientController.patientLogin_post);

router.post('/signupPatient',patientSignupController.patientLogin_post);

router.post('/signupPractitioner',practitionerSignupController.practitionerLogin_post);



router.post('/loginPractitioner',practitionerController.practitionerLogin_post);


router.post('/loginPractitioner',practitionerController.practitionerLogin_post);
//function to deposit amount in server
router.post('/deposit', function(req, res) {
    var userId = req.body.userId;
    var amount = req.body.money;
    var SmrClient1 = new SmrClient(userId); 
    SmrClient1.deposit(amount);    
    res.send({message:"Amount "+ amount +" successfully added"});
});

//function to withdraw
router.post('/withdraw', function(req, res) {
    var userId = req.body.userId;
    var amount = req.body.money;
    var SmrClient1 = new SmrClient(userId);   
    SmrClient1.withdraw(amount);     
    res.send({  message:"Amount "+ amount +" successfully deducted"});
});

//function to transfer money to another user
router.post('/transfer', function(req, res) {
    var userId = req.body.userId;
    var beneficiary = req.body.beneficiary;
    var amount = req.body.money;
    var client = new SmrClient(userId);
    client.transfer(beneficiary, amount);    
    res.send({ message:"Amount "+ amount +" successfully added to " + beneficiary});
});

router.post('/balance', function(req, res){
    var userId = req.body.userId;
    var client = new SmrClient(userId);
    var getYourBalance = client.balance();
    console.log(getYourBalance);
    getYourBalance.then(result => {res.send({ balance: result, message:"Amount " + result + " available"});});
})
module.exports = router;
