'use strict';

const serverObject = require('./server');
serverObject.app.listen(7288);
serverObject.updatePath('/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl');
