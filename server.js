var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var http = require('http');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var cookieParser = require('cookie-parser');
var uuid = require('node-uuid');
var querystring = require('querystring');
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

var Pandorabot = require('pb-node');
var options = {
  url: 'https://aiaas.pandorabots.com',
  app_id: "1409612467734",
  user_key: "ffe4f97ba5105927e685773a028fd4ac",
  botname: "alan"
};
var bot = new Pandorabot(options);

// Turing Options
var options = {
  host: 'localhost',
  port: '3000',
  path: '/messages',
  method: 'POST'
};

// Send Turing messages
function sendMessage(body, conversationUid){
	var postData = querystring.stringify({
	  'message' : body,
	  'conversation':{
	  	'uid': conversationUid
	  }
	});
	var req = http.request(options, (res) => {
	  console.log(`STATUS: ${res.statusCode}`);
	  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	  res.setEncoding('utf8');
	  res.on('data', (chunk) => {
	    console.log(`BODY: ${chunk}`);
	  });
	  res.on('end', () => {
	    console.log('No more data in response.')
	  })
	});
	req.on('error', (e) => {
	  console.log(`problem with request: ${e.message}`);
	});
	req.write(postData);
	console.log(req)
	req.end();
}

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    console.log(req);
});

function sendNameQuery(conversationUid){
	var nameQuery = 'Hi there! What’s your name?'
	sendMessage(nameQuery,conversationUid)
}

router.post('/conversation', function(req,res){
	// Create conversation and set uid
	var conversation = new Conversation()
	conversation.uid = req.body.conversation.uid;

	// create user and set id
	var user = new User();
	user.uid = req.body.partner.uid;

	// set conversation partner id to form association
	conversation.partner_id = user.uid

	// Save conversation to db
	conversation.save(function (err) {
	  if (err) return handleError(err);
	  // saved!
	})

	console.log(conversation)

	// Save user to db
	user.save(function (err) {
	  if (err) return handleError(err);
	  // saved!
	})

	console.log(user)

	// // Create message with name query and conversation association
	// var message = new Message()
	// message.uid = uuid.v1()
	// message.body = 'Hi there! What’s your name?'
	// message.conversationUid = conversation.uid
	// message.playerUid = 'ALAN'
	// message.save(function (err) {
	//   if (err) return handleError(err);
	//   // saved!
	// })

	// console.log(message)

	if (!req.body.authenticated) {
		res.json(conversation)
		sendNameQuery()
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
