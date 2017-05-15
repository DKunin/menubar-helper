'use strict';

const express = require('express');
const app = express();
const openEditor = require('open-editor');
var exec = require('child_process').spawn;
let editor = 'sublime';

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.get('/openeditor', function(req, res) {
    let { options = '' } = req.query;
    const result = openEditor.make([ options ], { editor });
    let cmd = result.bin;
    result.args.forEach(singleArg => {
        cmd += ' "' + singleArg + '"';
    });
    console.log(cmd);
    exec(cmd, console.log);
    res.send('ok');
});

module.exports = {
    app,
    updateEditor(newEditor) {
        editor = newEditor;
    }
};
