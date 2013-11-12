$(function(){

	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

	// The URL of your web server (the port is set in app.js)
	var url = 'http://10.4.32.4:8080';
	var a;
	var doc = $(document),
		win = $(window),
		canvas = $('#paper'),
		ctx = canvas[0].getContext('2d'),
		instructions = $('#instructions');
	
	// Generate an unique ID
	var id = Math.round($.now()*Math.random());
	
	// A flag for drawing activity
	var drawing = false;

	var clients = {};
	var cursors = {};

	var socket = io.connect(url);
	window.onbeforeunload = function () {
     socket.emit('reload', { my: 'data' });
     };
     
     socket.on('reload', function (data) {
        window.location.reload(true);
   });
	/*
	ctx.style.backgroundImage = "url(assets/img/Maze_TV.jpg)"; 
	window.onbeforeunload = function () {
	 //alert(imgurl);
	 a = Math.round($.now()*Math.random()) % 2; 
	 if(a == 0)
	 	canvas.style.backgroundImage = "url(assets/img/Maze_TV.jpg)"; 
	 else
	 	canvas.style.backgroundImage = "url(assets/img/Game-changer.jpg)"; 
     socket.emit('reload', { my: a });
     };
     
     socket.on('reload', function (data) {
      	
      window.location.reload(true);
      	 if(data.my == 0)
	 	canvas.style.backgroundImage = "url(assets/img/Maze_ipad.jpg)"; 
	 else
	 	canvas.style.backgroundImage = "url(assets/img/Game-changer-2.jpg)"; 
   });
	 */
	socket.on('moving', function (data) {
		
		if(! (data.id in clients)){
			// a new user has come online. create a cursor for them
			cursors[data.id] = $('<div class="cursor">').appendTo('#cursors');
		}
		
		// Move the mouse pointer
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
		
		// Is the user drawing?
		if(data.drawing && clients[data.id]){
			if((clients[data.id].x - data.x) < 20 && (clients[data.id].y - data.y) < 20)
				drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
			else
				clients = {};
			// Draw a line on the canvas. clients[data.id] holds
			// the previous position of this user's mouse pointer
			
			
		}
		
		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = $.now();
	});

	var prev = {};
	
	
	
	doc.bind('touchstart',function(e){
	console.log(e);
		e.preventDefault();
		drawing = true;
		prev.x = e.originalEvent.touches[0].pageX;
		prev.y = e.originalEvent.touches[0].pageY;
		//alert(e.originalEvent.touches[0].pageX);	
		// Hide the instructions
		instructions.fadeOut();
	});
	
	doc.bind('touchend',function(){
	
		drawing = false;
	});
	var lastEmit = $.now();
	
		doc.bind('touchmove',function(e){
		
		if($.now() - lastEmit > 30){
			socket.emit('touchmove',{
				'x': e.originalEvent.touches[0].pageX,
				'y': e.originalEvent.touches[0].pageY,
				'drawing': drawing,
				'id': id
			});
			lastEmit = $.now();
		}
		
		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above
		
		if(drawing){
			
			drawLine(prev.x, prev.y, e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
			
			prev.x = e.originalEvent.touches[0].pageX;
			prev.y = e.originalEvent.touches[0].pageY;
		}
	});
	
	
	canvas.on('mousedown',function(e){
		e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
		// Hide the instructions
		instructions.fadeOut();
	});
	
	doc.bind('mouseup mouseleave',function(){

		drawing = false;
	});
	
	

	doc.on('mousemove',function(e){
		if($.now() - lastEmit > 30){
			socket.emit('mousemove',{
				'x': e.pageX,
				'y': e.pageY,
				'drawing': drawing,
				'id': id
			});
			lastEmit = $.now();
		}
		
		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above
		
		if(drawing){
			
			drawLine(prev.x, prev.y, e.pageX, e.pageY);
			
			prev.x = e.pageX;
			prev.y = e.pageY;
		}
	});

	// Remove inactive clients after 10 seconds of inactivity
	setInterval(function(){
		
		for(ident in clients){
			if($.now() - clients[ident].updated > 10000){
				
				// Last update was more than 10 seconds ago. 
				// This user has probably closed the page
				
				cursors[ident].remove();
				delete clients[ident];
				delete cursors[ident];
			}
		}
		
	},10000);

	function drawLine(fromx, fromy, tox, toy){
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.lineWidth = 7;
		ctx.stroke();
	}

});