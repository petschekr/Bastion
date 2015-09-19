"use strict";

var app = require("app");
var dialog = require("dialog");
var ipc = require("ipc");
var BrowserWindow = require("browser-window");
var fs = require("fs");

var windowStateKeeper = require("./core/windowstate.js");
var devMenu = require("./core/devmenu.js");

var mainWindow = null;

var mainWindowState = windowStateKeeper("main", {
	"width": 1000,
	"height": 660
});

app.on("window-all-closed", function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

ipc.on("database", function (event) {
	event.returnValue = app.getPath("userData");
});
ipc.on("open", function (event, data) {
	dialog.showOpenDialog(mainWindow, {
		"title": data.title || "Open",
		"defaultPath": app.getPath("home"),
		"filters": data.filters,
		"properties": [
			"openFile"
		]
	}, function (file) {
		// file === null if the dialog was canceled
		if (!file)
			return;
		event.sender.send("open-response", file);
	});
});
ipc.on("save", function (event, data) {
	dialog.showSaveDialog(mainWindow, {
		"title": data.title || "Open",
		"defaultPath": app.getPath("home"),
		"filters": data.filters
	}, function (file) {
		// file === null if the dialog was canceled
		if (!file)
			return;
		event.sender.send("save-response", file);
	});
});

app.on("ready", function() {
	mainWindow = new BrowserWindow({
		"x": mainWindowState.x,
		"y": mainWindowState.y,
		"width": mainWindowState.width,
		"height": mainWindowState.height,
		"center": true,
		"min-width": 800,
		"min-height": 400,
		"title": "Bastion"
	});
	if (mainWindowState.isMaximized) {
        mainWindow.maximize();
    }
	
	mainWindow.loadUrl("file://" + __dirname + "/index.html");
	
	var env = JSON.parse(fs.readFileSync(__dirname + "/env_config.json", "utf8"));
	if (env.name === "development") {
		devMenu.setDevMenu();
		mainWindow.openDevTools();	
	}
	else {
		mainWindow.setMenu(null);
	}
	
	mainWindow.on('close', function () {
		mainWindowState.saveState(mainWindow);
    });
	mainWindow.on("closed", function() {
		mainWindow = null;
	});
});