const {app, BrowserWindow} = require('electron')
const storage = require('electron-json-storage')
const path = require('path')
const url = require('url')

let win

function createWindow () {
	let args = {
		icon: "app/main.ico",
		frame: false,
		title: "Kubik-bluescreen",
		fullscreen: true,
		height: 800,
		width: 600
	}

	if (process.argv.includes('clearDB'))
		storage.clear()

	win = new BrowserWindow(args)
	
	win.setResizable(false)
	win.setMenu(null)

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'app/index.html'),
		protocol: 'file:',
		slashes: true
	}))

	if (process.argv.includes('dev'))
		win.webContents.openDevTools()

	win.on('closed', () => {
		win = null
	})
}


var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
	if (win) {
		if (win.isMinimized())
	  		win.restore()
		win.focus()
	}
})
  
if (shouldQuit) {
	app.quit()
	return
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (win === null) {
		createWindow()
	}
})
