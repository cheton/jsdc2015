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

    var animChars = [
        'runninga',
        'runningb'
    ];
    var frame = 1;
    var col = 0;
    var row = 0;

    lcd.useChar(animChars[0])
       .useChar(animChars[1]);

    board.loop(300, function() {
        frame = (frame + 1) % animChars.length;

        lcd.clear()
            .cursor(row, col)
            .print(':' + animChars[frame] + ':');

        if (++col >= lcd.cols) {
            col = 0;
            if (++row >= lcd.rows) {
                row = 0;
            }
        }
    });
});
