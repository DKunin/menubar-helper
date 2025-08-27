"use strict";

const DEFAULT_PORT = 7288;

const path = require("path");
const electron = require("electron");
const Config = require("electron-config");
const app = electron.app;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const Tray = electron.Tray;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const fork = require("child_process").fork;

// var shell = require('electron').shell;

let port = DEFAULT_PORT;
let editor = "sublime";

const config = new Config({
    defaults: {
        editor,
        port,
    },
});

global.config = config;
// var iconPath = {
//     active: path.resolve(__dirname, '../res/mac-icon.png'),
//     inactive: path.resolve(__dirname, '../res/mac-icon-gray.png')
// };

let appIcon = null;
let server = null;
let win = null;
let contextMenu = null;

function startServer() {
    server = fork(path.resolve(__dirname, "./launch.js"));
    server.send(`launch ${config.get("port")} ${config.get("editor")}`);
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

function restartServer(forceRestart) {
    win.hide();
    if (forceRestart) {
        killServer();
        startServer();
    }
}

global.restartServer = restartServer;

ipcMain.handle("get-config", () => ({
    port: config.get("port"),
    editor: config.get("editor"),
}));

ipcMain.handle("set-config", (event, values) => {
    config.set(values);
});

ipcMain.handle("restart-server", (event, forceRestart) => {
    restartServer(forceRestart);
});

// available on MacOS only
if (app.dock) {
    app.dock.hide();
}

app.on("ready", function () {
    win = new BrowserWindow({
        title: "Change settings",
        show: false,
        // width: 350,
        // height: 180,
        width: 800,
        height: 600,
        closable: false,
        minimizable: false,
        resizable: true,
        vibrancy: "dark",
        fullscreenable: false,
        webPreferences: {
            preload: path.resolve(__dirname, "./preload.js"),
            contextIsolation: true,
            nodeIntegration: true,
        },
    });
    win.setPosition(900, 25);
    win.loadURL("file://" + __dirname + "/index.html");
    win.webContents.openDevTools();
    appIcon = new Tray(path.resolve(__dirname, "../assets/images/icon-16.png"));

    startServer();

    var startMenuItem = new MenuItem({
        label: "Start server",
        visible: false,
        click: function () {
            if (!server || server.killed || !server.connected) {
                startServer();
            }
        },
    });
    var stopMenuItem = new MenuItem({
        label: "Stop server",
        visible: true,
        click: function () {
            killServer();
        },
    });
    contextMenu = Menu.buildFromTemplate([
        startMenuItem,
        stopMenuItem,
        {
            label: "Change settings",
            click: function () {
                win.show();
            },
        },
        {
            label: "Quit",
            click: function () {
                killServer();
                win.setClosable(true);
                app.quit();
            },
        },
    ]);

    appIcon.setContextMenu(contextMenu);
});

app.on("window-all-closed", function () {
    if (appIcon) {
        appIcon.destroy();
    }
});

