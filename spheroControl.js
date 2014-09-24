var spheron = require('spheron');
var COLORS = spheron.toolbelt.COLORS;
var sphero1 = {
  sphero : spheron.sphero(),
  port: '/dev/rfcomm0',
  color: 0x00ff00,
  connected: false
};
 // = spheron.sphero();
var sphero2 = {
  sphero : spheron.sphero(),
  port: '/dev/rfcomm1',
  color: COLORS.RED,
  connected: false
};
// var sphero2;
var spheroPort1 = '/dev/rfcomm0';
var spheroPort2 = '/dev/rfcomm1';
var spheroContainer = [];

function connectSphero1() {

  console.log('connecting to sphero 1');
  // sphero1 = {
  //     sphero : spheron.sphero(),
  //     port: '/dev/rfcomm0',
  //     color: COLORS.RED,
  //     connected: false
  //   }
    console.log('sphero1 variable set');
  // sphero1.sphero = spheron.sphero();
  console.log('sphero from sphero1 initiated');
  console.log('sphero1 opened');

  sphero1.sphero.once('open', function() {
    console.log('sphero 1 connected');
    try {
      sphero1.sphero.setRGB(sphero1.color);
      sphero1.sphero.resetTimeout(true);
    } catch(err) {
      console.log('error setting color of sphero 1');
      console.log(err);
    }
  });

  sphero1.sphero.on('error', function(err) {
  });

  sphero1.sphero.once('close', function() {
    console.log('Goodnight. Sphero 1');

  });

  sphero1.sphero.once('end', function() {
    console.log('Connection has ended (Sphero 1)');
  });

  sphero1.sphero.open(sphero1.port);
}

function connectSphero2() {

  // sphero2 = {
  //     sphero : spheron.sphero(),
  //     port: '/dev/rfcomm1',
  //     color: 0x00ffff,
  //     connected: false
  //   }
  // sphero2.sphero = spheron.sphero();
  sphero2.sphero.open(sphero2.port);

  sphero2.sphero.on('open', function() {
    console.log('sphero 2 connected');
    try {
      sphero2.sphero.setRGB(sphero2.color);
      sphero1.sphero.resetTimeout(true);
    } catch(err) {
      console.log('error setting color of sphero 2');
      console.log(err);
    }
  });

  sphero2.sphero.on('error', function(err) {
  });  

  sphero2.sphero.on('close', function() {
    console.log('Goodnight. Sphero 2');

  });

  sphero2.sphero.on('end', function() {
    console.log('Connection has ended (Sphero 2)');
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

process.on('connectDevice', function(device) {
  if(device===1) {
    try {
      console.log('should close sphero 1');
      sphero1.sphero.close();
      console.log('sphero 1 closed (no error)');
    } catch (err) {
      console.log('err while closing sphero 1');
    }
    connectSphero1();        
  }
  if(device===2) {
    try {
      console.log('should close sphero 1');
      sphero2.sphero.close();
      console.log('sphero 2 closed (no error)');
    } catch (err) {
      console.log('err while closing sphero 2');
    }
    connectSphero2();    
  }
});

process.on('stopDevice', function(device) {
  if(device===1) {
    sphero1.sphero.roll(0,0,1);
    return;
  }
  if(device===2) {
    sphero2.sphero.roll(0,0,1);
    return;
  }
})

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

  try {
    sphero1.sphero.close();
  } catch (err) {
    console.log('err while closing sphero 1');
  }
  try {
    sphero2.sphero.close();
  } catch (err) {
    console.log('err while closing sphero 2');
  }

  connectSphero1();
  connectSphero2();
}

if(typeof exports !== 'undefined') {
}