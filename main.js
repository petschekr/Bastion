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