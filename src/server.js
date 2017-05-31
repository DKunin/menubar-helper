'use strict';

const express = require('express');
const app = express();
const openEditor = require('open-editor');
var spawn = require('child_process').spawn;
let editor = 'sublime';
var fs = require('fs'),
    out = fs.openSync('./out.log', 'a'),
    err = fs.openSync('./out.log', 'a');

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
    let cmd = '';
    result.args.forEach(singleArg => {
        cmd += ' "' + singleArg + '"';
    });
    spawn(result.bin, result.args, {
        stdio: [ 'ignore', out, err ],
        detached: true
    }).unref();
    // exec(cmd, console.log);
    res.send('ok');
});

module.exports = {
    app,
    updateEditor(newEditor) {
        editor = newEditor;
    }
};
