var spheron = require('spheron');
var sphero = spheron.sphero();
var spheroPort = 'COM3';
var COLORS = spheron.toolbelt.COLORS;

sphero.on('open', function() {
  sphero.setRGB(COLORS.BLUE, false);
  sphero.roll(128, 0, 1);
});

sphero.open(spheroPort);