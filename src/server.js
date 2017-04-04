'use strict';

const express = require('express');
const execa = require('execa');
const path = require('path');
const app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.get('/openeditor/:command', function(req, res) {
    let { options = '' } = req.query;
    const command = path.normalize(req.params.command.replace(/_/g, '/').replace(/\s/g, '\\ '));
    options = options.replace(/_/g, '/').replace(/\s/g, '\\ ');
    execa.shell(command + ' ' + (options ? options : ''))
        .then(result => res.send(result.stdout));
});

// app.get('/command/:command', function(req, res) {
//     let { options = '' } = req.query;
//     const command = path.normalize(req.params.command.replace(/_/g, '/').replace(/\s/g, '\\ '));
//     options = options.replace(/_/g, '/').replace(/\s/g, '\\ ');
//     execa.shell(command + ' ' + (options ? options : ''))
//         .then(result => res.send(result.stdout));
// });


// app.get('/silent/:command', function(req, res) {
//     let { options = '' } = req.query;
//     const command = path.normalize(req.params.command.replace(/_/g, '/').replace(/\s/g, '\\ '));
//     options = options.replace(/_/g, '/').replace(/\s/g, '\\ ');
//     execa.shell(command + ' ' + (options ? options : ''))
//         .then(() => res.send('<script>window.close();</script>'));
// });

module.exports = app;