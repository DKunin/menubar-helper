'use strict';

const express = require('express');
const openInEditor = require('open-in-editor');
const app = express();
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
    var editorFunc = openInEditor.configure(
        {
            editor
        },
        () => {}
    );
    editorFunc.open(options).then(
        function() {
            res.sendStatus('Success');
        },
        function(err) {
            res.sendStatus(err);
        }
    );
});

module.exports = {
    app,
    updateEditor(newEditor) {
        editor = newEditor;
    }
};
