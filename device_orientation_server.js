
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var analyzer = require(__dirname + '/analyzer');
var spheroControl = require(__dirname + '/spheroControl');
var shellExecutor = require('child_process');
// spheroControl.connectSpheros();
// var spheroControl = require(__dirname + '/cylon_test.js');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('home.jade');
	io.sockets.once('connection', function (socket) {
		// spheroControl = require(__dirname + '/spheroControl');

		socket.on('control', function(device, direction, speed) {
  			process.emit('controllSphero', device, Math.round(direction), Math.round(speed));
		});

		socket.on('startCalibration', function(device) {
			process.emit('startCalibration', device);
		});

		socket.on('finishCalibration', function(device) {
			process.emit('finishCalibration', device);
		});

		socket.on('connectDevices', function() {
			process.emit('connectDevices');
		});

		socket.on('connectDevice', function(device) {
			process.emit('connectDevice', device);
		});

		socket.on('stopDevice', function(device) {
			process.emit('stopDevice', device);
		});
	});
});


process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) {
    	console.log('should clean');
    	var cmd = "screen -dmS spheroserver bash -c 'cd ~/sphero-da ; node device_orientation_server.js'";
    	shellExecutor.exec(cmd);
    }
    if (err) {
    	console.log(err.stack);
    	console.log(err);
    }
    if (options.exit) {
    	console.log('should exit');
    	process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});