var Cylon = require('cylon');


Cylon.robot({

  // connections: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm1' },
  // devices: { name: 'sphero', driver: 'sphero' },
  connections: [
    { name: 'sphero1', adaptor: 'sphero', port: '/dev/rfcomm0' },
    { name: 'sphero2', adaptor: 'sphero', port: '/dev/rfcomm1' }
  ],
  devices: [
    { name: 'sphero1', driver: 'sphero' , connection: 'sphero1'},
    { name: 'sphero2', driver: 'sphero' , connection: 'sphero2'}
  ],

  work: function(my) {
    var color1 = 0x00FFFF,
        color2 = 0x00FF00,
        bitFilter = 0xFFFF00;


    my.sphero1.on('connect', function() {
      console.log('Sphero controller 1 started');
      // console.log("Setting up Collision Detection...");
      // my.sphero.detectCollisions();
      my.sphero1.detectLocator();
      my.sphero1.setRGB(color1);
      my.sphero1.configureLocator(0,0,0,0);
      // console.log('stop sphero');
      my.sphero1.stop();
        my.sphero1.setHeading(90);
      // my.sphero.roll(60,90);
    });

    my.sphero2.on('connect', function() {
      console.log('Sphero controller 2 started');
      // console.log("Setting up Collision Detection...");
      // my.sphero.detectCollisions();
      my.sphero2.detectLocator();
      my.sphero2.setRGB(color2);
      my.sphero2.configureLocator(0,0,0,0);
      // console.log('stop sphero');
      my.sphero2.stop();
        my.sphero2.setHeading(90);
      // my.sphero.roll(60,90);
    });


    process.on('controllSphero', function(device, direction, speed) {
      console.log('moves '+direction+' degree with speed '+speed);
      if(device===1) {
        my.sphero1.roll(speed,direction);
      }
      if(device===2) {
        my.sphero2.roll(speed,direction);        
      }
      // if(sideMovement>0) {
      //   console.log('will move right now');
      //   my.sphero.roll(60,90);
      // }
      // if(sideMovement<0) {
      //   console.log('will move left now');
      //   my.sphero.roll(60,90);
      // }
    });

    process.on('startCalibration', function(device) {
      if(device===1) {
        my.sphero1.startCalibration();
      }
      if(device===2) {
        my.sphero2.startCalibration();
      }
    });

    process.on('finishCalibration', function(device) {
      if(device===1) {
        my.sphero1.finishCalibration();
      }
      if(device===2) {
        my.sphero2.finishCalibration();
      }
    });
    // every((1).second(), function() { 
    //   my.sphero.roll(60, Math.floor(Math.random() * 360));
    // });
    // my.sphero.on('collision', function(data) {
    //   console.log("Collision:");
    //   color = color ^ bitFilter;
    //   console.log("Color: " + (color.toString(16)) + " ");
    //   my.sphero.setRGB(color);
    //   my.sphero.roll(128, Math.floor(Math.random() * 360));
    // });

  }
}).start();


