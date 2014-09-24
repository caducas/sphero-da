var socket = io.connect();

// var ball   = document.querySelector('.ball');
// var garden = document.querySelector('.garden');
// var output = document.querySelector('.output');

// var maxX = garden.clientWidth  - ball.clientWidth;
// var maxY = garden.clientHeight - ball.clientHeight;
var device = 0;

socket.on('connect_error', function(err) {
  // handle server error here
  console.log('Error connecting to server - should close now');
  window.location.reload();
});

function handleOrientation(event) {
  if(device === 0) {
    return;
  }
  var x = event.beta;  // In degree in the range [-180,180]
  var y = event.gamma; // In degree in the range [-90,90]
  
  if(x<-50) {
    x = -50;
    console.log('x is now -50');
  }
  if(x>50) {
    x=50;
    console.log('x is now 50');
  }
  if(y<-50) {
    y=-50;
    console.log('x is now 50');
  }
  if(y>50) {
    y=50;
  }

  socket.emit('control', device, getDirection(x,y), getSpeed(x,y));

  // output.innerHTML  = "beta : " + x + "\n";
  // output.innerHTML += "gamma: " + y + "\n";
  // output.innerHTML += "direction: " + getDirection(x,y) + "\n";
  // output.innerHTML += "speed: " + getSpeed(x,y) + "\n";

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  // if (x >  90) { x =  90};
  // if (x < -90) { x = -90};

  // // To make computation easier we shift the range of 
  // // x and y to [0,180]
  // x += 90;
  // y += 90;

  // ball.style.top  = (maxX*x/180 - 10) + "px";
  // ball.style.left = (maxY*y/180 - 10) + "px";

}

function startCalibration() {
  socket.emit('startCalibration', device);
}

function finishCalibration() {
  socket.emit('finishCalibration', device);
}

function selectDevice(deviceNumber) {
  device = deviceNumber;
  $('#controlArea').show();
  $('#deviceSelectionArea').hide();
  $('#btnFinishCalibration').hide();
  $('#btnStartCalibration').show();

  // socket.emit('selectDevice', deviceNumber);
}

function connectDevices() {
  socket.emit('connectDevices');
}

function connectDevice(device) {
  socket.emit('connectDevice', device);
}

function backToMainMenu() {
  $('#deviceSelectionArea').show();
  $('#controlArea').hide();
  stopSphero(device);
  device = 0;
}

function stopSphero(dev) {
  socket.emit('stopDevice', dev);
}

window.addEventListener('deviceorientation', handleOrientation);

$('#btnFinishCalibration').bind('click', function() {
  finishCalibration();
  $('#btnFinishCalibration').hide();
  $('#btnStartCalibration').show();
});

$('#btnStartCalibration').bind('click', function() {
  startCalibration();
  $('#btnFinishCalibration').show();
  $('#btnStartCalibration').hide();  
});

$('#btnStartGame').bind('click', function() {
  startGame();
  $('#controlArea').hide();
  $('#deviceSelectionArea').hide();
});

$('#controlArea').hide();
$('#gameSelectionArea').hide();
$('#deviceSelectionArea').show();

$('#btnDeviceOne').bind('click', function() {
  selectDevice(1);
});

$('#btnDeviceTwo').bind('click', function() {
  selectDevice(2);
});

$('#btnConnectDevices').bind('click', function() {
  connectDevices();
});

$('#btnConnectSphero1').bind('click', function() {
  // $('#btnConnectSphero1').hide();
  connectDevice(1);
  // setTimeout(function() {
  //   $('#btnConnectSphero1').show();
  // },5000);
});

$('#btnConnectSphero2').bind('click', function() {
  // $('#btnConnectSphero2').hide();
  connectDevice(2);
  // setTimeout(function() {
  //   $('#btnConnectSphero2').show();
  // },5000);
});

$('#controlAreaBackToMenu').bind('click', function() {
  backToMainMenu();
});

