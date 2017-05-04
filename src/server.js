'use strict';

const express = require('express');
const app = express();
const openEditor = require('./open-editor');
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
    openEditor([ options ], { editor });
    res.send('ok');
});

module.exports = {
    app,
    updateEditor(newEditor) {
        editor = newEditor;
    }
};
