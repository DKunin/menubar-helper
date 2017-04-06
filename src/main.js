'use strict';

const DEFAULT_PORT = 7288;

const path = require('path');
const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const Tray = electron.Tray;
const BrowserWindow = electron.BrowserWindow;
const fork = require('child_process').fork;
// var shell = require('electron').shell;

let port = DEFAULT_PORT;
let editorPath = '';

// var iconPath = {
//     active: path.resolve(__dirname, '../res/mac-icon.png'),
//     inactive: path.resolve(__dirname, '../res/mac-icon-gray.png')
// };

let appIcon = null;
let server = null;
let win = null;
let contextMenu = null;

function startServer() {
    server = fork(path.resolve(__dirname, './launch.js'));
    server.send(`launch ${port} ${editorPath}`);
    console.log(`launch ${port} ${editorPath}`);
    // if (appIcon) {
    //     appIcon.setImage(iconPath.active);
    // }

    if (contextMenu) {
        contextMenu.items[0].visible = false;
        contextMenu.items[1].visible = true;
        contextMenu.items[2].visible = true;
    }
}

function killServer() {
    if (server) {
        server.send(`kill ${port}`);
        server.kill();

        // if (appIcon) {
        //     appIcon.setImage(iconPath.inactive);
        // }

        if (contextMenu) {
            contextMenu.items[0].visible = true;
            contextMenu.items[1].visible = false;
            contextMenu.items[2].visible = false;
        }
    }
}

function sync(newConfig) {
    port = isNaN(newConfig.port) ? DEFAULT_PORT : Number(newConfig.port);
    editorPath = newConfig.editorPath;
    killServer();
    startServer();
}

global.config = {
    editorPath,
    port,
    sync
};

// available on MacOS only
if (app.dock) {
    app.dock.hide();
}

app.on('ready', function() {
    win = new BrowserWindow({
        title: 'Change server port',
        show: false,
        width: 250,
        height: 200,
        closable: false,
        minimizable: false,
        resizable: false,
        // vibrancy: 'dark',
        fullscreenable: false
    });
    win.setPosition(900, 25);
    win.loadURL('file://' + __dirname + '/index.html');

    // appIcon = new Tray(iconPath.inactive);
    console.log(path.resolve(__dirname, '../icon.png'));
    appIcon = new Tray(path.resolve(__dirname, '../icon.png'));

    startServer();

    var startMenuItem = new MenuItem({
        label: 'Start server',
        visible: false,
        click: function() {
            if (!server || server.killed || !server.connected) {
                startServer();
            }
        }
    });
    var stopMenuItem = new MenuItem({
        label: 'Stop server',
        visible: true,
        click: function() {
            killServer();
        }
    });
    contextMenu = Menu.buildFromTemplate([
        startMenuItem,
        stopMenuItem,
        {
            label: 'Change settings',
            click: function() {
                win.show();
            }
        },
        {
            label: 'Quit',
            click: function() {
                killServer();
                win.setClosable(true);
                app.quit();
            }
        }
    ]);

    // appIcon.setContextMenu(contextMenu);
});

app.on('window-all-closed', function() {
    if (appIcon) {
        appIcon.destroy();
    }
});
