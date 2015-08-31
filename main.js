var app = require("app");
var dialog = require("dialog");
var ipc = require("ipc");
var BrowserWindow = require("browser-window");

var mainWindow = null;

app.on("window-all-closed", function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

ipc.on("database", function(event) {
	event.returnValue = app.getPath("userData");
});

app.on("ready", function() {
	mainWindow = new BrowserWindow({
		"width": 1000,
		"height": 660,
		"center": true,
		"min-width": 800,
		"min-height": 400,
		"title": "Bastion"
	});
	mainWindow.loadUrl("file://" + __dirname + "/index.html");
	mainWindow.setMenu(null);

	mainWindow.openDevTools();

	mainWindow.on("closed", function() {
		mainWindow = null;
	});
});