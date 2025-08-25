'use strict';

const serverObject = require('./server');
let server;

process.on('message', (message) => {
    let [command, port, editor] = message.split(' ');

    if (command === 'launch') {
        server = serverObject.app.listen(port);
        serverObject.updateEditor(editor);
    }
    if (command === 'kill') {
        server.close();
    }
});
