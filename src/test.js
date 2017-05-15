'use strict';

const serverObject = require('./server');
serverObject.app.listen(7288);
serverObject.updateEditor('vim');
