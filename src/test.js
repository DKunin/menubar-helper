'use strict';

const serverObject = require('./server');
serverObject.app.listen(7289);
serverObject.updateEditor('sublime');
