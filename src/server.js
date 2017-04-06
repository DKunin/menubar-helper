'use strict';

const express = require('express');
const execa = require('execa');
const path = require('path');
const app = express();
let editorPath = '';

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
    options = options.replace(/\s/g, '\\ ');
    execa.shell(path.normalize(editorPath) + ' ' + (options ? options : ''))
        .then(result => res.send(result.stdout))
        .catch(error => res.send(error));
});

module.exports = {
    app,
    updatePath: function(newPath) {
        editorPath = unescape(newPath).replace(/\s/g, '\\ ');
    }
};
