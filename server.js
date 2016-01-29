var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var http = require('http');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model

// Models
var Conversation     = require('./app/models/conversation.js');
var User     = require('./app/models/user.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

var router = express.Router();

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    console.log(req);
});

router.post('/conversation', function(req,res){
	// conversation: {
	// 	uid: "random hash"
	// participant_token: ""
	// }
	// Only Alan receives real participant tokens.
	// Competition AI's receive randomly generated participate-conversation tokens

	var conversation_uid = req.query.conversation_uid
	var participant_token = req.query.participant_token


	var conversation = new Conversation(uid: conversation_uid)
	conversation.save(function (err) {
	  if (err) return handleError(err);
	  // saved!
	})

	var nameQuery = 'Hi there! What’s your name?'

	if (!req.query.auth && req.query.name == null) {
		res.end(nameQuery)
	} else if (!req.query.auth) {
		var name = req.query.name
		emailQuery = 'Hi ' + name +  '! I’m Alan. Seems like you\'re not signed in. Can you tell me your email?'
		res.end(emailQuery)
	} else {
		var greeting = 'Hi there ' + req.query.name + '! Good to see you again. Are you ready to play?'
	}

});

router.post('/message', function(req, res){
	if (!req.query.auth && req.query.name !== null){
		var name = req.query.name
		var message = 'Nice to meet you ' + name +  '. I’m Alan. I’ll be your guide through the Turing Tournament. Now, can you tell me your email address. Don’t worry, I will never spam you.'
		res.end(message)
	} else if (){}
});

router.post('/email', function(req, res){
	name = req.query.name

	message = "Great! I just sent you a temporary password. We can edit it later. Now, I’ll teach you how to play the Turing Tournament..."
});

router.post('/message', function(req, res) {
		var visitor = req.query.visitor
		if (newVisitor) {
			var message = 'Hi there! What’s your name?'
			res.end(message)
		} else {
			var message = req.query.body;
			var conversation_id = req.query.conversation_id;
		}
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);