'use strict';

const serverObject = require('./server');
let server;

process.on('message', message => {
    let [command, port, editorPath] = message.split(' ');

    if (command === 'launch') {
        server = serverObject.app.listen(port);
        serverObject.updatePath(editorPath);
    }
    if (command === 'kill') {
        server.close();
    }
});
