// PandoraBot Boot

function boot() {
	var fs = require( 'fs' );
	var path = require( 'path' );
	var process = require( "process" );

	var Pandorabot = require('pb-node');
	var options = {
	  url: 'https://aiaas.pandorabots.com',
	  app_id: "1409612467734",
	  user_key: "ffe4f97ba5105927e685773a028fd4ac",
	  botname: "alan"
	};

	var bot = new Pandorabot(options);

	// Upload Brain
	var alice = "./brain/rosie/"
	fs.readdirSync(alice,function(err, files){
		if( err ) {
		  console.error( "Could not list the directory.", err );
		  process.exit( 1 );
	  } 
	  files.forEach( function( file, index ) {
	  	console.log(file);
	  	bot.upload(file, function(err, res) {
	  		if (!err) console.log(res);
			});
	  })
	});

	// Compile
	bot.compile(function(err, res) {
	  if (!err) console.log(res);
	});
};

boot();
