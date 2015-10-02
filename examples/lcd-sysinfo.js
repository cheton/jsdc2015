var five = require('johnny-five');
var board = new five.Board();
var os = require("os");
var ip = require('ip');

board.on('ready', function() {
    // I2C LCD, PCF8574
    var lcd = new five.LCD({
        controller: 'PCF8574',
        rows: 4,
        cols: 20
    });

    this.repl.inject({
        lcd: lcd
    });

    lcd.clear();
    lcd.cursor(0, 0).print(os.hostname());
    lcd.cursor(1, 0).print(ip.address());
});
