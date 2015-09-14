"use strict";

var app = require("app");
var fs = require("fs");

module.exports = function (name, defaults) {

    var userDataDir = app.getPath("userData");
    var stateStoreFile = `window-state-${name}.json`;
	
	var state;
	try {
		state = JSON.parse(fs.readFileSync(stateStoreFile, "utf8"));
	}
	catch (e) {
	 	state = {
        	width: defaults.width,
        	height: defaults.height
    	};
	};

    var saveState = function (window) {
        if (!window.isMaximized() && !window.isMinimized()) {
            var position = window.getPosition();
            var size = window.getSize();
            state.x = position[0];
            state.y = position[1];
            state.width = size[0];
            state.height = size[1];
        }
        state.isMaximized = window.isMaximized();
		fs.writeFileSync(stateStoreFile, JSON.stringify(state), {"encoding": "utf8"});
    };

    return {
        get x() { return state.x },
        get y() { return state.y },
        get width() { return state.width },
        get height() { return state.height },
        get isMaximized() { return state.isMaximized },
        saveState: saveState
    };
};