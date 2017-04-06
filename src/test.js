'use strict';

const execa = require('execa');

execa.shell('/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl'.replace(/\s/g, '\\ ') + ' .')
    .then(result => {
        console.log(result.stdout);
    }).catch(error => {
        console.log(error);
    });
