var app = require("app");
var BrowserWindow = require("browser-window");

var mainWindow = null;

app.on("window-all-closed", function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
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

	mainWindow.openDevTools();

	mainWindow.on("closed", function() {
		mainWindow = null;
	});
});