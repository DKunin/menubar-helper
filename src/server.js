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

app.get('/openeditor', async (req, res) => {
    const { options = '' } = req.query;

    const params = { editor };
    console.log(options);

    // Running VS code inside electron on Mac does not work if path contains spaces. But works well with command line shortcut
    if (editor === 'code' && fs.existsSync(vsCodeCmd)) {
        params.cmd = vsCodeCmd;
    }
    console.log(params);

    const editorFunc = openInEditor.configure(params, () => {});
    // editorFunc.open(options);
    // res.send('ok');
    try {
        await editorFunc.open(options);
        res.send('ok');
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to launch editor:', err);
        let message = err.message;
        if (message && message.toLowerCase().includes('not found')) {
            message = 'Editor not detected';
        }
        res.status(500).send(message);
    }
});

var editorTest = openInEditor.configure({}, function (err) {
    console.error("Something went wrong: " + err);
});

editorTest.open("/Users/dkunin/Projects/work-agenda/README.md:20:1").then(
    function () {
        console.log("Success!");
    },
    function (err) {
        console.error("Something went wrong: " + err);
    }
);


module.exports = {
    app,
    updateEditor(newEditor) {
        editor = newEditor;
    }
};
