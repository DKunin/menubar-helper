'use strict';

const express = require('express');
const openInEditor = require('open-in-editor');
const fs = require('fs');
const app = express();
let editor = 'sublime';

const vsCodeCmd = '/usr/local/bin/code';

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.get('/openeditor', function (req, res) {
    let { options = '' } = req.query;

    const params = { editor };

    // Running VS code inside electron on Mac does not work if path contains spaces. But works well with command line shortcut
    if (editor === 'code' && fs.existsSync(vsCodeCmd)) {
        params.cmd = vsCodeCmd;
    }

    const editorFunc = openInEditor.configure(params, () => {});
    editorFunc.open(options);
    res.send('ok');
});

module.exports = {
    app,
    updateEditor(newEditor) {
        editor = newEditor;
    }
};
