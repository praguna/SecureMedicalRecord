var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var app = express();

var routes = require('./routes/index');

//Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url= 'mongodb+srv://praguna:n1mii1@cluster0-stuj5.mongodb.net/SecureMedicalRecord?retryWrites=true';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// Set Port
app.set('port', (process.env.PORT || 3000));

//set app to listen to port 3000
app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
