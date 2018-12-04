const colors = require('colors');

Levels = {
    debug: 1,
    log: 2,
    warn: 3,
    error: 4
}

class Logger {
    printStackTrace() {
        var e = new Error();
        var stack = e.stack;
        console.log(stack.split("\n")[3]);
    }

    print(msg) {
        msg = msg || "(empty)";
        if (typeof(msg) != 'string') {
            if (typeof(msg) == 'object') {
                msg = JSON.stringify(msg);
            } else {
                msg = msg.toString();
            }
        }

        let timestamp = new Date().toLocaleString('en-US', { timeZone: this.timezone })
        console.log(`[${timestamp}] ${msg}`);
    }

	constructor(level) {
        this.Levels = Levels;
        this.level = level || Levels.debug;
        this.timezone = Logger.timezone || 'Asia/Seoul'
	}

	setLevel(level) {
        this.level = level;
    }

    debug(msg) {
        if (this.level > Levels.debug) return;
        this.print(msg);
    }

    log(msg) {
        if (this.level > Levels.log) return;
        this.print(msg);
    }

    warn(msg) {
        if (this.level > Levels.warn) return;
        console.log('\n[WARN!]');
        this.print(msg);
        let e = new Error();
        console.log(e.stack);
        console.error('\n');
    }

	err(msg, e) {
        console.log(`[${new Date().toISOString()}]`);
		if (msg == null) {
			console.error(colors.bgRed.black(typeof(msg)));
		}
		else if (typeof(msg) == 'object') {
			console.error(msg);
			console.error('\n');

		} else {
			console.error(colors.bgRed(msg))
		}

		e = e || new Error();
		console.error(e.stack);
		console.error('\n');
	}
}


const logger = new Logger();
module.exports = logger;