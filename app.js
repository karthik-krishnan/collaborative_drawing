// Including libraries

var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	static = require('node-static'); // for serving files

// This will make all the files in the current folder
// accessible from the web
var fileServer = new static.Server('./');
	
// This is the port for our web server.
// you will need to go to http://localhost:8080 to see it
app.listen(8080);

// If the URL of the socket server is opened in a browser
function handler (request, response) {
//	request.addListener('end', function () {
		console.log("Request received");
        //fileServer.serve(request, response);
		fileServer.serve(request, response, function(err, result) {
		      if (err) {
		        console.error('Error serving %s - %s', request.url, err.message);
		        if (err.status === 404 || err.status === 500) {
		          fileServer.serveFile(util.format('/%d.html', err.status), err.status, {}, request, response);
		        } else {
		          response.writeHead(err.status, err.headers);
		          response.end();
		        }
		      } else {
		        console.log('%s - %s', request.url, response.message); 
		      }
		    });        
  //  });
}

// Delete this row if you want to see debug messages
//io.set('log level', 1);

// Listen for incoming connections from clients
io.sockets.on('connection', function (socket) {

	// Start listening for mouse move events
	socket.on('mousemove', function (data) {
		
		// This line sends the event (broadcasts it)
		// to everyone except the originating client.
		socket.broadcast.emit('moving', data);
	});
});