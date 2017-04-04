'use strict';

const app = require('./server');
let server;

process.on('message', message => {
    let [command, port] = message.split(' ');

    // eslint-disable-next-line
    console.log(message);
    if (command === 'launch') {
        server = app.listen(port);
    }
    if (command === 'kill') {
        server.close();
    }
});
