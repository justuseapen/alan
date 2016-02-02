var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var http = require('http');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var cookieParser = require('cookie-parser');
var uuid = require('node-uuid');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model

// Models
var Conversation     = require('./app/models/conversation.js');
var User     = require('./app/models/user.js');
var Message = require('./app/models/message.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

var router = express.Router();

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    console.log(req);
});

// POST Conversation
router.post('/conversation', function(req,res){
	// conversation: {
	// 	uid: "random hash"
	// participant_token: ""
	// }
	// Only Alan receives real participant tokens.
	// Competition AI's receive randomly generated participate-conversation tokens

	// Create conversation and set uid
	var conversation = new Conversation()
	console.log(req)
	conversation.uid = req.body.conversation.uid;

	// create user and set id
	var user = new User();
	user.uid = req.body.conversation.playerUid;

	// set conversation partner id to form association
	conversation.partner_id = user.uid

	// Save conversation to db
	conversation.save(function (err) {
	  if (err) return handleError(err);
	  // saved!
	})

	// Save user to db
	user.save(function (err) {
	  if (err) return handleError(err);
	  // saved!
	})

	// Create message with name query and conversation association
	var message = new Message()
	message.uid = uuid.v1()
	message.body = 'Hi there! What’s your name?'
	message.conversationUid = conversation.uid
	message.partnerUid = 'ALAN'

	// Save message to db
	message.save(function (err) {
	  if (err) return handleError(err);
	  // saved!
	})

	console.log(message)

	if (!req.query.auth && req.query.name == null) {
		res.json({
			'conversation': conversation, 
			'lastMessage': message
		})
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
