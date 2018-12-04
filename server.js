const logger = require('./logger'),
	http = require('http'),
    colors = require('colors'),
    zlib = require('zlib'),
    Events = require('events'),
    WebSocketServer = require('websocket').server;

const port = 3001;

var server = http.createServer((req, res) => {
	logger.log('Received request for ' + request.url);
	res.writeHead(404);
	res.end();
});

server.listen(port, () => {
	logger.log(`Server is listening on port ${port}`)
});

const wsServer = new WebSocketServer({httpServer: server, autoAcceptConnection: false});

function originIsAllowed(origin) {
	return true;
}

wsServer.on('request', (req) => {
	if (!originIsAllowed(req.origin)) {
		req.reject();
		logger.log(`Connection from origin ${req.origin}`);
		return;
	}

	let conn = req.accept('echo-protocol', req.origin);
	logger.log('Connection accepted');

	conn.on('message', (msg) => {
		if (msg.type == 'utf8') {
			logger.log('Received utf8 data');
            logger.log(msg.utf8Data);
        } else if (msg.type == 'binary') {
            zlib.gunzip(msg.binaryData, (err, data) => {
                if (err != null) {
                	logger.log('Received binary data');
                	logger.log(msg.binaryData.toString('utf-8'));
                	return;
                }
                logger.log('Received zipped binary data');
                logger.log(data.toString('utf-8'));
            });
        } else {
            logger.err('<!> unsupported data type'.red);
            logger.err(colors.red(msg));
        }
	});

	conn.on('close', (reason, desc) => {
		logger.log(`${conn.remoteAddress} has closed by ${reason}.\n${desc}`);
	});
});