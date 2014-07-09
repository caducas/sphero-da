var spheron = require('spheron');
var COLORS = spheron.toolbelt.COLORS;
var sphero1 = {
  sphero : spheron.sphero(),
  port: '/dev/rfcomm0',
  color: COLORS.RED,
  connected: false
};
 // = spheron.sphero();
var sphero2 = {
  sphero : {},
  port: '/dev/rfcomm1',
  color: 0x00ffff,
  connected: false
};
// var sphero2;
var spheroPort1 = '/dev/rfcomm0';
var spheroPort2 = '/dev/rfcomm1';
var spheroContainer = [];

function connectSphero1() {
  sphero1.sphero = spheron.sphero();
  sphero1.sphero.open(sphero1.port);

  sphero1.sphero.on('open', function() {
    console.log('sphero 1 connected');
    sphero1.sphero.setRGB(sphero1.color);
  });

  sphero1.sphero.on('error', function(err) {
  });
}

function connectSphero2() {
  sphero2.sphero = spheron.sphero();
  sphero2.sphero.open(sphero2.port);

  sphero2.sphero.on('open', function() {
    console.log('sphero 2 connected');
    sphero2.sphero.setRGB(sphero2.color);
  });

  sphero2.sphero.on('error', function(err) {
  });  
}

process.on('controllSphero', function(device, direction, speed) {
  if(device===1) {
    try {
      sphero1.sphero.roll(speed,direction,1); 
    } catch (err) {
      console.log(err);
    }
  }
  if(device===2) {
    try {
      sphero2.sphero.roll(speed,direction,1); 
    } catch (err) {
      console.log(err);
    }    
  }
});

process.on('startCalibration', function(device) {
  if(device===1) {
    startCalibration(sphero1.sphero);
  }
  if(device===2) {
    startCalibration(sphero2.sphero);
  }
});

process.on('finishCalibration', function(device) {
  if(device===1) {
    finishCalibration(sphero1.sphero);
  }
  if(device===2) {
    finishCalibration(sphero2.sphero);
  }
});

process.on('connectDevices', function() {
  connectDevices();
});

function startCalibration(sphero) {
    sphero.setBackLED(255);
    sphero.setStabilisation(0);
}

function finishCalibration(sphero) {
  sphero.setHeading(0);
  sphero.setBackLED(0);
  sphero.setStabilisation(1);
}

function connectDevices() {
  connectSphero1();
  connectSphero2();
}

if(typeof exports !== 'undefined') {
}